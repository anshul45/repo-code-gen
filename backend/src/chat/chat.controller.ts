import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ManagerAgent } from '../agents/manager.agent';
import { CoderAgent } from '../agents/coder.agent';
import { Message } from '../agents/base.agent';

enum MessageType {
  JSON = 'json',
  JSON_BUTTON = 'json-button',
  JSON_FILES = 'json-files',
  CODE = 'code'
}

interface ChatRequest {
  message: string;
  user_id: string;
  intent?: string;
}

interface ChatResponse {
  result?: Message[];
  error?: string;
}

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly managerAgent: ManagerAgent,
    private readonly coderAgent: CoderAgent,
  ) {}

  @Post()
  async chat(@Body() body: ChatRequest): Promise<ChatResponse> {
    const { message, user_id, intent } = body;

    if (!message || !user_id) {
      throw new HttpException(
        'Message and user_id are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      let result;

      if (intent === MessageType.CODE) {
        // Use coder agent for code generation
        result = await this.coderAgent.generateResponse(message, user_id);
      } else {
        // Use manager agent for planning and file management
        result = await this.managerAgent.generateResponse(message, user_id);
      }

      if (result && result.length > 0) {
        const lastMessage = result[result.length - 1];

        if (lastMessage.type === MessageType.JSON && lastMessage.content) {
          try {
            lastMessage.content = JSON.parse(lastMessage.content);
          } catch (e) {
            console.error('JSON parsing error:', e);
          }
        } else if (lastMessage.type === MessageType.JSON_BUTTON && lastMessage.content) {
          try {
            lastMessage.content = JSON.parse(lastMessage.content);
          } catch (e) {
            console.error('JSON parsing error:', e);
          }
        } else if (lastMessage.type !== MessageType.JSON_FILES) {
          try {
            const jsonResponse = JSON.parse(lastMessage.content);
            if (jsonResponse.type === MessageType.CODE && jsonResponse.message) {
              lastMessage.content = jsonResponse.message;
              lastMessage.type = jsonResponse.type;
            }
          } catch (e: any) {
            console.error('JSON parsing error:', e);
            // Ignore JSON parse errors for non-JSON content
          }
        }
      }

      return { result };
    } catch (error) {
      return { error: error.message };
    }
  }
}
