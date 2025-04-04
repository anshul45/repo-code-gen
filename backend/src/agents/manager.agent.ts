import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis/redis.service';
import { BaseAgent, Message, Tool } from './base.agent';
import { GetFilesWithDescriptionTool } from '../tools/get-files-with-description.tool';
import { ImageSearchTool } from '../tools/image-search/image-search.tool';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManagerAgent {
  private activeSessions: Map<string, BaseAgent>;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
    private readonly getFilesWithDescriptionTool: GetFilesWithDescriptionTool,
    private readonly imageSearchTool: ImageSearchTool,
    private readonly prismaService: PrismaService,
  ) {
    this.activeSessions = new Map();
  }

  private async getOrCreateAgent(userId: string, projectId: string): Promise<BaseAgent> {
    const sessionKey = `${userId}_${projectId}`;
    
    if (!this.activeSessions.has(sessionKey)) {
      const baseTemplatePath = path.join(
        process.cwd(),
        'src',
        'tools',
        'base-template.json',
      );
      const baseTemplate = JSON.parse(
        fs.readFileSync(baseTemplatePath, 'utf-8'),
      );

      const uiComponentsList = fs.readFileSync(
        path.join(process.cwd(), 'src', 'prompts', 'ui_components_list.md'),
        'utf-8',
      );

      const tools: Tool[] = [
        {
          name: 'get_files_with_description',
          description:
            'Get a list of files with their descriptions based on the problem statement',
          execute: (problemStatement: string) =>
            this.getFilesWithDescriptionTool.execute(problemStatement),
        },
        {
          name: 'search_image',
          description:
            'Search for an image using Google Custom Search to get inspiration for UI',
          execute: (query: string) => this.imageSearchTool.execute(query),
        },
      ];

      const agent = new BaseAgent(
        this.configService,
        this.redisCacheService,
        'manager_agent',
        'gpt-4o',
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
          .replace('{base_template}', JSON.stringify(baseTemplate))
          .replace('{ui_components_list}', uiComponentsList),
        sessionKey,
        0.6,
        tools,
        this.configService.get('OPENAI_BASE_URL'),
        this.configService.get('OPENAI_API_KEY'),
        'openai',
        this.prismaService,
      );

      this.activeSessions.set(sessionKey, agent);
    }

    return this.activeSessions.get(sessionKey)!;
  }

  async generateFiles(message: string, userId: string, projectId?: string): Promise<Message[]> {
    try {
      const finalProjectId = projectId || 'default';
      const agent = await this.getOrCreateAgent(userId, finalProjectId);
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

  async generateResponse(message: string, userId: string, projectId?: string): Promise<Message[]> {
    try {
      const finalProjectId = projectId || 'default';
      const agent = await this.getOrCreateAgent(userId, finalProjectId);
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

  clearConversation(userId: string, projectId?: string): void {
    const finalProjectId = projectId || 'default';
    const sessionKey = `${userId}_${finalProjectId}`;
    this.activeSessions.delete(sessionKey);
  }
}
