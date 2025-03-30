import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Message } from '../agents/base.agent';
import { ManagerAgent } from '../agents/manager.agent';
import { CoderAgent } from '../agents/coder.agent';
import { EditorAgent } from '../agents/editor.agent';
import { RouterAgent } from '../agents/router.agent';

enum MessageType {
  JSON = 'json',
  JSON_BUTTON = 'json-button',
  JSON_FILES = 'json-files',
  CODE = 'code',
  Text = 'text',
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
    private readonly routerAgent: RouterAgent,
    private readonly managerAgent: ManagerAgent,
    private readonly editorAgent: EditorAgent,
    private readonly coderAgent: CoderAgent,
  ) {}

  @Post()
  async chat(@Body() body: ChatRequest): Promise<ChatResponse> {
    const { message, user_id } = body;

    if (!message || !user_id) {
      throw new HttpException(
        'Message and user_id are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // First, use the router agent to determine which agent should handle the request
      const routing = await this.routerAgent.routeQuery(message, user_id);
      let result;

      switch (routing.category) {
        case 'manager_agent':
          result = await this.managerAgent.generateResponse(message, user_id);
          break;
        case 'editor_agent':
          result = await this.editorAgent.generateResponse(message, user_id);
          break;
        case 'coder_agent':
          result = await this.coderAgent.generateResponse(message, user_id);
          break;
        default:
          throw new Error('Invalid routing category');
      }

      if (result && result.length > 0) {
        const lastMessage = result[result.length - 1];

        if (lastMessage.type === MessageType.JSON && lastMessage.content) {
          try {
            lastMessage.content = JSON.parse(lastMessage.content);
          } catch (e) {
            console.error('JSON parsing error:', e);
          }
        } else if (
          lastMessage.type === MessageType.JSON_BUTTON &&
          lastMessage.content
        ) {
          try {
            lastMessage.content = JSON.parse(lastMessage.content);
          } catch (e) {
            console.error('JSON parsing error:', e);
          }
        } else if (
          lastMessage.type !== MessageType.JSON_FILES &&
          lastMessage.type !== MessageType.Text
        ) {
          try {
            const jsonResponse = JSON.parse(lastMessage.content);
            if (
              jsonResponse.type === MessageType.CODE &&
              jsonResponse.message
            ) {
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
