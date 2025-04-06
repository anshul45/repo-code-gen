import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis/redis.service';
import { BaseAgent, Tool, Message } from './base.agent';
import { GetFilesWithDescriptionTool } from '../tools/get-files-with-description.tool';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EditorAgent {
  private activeSessions: Map<string, BaseAgent>;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
    private readonly getFilesWithDescriptionTool: GetFilesWithDescriptionTool,
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

      const tools: Tool[] = [
        {
          name: 'get_files_with_description',
          description: 'Get a list of files that need to be created or updated',
          execute: (problemStatement: string) =>
            this.getFilesWithDescriptionTool.execute(problemStatement),
        },
      ];

      const agent = new BaseAgent(
        this.configService,
        this.redisCacheService,
        'editor_agent',
        'gemini-2.0-flash',
        fs
          .readFileSync(
            path.join(
              process.cwd(),
              'src',
              'prompts',
              'editor-agent.prompt.md',
            ),
            'utf-8',
          )
          .replace('{base_template}', JSON.stringify(baseTemplate)),
        sessionKey,
        1,
        tools,
        'gemini',
        this.configService.get('GEMINI_BASE_URL'),
        this.configService.get('GEMINI_API_KEY'),
        this.prismaService,
      );

      this.activeSessions.set(sessionKey, agent);
    }

    return this.activeSessions.get(sessionKey)!;
  }

  async generateResponse(
    userInput: string,
    userId: string,
    projectId?: string,
  ): Promise<Message[]> {
    try {
      const finalProjectId = projectId || 'default';
      const agent = await this.getOrCreateAgent(userId, finalProjectId);
      const response = await agent.run(userInput);
      return response.filter((msg) => msg.role !== 'system');
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
