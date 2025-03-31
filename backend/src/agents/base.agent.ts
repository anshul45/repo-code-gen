import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import type {
  ChatCompletionContentPart,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionToolMessageParam,
} from 'openai/resources/chat/completions';
import { RedisCacheService } from 'src/redis/redis.service';
import { MessageType } from 'src/types/message.types';
import { jsonrepair } from 'jsonrepair';
import { parse } from 'json5';

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

type MessageRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';

export interface BaseMessage {
  role: MessageRole;
  type?: string;
  agent_name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface TextMessage extends BaseMessage {
  content: string | null;
}

export interface ContentPartsMessage extends BaseMessage {
  content: ChatCompletionContentPart[];
}

export type Message = TextMessage | ContentPartsMessage;

type ChatMessage =
  | ChatCompletionSystemMessageParam
  | ChatCompletionUserMessageParam
  | ChatCompletionAssistantMessageParam
  | ChatCompletionToolMessageParam;

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
  protected thread!: Message[];
  protected overallThread!: Message[];
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
    protected readonly baseUrl: string | null = null,
    protected readonly apiKey: string | null = null,
    protected readonly clientType: string = 'openai',
  ) {
    if (this.clientType === 'anthropic') {
      this.client = new Anthropic({
        apiKey: this.configService.get('ANTHROPIC_API_KEY'),
      });
    } else {
      this.client = new OpenAI({
        baseURL: baseUrl || this.configService.get('LLM_BASE_URL'),
        apiKey: apiKey || this.configService.get('LLM_API_KEY'),
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

    this.thread = [{ role: 'system', content: this.instructions }];
    this.overallThread = [{ role: 'system', content: this.instructions }];
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
          required: params.filter((p) => p !== ''),
        },
      },
    };
  }

  protected toolsToToolSchema(): FunctionSchema[] {
    return this.tools.map((tool) => this.functionToSchema(tool));
  }

  protected convertToOpenAIMessage(msg: Message): ChatMessage {
    if (Array.isArray(msg.content)) {
      return {
        role: msg.role,
        content: msg.content,
      } as ChatCompletionUserMessageParam;
    }

    const baseMessage = {
      role: msg.role,
      content: msg.content || '',
    };

    if (msg.tool_calls) {
      return {
        ...baseMessage,
        tool_calls: msg.tool_calls,
        tool_call_id: msg.tool_call_id,
      } as ChatCompletionAssistantMessageParam;
    }

    if (msg.tool_call_id) {
      return {
        ...baseMessage,
        tool_call_id: msg.tool_call_id,
      } as ChatCompletionToolMessageParam;
    }

    return baseMessage as ChatMessage;
  }

  robustJSONParse(input: string): any {
    try {
      const clean = input.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
      const cleanJSON = clean
        .replace('```', '')
        .replace('json', '')
        .replace('```', '')
        .replace('typescescript', '')
        .replace('tsx', '');

      const repaired = jsonrepair(cleanJSON);

      return parse(repaired);
    } catch (e) {
      // Final fallback: Manual inspection
      console.error('JSON parse failed after repairs:');
      console.error(input);
      throw e;
    }
  }

  async run(
    query: string,
    responseFormat?: string,
    maxToolCalls = 1,
  ): Promise<Message[]> {
    try {
      this.thread = (await this.redisCacheService.get<Message[]>(
        `${this.name}${this.sessionId}`,
      )) || [{ role: 'system', content: this.instructions }];

      this.overallThread = (await this.redisCacheService.get<Message[]>(
        `conversation:${this.sessionId}`,
      )) || [{ role: 'system', content: this.instructions }];

      this.thread.push({ role: 'user', content: query });
      this.overallThread.push({ role: 'user', content: query });

      if (!this.tools.length) {
        if (this.clientType === 'anthropic') {
          const anthropicClient = this.client as Anthropic;
          const response = await anthropicClient.messages.create({
            model: this.model,
            max_tokens: 20000,
            messages: [
              {
                role: 'user',
                content: query,
              },
            ],
            system: this.instructions,
          });

          const message = (response.content[0] as any).text;
          const cleanResponse = this.robustJSONParse(message);
          const assistantMessage: Message = {
            role: 'assistant',
            content: JSON.stringify({
              message: cleanResponse,
              type: MessageType.CODE,
            }),
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
            response_format:
              responseFormat === 'json' ? { type: 'json_object' } : undefined,
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
        const openaiClient = this.client as OpenAI;
        const response = await openaiClient.chat.completions.create({
          model: this.model,
          messages: this.thread.map(this.convertToOpenAIMessage),
          tools: toolSchemas,
          temperature: this.temperature,
          response_format:
            responseFormat === 'json' ? { type: 'json_object' } : undefined,
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
                tool_call_id: toolCall.id,
                content: result ? JSON.stringify(result) : '{}',
                type: this.getToolResponseType(toolCall.function.name),
                agent_name: this.name,
              };

              this.thread.push(toolResponse);
              this.overallThread.push(toolResponse);

              // If this is an image search result, feed it back to LLM for analysis and code generation
              // if (toolCall.function.name === 'search_image') {
              //   const imageResult = JSON.parse(toolResponse.content);

              //   const messages: ChatMessage[] = [
              //     ...this.thread.map(this.convertToOpenAIMessage),
              //     {
              //       role: 'user',
              //       content: [
              //         {
              //           type: 'text',
              //           text: `Use this UI reference:`,
              //         },
              //         {
              //           type: 'image_url',
              //           image_url: {
              //             url: imageResult.imageUrl,
              //           },
              //         },
              //       ],
              //     },
              //   ];

              //   const response = await openaiClient.chat.completions.create({
              //     model: this.model,
              //     messages,
              //     tools: toolSchemas,
              //     temperature: this.temperature,
              //   });

              //   const message = response.choices[0].message;
              //   const assistantMessage: Message = {
              //     role: 'assistant',
              //     content: message.content,
              //     type: MessageType.TEXT,
              //     agent_name: this.name,
              //   };
              //   this.thread.push(assistantMessage);
              //   this.overallThread.push(assistantMessage);
              // }
            } catch (error) {
              console.error(`Tool execution error: ${error}`);
              const assistantMessage: Message = {
                role: 'assistant',
                content: JSON.stringify({ error: error.message }),
                type: MessageType.ERROR,
                agent_name: this.name,
              };
              this.thread.push(assistantMessage);
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
    if (toolName === 'search_image') {
      return MessageType.UI_REFERENCE;
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
