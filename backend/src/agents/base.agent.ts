import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { RedisCacheService } from 'src/redis/redis.service';

type ResponseFormat = ChatCompletionCreateParamsBase['response_format'];

export interface Tool {
  name: string;
  description?: string;
  execute: (...args: any[]) => Promise<any> | any;
}

interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface Message {
  role: string;
  content: string | null;
  tool_calls?: ToolCall[];
  type?: string;
  agent_name?: string;
}

interface FunctionSchema {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, { type: string }>;
      required: string[];
    };
  };
}

@Injectable()
export class BaseAgent {
  protected client: OpenAI;
  protected thread: Message[] = [];
  protected overallThread: Message[] = [];
  protected toolsMap: Record<string, Tool['execute']> = {};

  constructor(
    protected readonly configService: ConfigService,
    protected readonly redisCacheService: RedisCacheService,
    protected readonly name: string,
    protected readonly model: string,
    protected readonly instructions: string,
    protected readonly sessionId: string | null = null,
    protected readonly temperature: number = 1,
    protected readonly tools: Tool[] = [],
  ) {
    this.client = new OpenAI({
      baseURL: this.configService.get('LLM_BASE_URL'),
      apiKey: this.configService.get('LLM_API_KEY'),
    });

    if (this.tools.length) {
      this.toolsMap = this.tools.reduce(
        (acc, tool) => {
          acc[tool.name] = tool.execute;
          return acc;
        },
        {} as Record<string, Tool['execute']>,
      );
    }

    this.initializeThread();
  }

  private async initializeThread(): Promise<void> {
    if (this.sessionId) {
      this.thread = (await this.redisCacheService.get(
        `${this.name}${this.sessionId}`,
      )) || [{ role: 'system', content: this.instructions }];

      this.overallThread = (await this.redisCacheService.get(
        `conversation:${this.sessionId}`,
      )) || [{ role: 'system', content: this.instructions }];
    } else {
      this.thread = [{ role: 'system', content: this.instructions }];
      this.overallThread = [{ role: 'system', content: this.instructions }];
    }
  }

  protected executeToolCall(toolCall: ToolCall): any {
    const name = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    console.log(`Assistant: ${name}(${JSON.stringify(args)})`);
    return this.toolsMap[name](...Object.values(args));
  }

  protected functionToSchema(tool: Tool): FunctionSchema {
    const funcStr = tool.execute.toString();
    const paramMatch = funcStr.match(/\((.*?)\)/);
    const params = paramMatch
      ? paramMatch[1].split(',').map((p) => p.trim())
      : [];

    const parameters: Record<string, { type: string }> = {};
    params.forEach((param) => {
      if (param) {
        parameters[param] = { type: 'string' };
      }
    });

    return {
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description || '',
        parameters: {
          type: 'object',
          properties: parameters,
          required: params.filter((p) => p !== ''), // All params are required by default
        },
      },
    };
  }

  protected toolsToToolSchema(): FunctionSchema[] {
    return this.tools.map((tool) => this.functionToSchema(tool));
  }

  async run(
    query: string,
    responseFormat?: ResponseFormat,
    maxToolCalls = 1,
  ): Promise<Message[]> {
    try {
      this.thread.push({ role: 'user', content: query });
      this.overallThread.push({ role: 'user', content: query });

      if (!this.tools.length) {
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: this.thread as any,
          temperature: this.temperature,
          response_format: responseFormat,
        });

        const message = response.choices[0].message.content;
        const assistantMessage = { role: 'assistant', content: message };

        this.thread.push(assistantMessage);
        this.overallThread.push(assistantMessage);
        await this.saveThread();

        return this.overallThread;
      }

      const toolSchemas = this.toolsToToolSchema();
      let toolCallCount = 0;

      while (toolCallCount < maxToolCalls) {
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: this.thread as any,
          tools: toolSchemas,
          temperature: this.temperature,
          response_format: responseFormat,
        });

        const message = response.choices[0].message;
        const assistantMessage: Message = {
          role: 'assistant',
          content: message.content,
          type: 'text',
          agent_name: this.name,
        };

        if (message.tool_calls) {
          assistantMessage.tool_calls = message.tool_calls.map((toolCall) => ({
            id: toolCall.id,
            type: toolCall.type,
            function: {
              name: toolCall.function.name,
              arguments: toolCall.function.arguments,
            },
          }));
        }

        this.thread.push(assistantMessage);
        this.overallThread.push(assistantMessage);

        if (!message.tool_calls) {
          break;
        }

        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name in this.toolsMap) {
            try {
              console.log('calling tool: ', toolCall.function);
              const result = await this.executeToolCall(toolCall);
              const toolResponse: Message = {
                role: 'tool',
                content: result ? JSON.stringify(result) : '{}',
                type: this.getToolResponseType(toolCall.function.name),
                agent_name: this.name,
              };
              this.thread.push(toolResponse);
              this.overallThread.push(toolResponse);
            } catch (error) {
              console.error(`Tool execution error: ${error}`);
              const toolResponse: Message = {
                role: 'tool',
                content: JSON.stringify({ error: error.message }),
                type: 'error',
                agent_name: this.name,
              };
              this.thread.push(toolResponse);
              this.overallThread.push(toolResponse);
            }
          } else {
            console.warn(`Warning: Tool ${toolCall.function.name} not found!`);
          }
        }

        toolCallCount++;
      }

      await this.saveThread();
      return this.overallThread;
    } catch (error) {
      console.error('Exception occurred:', error);
      throw error;
    }
  }

  private getToolResponseType(toolName: string): string {
    if (toolName === 'get_files_with_description') {
      return 'json-files';
    }
    if (['get_button'].includes(toolName)) {
      return 'json-button';
    }
    if (this.name === 'coder_agent') {
      return 'code';
    }
    return 'text';
  }

  private async saveThread(): Promise<void> {
    if (this.sessionId) {
      await this.redisCacheService.set(
        `${this.name}${this.sessionId}`,
        this.thread,
      );
      await this.redisCacheService.set(
        `conversation:${this.sessionId}`,
        this.overallThread,
      );
    }
  }
}
