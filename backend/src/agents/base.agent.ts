import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { RedisCacheService } from 'src/redis/redis.service';
import { MessageType } from 'src/types/message.types';

interface AnthropicContent {
  type: 'text';
  text: string;
}

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
  protected client: OpenAI | Anthropic;
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
    protected readonly clientType: string = 'openai',
  ) {
    if (this.clientType === 'anthropic') {
      this.client = new Anthropic({
        apiKey: this.configService.get('ANTHROPIC_API_KEY'),
      });
    } else {
      this.client = new OpenAI({
        baseURL: this.configService.get('LLM_BASE_URL'),
        apiKey: this.configService.get('LLM_API_KEY'),
      });
    }

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
        if (this.clientType === 'anthropic') {
          const anthropicClient = this.client as Anthropic;
          const response = await anthropicClient.messages.create({
            model: this.model,
            max_tokens: 8192,
            messages: [
              {
                role: 'user',
                content: query,
              },
            ],
            system: this.instructions,
          });

          const message = (response.content[0] as AnthropicContent).text;
          const assistantMessage: Message = {
            role: 'assistant',
            content: JSON.stringify({ message }),
            type: MessageType.CODE,
          };

          this.thread.push(assistantMessage);
          this.overallThread.push(assistantMessage);
          await this.saveThread();

          return this.overallThread;
        } else {
          const openaiClient = this.client as OpenAI;
          const response = await openaiClient.chat.completions.create({
            model: this.model,
            messages: this.thread as any,
            temperature: this.temperature,
            response_format: responseFormat,
          });

          const message = response.choices[0].message.content;
          const assistantMessage: Message = {
            role: 'assistant',
            content: message,
            type: MessageType.TEXT,
          };

          this.thread.push(assistantMessage);
          this.overallThread.push(assistantMessage);
          await this.saveThread();

          return this.overallThread;
        }
      }

      const toolSchemas = this.toolsToToolSchema();
      let toolCallCount = 0;

      while (toolCallCount < maxToolCalls) {
        if (this.clientType === 'anthropic') {
          throw new Error('Tool calls are not yet supported with Anthropic');
        }

        const openaiClient = this.client as OpenAI;
        const response = await openaiClient.chat.completions.create({
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
          type: MessageType.TEXT,
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
                type: MessageType.ERROR,
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

  private getToolResponseType(toolName: string): MessageType {
    if (toolName === 'get_files_with_description') {
      return MessageType.JSON_FILES;
    }
    if (['get_button'].includes(toolName)) {
      return MessageType.JSON_BUTTON;
    }
    if (this.name === 'coder_agent') {
      return MessageType.CODE;
    }
    return MessageType.TEXT;
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
