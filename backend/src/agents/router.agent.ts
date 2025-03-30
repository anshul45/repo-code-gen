import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from 'src/redis/redis.service';
import { BaseAgent } from './base.agent';
import * as fs from 'fs';
import * as path from 'path';

interface RoutingResponse {
  category: 'manager_agent' | 'editor_agent' | 'coder_agent';
}

@Injectable()
export class RouterAgent {
  private activeSessions: Map<string, BaseAgent>;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.activeSessions = new Map();
  }

  private async getOrCreateAgent(userId: string): Promise<BaseAgent> {
    if (!this.activeSessions.has(userId)) {
      const agent = new BaseAgent(
        this.configService,
        this.redisCacheService,
        'router_agent',
        'gemini-2.0-flash',
        fs.readFileSync(
          path.join(process.cwd(), 'src', 'prompts', 'router-agent.prompt.md'),
          'utf-8',
        ),
        userId,
        0,
        [],
      );

      this.activeSessions.set(userId, agent);
    }

    return this.activeSessions.get(userId)!;
  }

  async routeQuery(
    userInput: string,
    userId: string,
  ): Promise<RoutingResponse> {
    try {
      const agent = await this.getOrCreateAgent(userId);
      const response = await agent.run(userInput, 'json');

      // Get the last assistant message which should contain the routing JSON
      const lastAssistantMessage = response
        .filter((msg) => msg.role === 'assistant')
        .pop();

      if (!lastAssistantMessage?.content) {
        throw new Error('No routing response received');
      }

      // Check if content is a string before parsing
      if (typeof lastAssistantMessage.content !== 'string') {
        throw new Error('Invalid response format: expected string content');
      }

      // Parse the JSON response
      const routingResponse = JSON.parse(
        lastAssistantMessage.content,
      ) as RoutingResponse;

      // Validate the response
      if (
        !['manager_agent', 'editor_agent', 'coder_agent'].includes(
          routingResponse.category,
        )
      ) {
        throw new Error('Invalid routing category received');
      }

      return routingResponse;
    } catch (error) {
      console.error('Error routing query:', error);
      // Default to manager agent if routing fails
      return { category: 'manager_agent' };
    }
  }

  clearConversation(userId: string): void {
    this.activeSessions.delete(userId);
  }
}
