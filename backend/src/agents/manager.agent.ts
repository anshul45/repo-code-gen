import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from 'src/redis/redis.service';
import { BaseAgent, Message, Tool } from './base.agent';
import { GetFilesWithDescriptionTool } from '../tools/get-files-with-description.tool';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ManagerAgent {
  private activeSessions: Map<string, BaseAgent>;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
    private readonly getFilesWithDescriptionTool: GetFilesWithDescriptionTool,
  ) {
    this.activeSessions = new Map();
  }

  private async getOrCreateAgent(userId: string): Promise<BaseAgent> {
    if (!this.activeSessions.has(userId)) {
      const baseTemplatePath = path.join(
        process.cwd(),
        'src',
        'tools',
        'base-template.json',
      );
      const baseTemplate = JSON.parse(
        fs.readFileSync(baseTemplatePath, 'utf-8'),
      );

      const tools: Tool[] = [
        {
          name: 'get_files_with_description',
          description:
            'Get a list of files with their descriptions based on the problem statement',
          execute: (problemStatement: string) =>
            this.getFilesWithDescriptionTool.execute(problemStatement),
        },
      ];

      const agent = new BaseAgent(
        this.configService,
        this.redisCacheService,
        'manager_agent',
        'gemini-2.0-flash',
        fs
          .readFileSync(
            path.join(
              process.cwd(),
              'src',
              'prompts',
              'manager-agent.prompt.md',
            ),
            'utf-8',
          )
          .replace('{base_template}', JSON.stringify(baseTemplate)),
        userId,
        0.6,
        tools,
      );

      this.activeSessions.set(userId, agent);
    }

    return this.activeSessions.get(userId)!;
  }

  async generateFiles(message: string, userId: string): Promise<Message[]> {
    try {
      const agent = await this.getOrCreateAgent(userId);
      const thread = await agent.run(message);
      return thread.filter((msg) => msg.role !== 'system');
    } catch (error) {
      console.error('Error generating files:', error);
      return [
        {
          role: 'assistant',
          content: 'Something went wrong, please try again later',
          type: 'error',
        },
      ];
    }
  }

  async generateResponse(message: string, userId: string): Promise<Message[]> {
    try {
      const agent = await this.getOrCreateAgent(userId);
      const thread = await agent.run(message); // Allow more tool calls for planning
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
