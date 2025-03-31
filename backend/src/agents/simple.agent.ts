import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type {
  ChatCompletionCreateParamsBase,
  ChatCompletion,
} from 'openai/resources/chat/completions';

@Injectable()
export class SimpleAgent {
  private client: OpenAI;
  private model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly systemPrompt: string,
    private readonly baseUrl?: string,
    private readonly apiKey?: string,
    private readonly modelName?: string,
    private readonly temperature: number = 0.6,
  ) {
    this.client = new OpenAI({
      baseURL: baseUrl || this.configService.get('LLM_BASE_URL'),
      apiKey: apiKey || this.configService.get('LLM_API_KEY'),
    });

    this.model =
      modelName || this.configService.get('LLM_MODEL', 'gpt-4-turbo-preview');
  }

  async execute(userInput: string, outputFormat?: string): Promise<any> {
    const completionArgs: ChatCompletionCreateParamsBase = {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      temperature: this.temperature,
      response_format:
        outputFormat === 'json' ? { type: 'json_object' } : undefined,
    };

    const response = (await this.client.chat.completions.create(
      completionArgs,
    )) as ChatCompletion;
    const content = response.choices[0].message.content;

    if (outputFormat && outputFormat === 'json' && content) {
      const cleanResponse = content.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanResponse);
    }

    return content;
  }

  /**
   * Factory method to create a new SimpleAgent instance
   */
  static create(
    configService: ConfigService,
    systemPrompt: string,
    options: {
      outputFormat?: string;
      baseUrl?: string;
      apiKey?: string;
      model?: string;
      temperature?: number;
    } = {},
  ): SimpleAgent {
    return new SimpleAgent(
      configService,
      systemPrompt,
      options.baseUrl,
      options.apiKey,
      options.model,
      options.temperature,
    );
  }
}
