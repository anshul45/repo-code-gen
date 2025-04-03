import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis/redis.service';
import { BaseAgent, Message } from './base.agent';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CoderAgent {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  private async getOrCreateAgent(userId: string, projectId: string): Promise<BaseAgent> {
    const baseTemplatePath = path.join(
      process.cwd(),
      'src',
      'tools',
      'base-template.json',
    );
    const baseTemplate = JSON.parse(fs.readFileSync(baseTemplatePath, 'utf-8'));

    const uiComponentsMd = fs.readFileSync(
      path.join(process.cwd(), 'src', 'prompts', 'ui_components.md'),
      'utf-8',
    );

    const lucidReactComponents = fs.readFileSync(
      path.join(process.cwd(), 'src', 'prompts', 'lucid_react_components.txt'),
      'utf-8',
    );

    // Try to read project context
    let projectContext = '';
    try {
      const projectFile = `project_${userId}_${projectId}.md`;
      if (fs.existsSync(projectFile)) {
        projectContext = fs.readFileSync(projectFile, 'utf-8');
      }
    } catch (error) {
      console.error('Error reading project context:', error);
    }

    const promptContent = fs
      .readFileSync(
        path.join(process.cwd(), 'src', 'prompts', 'coder-agent.prompt.md'),
        'utf-8',
      )
      .replace('{{base_template}}', JSON.stringify(baseTemplate))
      .replace('{{ui_components}}', uiComponentsMd)
      .replace('{{lucid_react_components}}', lucidReactComponents)
      .replace('{{existing_code}}', projectContext ?? '');

    const agent = new BaseAgent(
      this.configService,
      this.redisCacheService,
      'coder_agent',
      'claude-3-7-sonnet-20250219',
      promptContent,
      `${userId}_${projectId}`,
      0.6,
      [],
      this.configService.get('ANTHROPIC_API_URL'),
      this.configService.get('ANTHROPIC_API_KEY'),
      'anthropic',
    );
    return agent;
  }

  async generateResponse(message: string, userId: string, projectId?: string): Promise<Message[]> {
    try {
      // Default to a fallback projectId if none is provided
      const finalProjectId = projectId || 'default';
      const agent = await this.getOrCreateAgent(userId, finalProjectId);
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
}
