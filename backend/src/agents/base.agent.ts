import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { writeFile, appendFile, access } from 'fs/promises';
import type {
  ChatCompletionContentPart,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionToolMessageParam,
} from 'openai/resources/chat/completions';
import { RedisCacheService } from '../redis/redis.service';
import { MessageType } from '../types/message.types';
import { jsonrepair } from 'jsonrepair';
import { parse } from 'json5';
import { PrismaService } from '../prisma/prisma.service';

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

interface FileContent {
  contents: string;
}

type FileStructure = {
  file?: FileContent;
  directory?: Record<string, FileStructure>;
} & Record<string, any>;

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
    protected readonly prismaService?: PrismaService,
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
    
    console.log(`[BaseAgent] Initialized ${this.name} agent with sessionId ${this.sessionId || 'none'}`);
    console.log(`[BaseAgent] Using model: ${this.model}, client: ${this.clientType}`);
    console.log(`[BaseAgent] Tools registered: ${this.tools.map(t => t.name).join(', ') || 'none'}`);
  }

  protected executeToolCall(toolCall: ToolCall): any {
    const name = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    console.log(`[BaseAgent] Executing tool: ${name}(${JSON.stringify(args)})`);
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
    console.log(`[BaseAgent:${this.name}] Attempting to parse JSON response`);
    try {
      const clean = input.replace(/^[^{[]*/, '').replace(/[^}\]]*$/, '');
      const cleanJSON = clean
        .replace('```tsx', '')
        .replace('```', '')
        .replace('json', '')
        .replace('```', '')
        .replace('typescript', '');

      console.log(`[BaseAgent:${this.name}] Cleaned JSON for parsing:\n${cleanJSON.substring(0, 500)}${cleanJSON.length > 500 ? '...(truncated)' : ''}`);

      const repaired = jsonrepair(cleanJSON);

      return parse(repaired);
    } catch (e) {
      // Final fallback: Manual inspection
      console.error(`[BaseAgent:${this.name}] JSON parse failed after repairs:`, e);
      console.error(`[BaseAgent:${this.name}] Input that failed to parse:\n${input.substring(0, 500)}${input.length > 500 ? '...(truncated)' : ''}`);
      throw e;
    }
  }

  async run(
    query: string,
    responseFormat?: string,
    maxToolCalls = 1,
  ): Promise<Message[]> {
    try {
      console.log(`\n[BaseAgent:${this.name}] Running with query: "${query.substring(0, 100)}${query.length > 100 ? '...(truncated)' : ''}"`);
      console.log(`[BaseAgent:${this.name}] Session ID: ${this.sessionId}, Response format: ${responseFormat || 'default'}, Max tool calls: ${maxToolCalls}`);
      
      this.thread = (await this.redisCacheService.get<Message[]>(
        `${this.name}${this.sessionId}`,
      )) || [{ role: 'system', content: this.instructions }];

      this.overallThread = (await this.redisCacheService.get<Message[]>(
        `conversation:${this.sessionId}`,
      )) || [{ role: 'system', content: this.instructions }];

      console.log(`[BaseAgent:${this.name}] Retrieved thread from Redis: ${this.thread.length} messages, ${this.overallThread.length} messages in overall thread`);

      this.thread.push({ role: 'user', content: query });
      this.overallThread.push({ role: 'user', content: query });

      if (!this.tools.length) {
        console.log(`[BaseAgent:${this.name}] Running without tools using ${this.clientType} client`);
        
        if (this.clientType === 'anthropic') {
          const anthropicClient = this.client as Anthropic;
          console.log(`[BaseAgent:${this.name}] Sending request to Anthropic with model ${this.model}`);
          console.log(`[BaseAgent:${this.name}] System instructions length: ${this.instructions.length} characters`);
          
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

          console.log(`[BaseAgent:${this.name}] Received response from Anthropic`);
          
          const message = (response.content[0] as any).text;
          console.log(`[BaseAgent:${this.name}] Raw message from Anthropic:\n${message.substring(0, 500)}${message.length > 500 ? '...(truncated)' : ''}`);
          
          console.log(`[BaseAgent:${this.name}] Parsing response as JSON`);
          const cleanResponse = this.robustJSONParse(message);
          console.log(`[BaseAgent:${this.name}] Successfully parsed JSON response. Keys: ${Object.keys(cleanResponse).join(', ')}`);
          
          console.log(`[BaseAgent:${this.name}] Storing generated code in filesystem`);
          this.storeGeneratedCode(cleanResponse);

          const assistantMessage: Message = {
            role: 'assistant',
            content: JSON.stringify({
              message: cleanResponse,
              type: MessageType.CODE,
            }),
          };

          this.thread.push(assistantMessage);
          this.overallThread.push(assistantMessage);
          console.log(`[BaseAgent:${this.name}] Added assistant message to thread and saving to Redis`);
          await this.saveThread();

          return this.overallThread;
        } else {
          const openaiClient = this.client as OpenAI;
          console.log(`[BaseAgent:${this.name}] Sending request to OpenAI with model ${this.model}`);
          
          const response = await openaiClient.chat.completions.create({
            model: this.model,
            messages: this.thread as any,
            temperature: this.temperature,
            response_format:
              responseFormat === 'json' ? { type: 'json_object' } : undefined,
          });

          console.log(`[BaseAgent:${this.name}] Received response from OpenAI`);
          
          const message = response.choices[0].message.content;
          console.log(`[BaseAgent:${this.name}] Message from OpenAI:\n${message?.substring(0, 500)}${message && message.length > 500 ? '...(truncated)' : ''}`);
          
          const assistantMessage: Message = {
            role: 'assistant',
            content: message,
            type: MessageType.TEXT,
          };

          this.thread.push(assistantMessage);
          this.overallThread.push(assistantMessage);
          console.log(`[BaseAgent:${this.name}] Added assistant message to thread and saving to Redis`);
          await this.saveThread();

          return this.overallThread;
        }
      }

      console.log(`[BaseAgent:${this.name}] Running with tools using OpenAI client`);
      const toolSchemas = this.toolsToToolSchema();
      let toolCallCount = 0;

      while (toolCallCount < maxToolCalls) {
        console.log(`[BaseAgent:${this.name}] Tool call iteration ${toolCallCount + 1}/${maxToolCalls}`);
        
        const openaiClient = this.client as OpenAI;
        console.log(`[BaseAgent:${this.name}] Sending request to OpenAI with model ${this.model}`);
        console.log(`[BaseAgent:${this.name}] Current thread length: ${this.thread.length} messages`);
        
        const response = await openaiClient.chat.completions.create({
          model: this.model,
          messages: this.thread.map(this.convertToOpenAIMessage),
          tools: toolSchemas,
          temperature: this.temperature,
          response_format:
            responseFormat === 'json' ? { type: 'json_object' } : undefined,
        });

        console.log(`[BaseAgent:${this.name}] Received response from OpenAI`);
        
        const message = response.choices[0].message;
        console.log(`[BaseAgent:${this.name}] Message content from OpenAI:\n${message.content?.substring(0, 500)}${message.content && message.content.length > 500 ? '...(truncated)' : 'null'}`);
        
        if (message.tool_calls) {
          console.log(`[BaseAgent:${this.name}] OpenAI requested ${message.tool_calls.length} tool calls`);
          message.tool_calls.forEach((call, i) => {
            console.log(`[BaseAgent:${this.name}] Tool call ${i+1}: ${call.function.name}`);
          });
        }
        
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
        console.log(`[BaseAgent:${this.name}] Added assistant message to thread`);

        if (!message.tool_calls) {
          console.log(`[BaseAgent:${this.name}] No tool calls requested, breaking out of tool call loop`);
          break;
        }

        const toolResponses: Message[] = [];

        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name in this.toolsMap) {
            try {
              console.log(`[BaseAgent:${this.name}] Executing tool: ${toolCall.function.name} with args:`, toolCall.function.arguments);
              const result = await this.executeToolCall(toolCall);
              console.log(`[BaseAgent:${this.name}] Tool execution successful`);
              
              const resultString = JSON.stringify(result);
              console.log(`[BaseAgent:${this.name}] Tool result:\n${resultString.substring(0, 500)}${resultString.length > 500 ? '...(truncated)' : ''}`);
              
              const responseType = this.getToolResponseType(toolCall.function.name);
              console.log(`[BaseAgent:${this.name}] Tool response type: ${responseType}`);
              
              toolResponses.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: result ? JSON.stringify(result) : '{}',
                type: responseType,
                agent_name: this.name,
              });
            } catch (error) {
              console.error(`[BaseAgent:${this.name}] Tool execution error:`, error);
              toolResponses.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: JSON.stringify({ error: error.message }),
                type: MessageType.ERROR,
                agent_name: this.name,
              });
            }
          } else {
            console.warn(`[BaseAgent:${this.name}] Warning: Tool ${toolCall.function.name} not found!`);
          }
        }
        
        // Add all tool responses at once after processing all tool calls
        console.log(`[BaseAgent:${this.name}] Adding ${toolResponses.length} tool responses to thread`);
        this.thread.push(...toolResponses);
        this.overallThread.push(...toolResponses);
        
        toolCallCount++;
      }

      console.log(`[BaseAgent:${this.name}] Completed run, saving thread to Redis`);
      await this.saveThread();
      return this.overallThread;
    } catch (error) {
      console.error(`[BaseAgent:${this.name}] Exception occurred:`, error);
      throw error;
    }
  }

  protected getToolResponseType(toolName: string): MessageType {
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

  protected async storeGeneratedCode(
    response: Record<string, FileStructure>,
  ): Promise<void> {
    try {
      console.log(`[BaseAgent:${this.name}] Processing generated code for session ${this.sessionId}`);
      console.log(`[BaseAgent:${this.name}] Response keys: ${Object.keys(response).join(', ')}`);
      
      // Extract user and project IDs from session ID
      if (!this.sessionId) {
        console.error(`[BaseAgent:${this.name}] No sessionId provided, cannot save to database`);
        return;
      }
      
      const [userId, projectId] = this.sessionId.split('_');
      
      if (!userId || !projectId) {
        console.error(`[BaseAgent:${this.name}] Invalid sessionId format: ${this.sessionId}`);
        return;
      }
      
      // If no PrismaService is injected, we can't proceed
      if (!this.prismaService) {
        console.error(`[BaseAgent:${this.name}] PrismaService not available, cannot save to database`);
        return;
      }
      
      // Get current project from the database
      const project = await this.prismaService.project.findUnique({
        where: { id: projectId },
      });
      
      if (!project) {
        console.error(`[BaseAgent:${this.name}] Project with ID ${projectId} not found`);
        return;
      }
      
      // Extract files from the response
      const extractedFiles: { path: string; content: string }[] = [];
      
      const extractFiles = (
        obj: Record<string, FileStructure>,
        currentPath: string = '',
      ): void => {
        for (const [key, value] of Object.entries(obj)) {
          if (value && typeof value === 'object') {
            if ('file' in value && value.file) {
              // Ensure key includes file extension
              const fullPath = key.includes('.') ? key : `${key}.ts`;
              console.log(`[BaseAgent:${this.name}] Extracted file: ${currentPath}${fullPath}`);
              extractedFiles.push({
                path: `${currentPath}${fullPath}`,
                content: value.file.contents,
              });
            } else if ('directory' in value) {
              console.log(`[BaseAgent:${this.name}] Processing directory: ${currentPath}${key}/`);
              extractFiles(value.directory, `${currentPath}${key}/`);
            } else {
              extractFiles(
                value as Record<string, FileStructure>,
                `${currentPath}${key}/`,
              );
            }
          }
        }
      };
      
      extractFiles(response);
      console.log(`[BaseAgent:${this.name}] Extracted ${extractedFiles.length} files from response`);
      
      // Get the current codebase from the project
      let codebase = project.codebase as Record<string, any>;
      
      // Update the codebase with the new/updated files
      for (const file of extractedFiles) {
        console.log(`[BaseAgent:${this.name}] Updating file in codebase: ${file.path}`);
        this.updateFileInCodebase(codebase, file.path, file.content);
      }
      
      // Save the updated codebase back to the database
      await this.prismaService.project.update({
        where: { id: projectId },
        data: {
          codebase,
          updatedAt: new Date(), // Update the timestamp
        },
      });
      
      console.log(`[BaseAgent:${this.name}] Successfully updated codebase in database for project ${projectId}`);
    } catch (error) {
      console.error(`[BaseAgent:${this.name}] Error storing generated code:`, error);
      throw error;
    }
  }

  // New method to update files in codebase structure
  private updateFileInCodebase(
    codebase: Record<string, any>,
    filePath: string,
    content: string
  ): void {
    // Split path components
    const pathParts = filePath.split('/');
    const filename = pathParts.pop() || '';
    
    // Navigate/create directory structure
    let current = codebase;
    for (const part of pathParts) {
      if (!part) continue;
      
      if (!current[part]) {
        current[part] = { directory: {} };
      } else if (!current[part].directory) {
        current[part].directory = {};
      }
      
      current = current[part].directory;
    }
    
    // Add or update file at the final level
    if (filename) {
      current[filename] = {
        file: {
          contents: content
        }
      };
    }
  }

  // Keep these methods for backwards compatibility but make them do nothing
  protected async fileExists(path: string): Promise<boolean> {
    console.log(`[BaseAgent:${this.name}] fileExists called but now using database instead, path: ${path}`);
    return false;
  }

  protected async addFile(path: string, content: string): Promise<void> {
    console.log(`[BaseAgent:${this.name}] addFile called but now using database instead, path: ${path}`);
    // No-op as we're using the database
  }

  protected async appendToFile(path: string, content: string): Promise<void> {
    console.log(`[BaseAgent:${this.name}] appendToFile called but now using database instead, path: ${path}`);
    // No-op as we're using the database
  }

  protected async saveThread(): Promise<void> {
    if (this.sessionId) {
      console.log(`[BaseAgent:${this.name}] Saving thread to Redis for session ${this.sessionId}`);
      console.log(`[BaseAgent:${this.name}] Thread length: ${this.thread.length}, Overall thread length: ${this.overallThread.length}`);
      
      await this.redisCacheService.set(
        `${this.name}${this.sessionId}`,
        this.thread,
      );
      await this.redisCacheService.set(
        `conversation:${this.sessionId}`,
        this.overallThread,
      );
      
      console.log(`[BaseAgent:${this.name}] Thread saved successfully`);
    } else {
      console.log(`[BaseAgent:${this.name}] No sessionId provided, skipping thread save`);
    }
  }
}
