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
    private readonly outputFormat?: string,
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

  async execute(userInput: string): Promise<any> {
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
        this.outputFormat === 'json' ? { type: 'json_object' } : undefined,
    };

    const response = (await this.client.chat.completions.create(
      completionArgs,
    )) as ChatCompletion;
    const content = response.choices[0].message.content;

    if (this.outputFormat && this.outputFormat === 'json' && content) {
      // Clean up any markdown formatting that might be present
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
      options.outputFormat,
      options.baseUrl,
      options.apiKey,
      options.model,
      options.temperature,
    );
  }
}
