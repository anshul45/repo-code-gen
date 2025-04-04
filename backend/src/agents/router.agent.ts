import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAgent } from './base.agent';
import * as fs from 'fs';
import * as path from 'path';
import { SimpleAgent } from './simple.agent';
import { PrismaService } from '../prisma/prisma.service';

interface RoutingResponse {
  category: 'manager_agent' | 'editor_agent' | 'coder_agent';
}

@Injectable()
export class RouterAgent {
  private activeSessions: Map<string, BaseAgent>;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.activeSessions = new Map();
  }

  private async getOrCreateAgent(): Promise<SimpleAgent> {
    const prompt = fs.readFileSync(
      path.join(process.cwd(), 'src', 'prompts', 'router-agent.prompt.md'),
      'utf-8',
    );
    
    const agent = SimpleAgent.create(
      this.configService,
      prompt,
      {
        baseUrl: this.configService.get('GEMINI_BASE_URL'),
        apiKey: this.configService.get('GEMINI_API_KEY'),
        model: 'gemini-2.0-flash',
        temperature: 0
      }
    );
    return agent;
  }

  async routeQuery(
    userInput: string,
    outputFormat?: string,
    projectId?: string,
  ): Promise<RoutingResponse> {
    try {
      const agent = await this.getOrCreateAgent();
      const response = await agent.execute(userInput, outputFormat);

      if (
        !['manager_agent', 'editor_agent', 'coder_agent'].includes(
          response.category,
        )
      ) {
        return { category: 'manager_agent' };
      }

      return response;
    } catch (error) {
      console.error('Error routing query:', error);
      // Default to manager agent if routing fails
      return { category: 'manager_agent' };
    }
  }

  clearConversation(userId: string, projectId?: string): void {
    const sessionKey = projectId ? `${userId}_${projectId}` : userId;
    this.activeSessions.delete(sessionKey);
  }
}
