import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from 'src/redis/redis.service';
import { BaseAgent, Message } from './base.agent';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CoderAgent {
  private activeSessions: Map<string, BaseAgent>;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.activeSessions = new Map();
  }

  private async getOrCreateAgent(userId: string): Promise<BaseAgent> {
    if (!this.activeSessions.has(userId)) {
      // Read base template
      const baseTemplatePath = path.join(
        process.cwd(),
        'src',
        'tools',
        'base-template.json',
      );
      const baseTemplate = JSON.parse(
        fs.readFileSync(baseTemplatePath, 'utf-8'),
      );

      const uiComponentsMd = fs.readFileSync(
        path.join(process.cwd(), 'src', 'prompts', 'ui_components.md'),
        'utf-8',
      );

      const lucidReactComponents = fs.readFileSync(
        path.join(
          process.cwd(),
          'src',
          'prompts',
          'lucid_react_components.txt',
        ),
        'utf-8',
      );

      const agent = new BaseAgent(
        this.configService,
        this.redisCacheService,
        'coder_agent',
        'claude-3-7-sonnet-20250219',
        fs
          .readFileSync(
            path.join(process.cwd(), 'src', 'prompts', 'coder-agent.prompt.md'),
            'utf-8',
          )
          .replace('{base_template}', JSON.stringify(baseTemplate))
          .replace('{ui_components}', uiComponentsMd)
          .replace('{lucid_react_components}', lucidReactComponents),
        userId,
        0.6,
        [],
        this.configService.get('ANTHROPIC_API_URL'),
        this.configService.get('ANTHROPIC_API_KEY'),
        'anthropic',
      );

      this.activeSessions.set(userId, agent);
    }

    return this.activeSessions.get(userId)!;
  }

  async generateResponse(message: string, userId: string): Promise<Message[]> {
    try {
      const agent = await this.getOrCreateAgent(userId);
      const thread = await agent.run(message, 'json');
      return thread.filter((msg) => msg.role !== 'system');
    } catch (error) {
      console.error('Error generating response:', error);
      return [
        {
          role: 'assistant',
          content: 'Something went wrong, please try again later',
          type: 'error',
        },
      ];
    }
  }

  clearConversation(userId: string): void {
    this.activeSessions.delete(userId);
  }
}
