import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SimpleAgent } from '../agents/simple.agent';
import * as fs from 'fs';
import * as path from 'path';

interface FileDescription {
  file_path: string;
  description: string;
}

@Injectable()
export class GetFilesWithDescriptionTool {
  constructor(private readonly configService: ConfigService) {}

  async execute(problemStatement: string): Promise<FileDescription[]> {
    const baseTemplatePath = path.join(
      process.cwd(),
      'src',
      'tools',
      'base-template.json',
    );
    const baseTemplate = JSON.parse(fs.readFileSync(baseTemplatePath, 'utf-8'));

    const uiComponentsList = fs.readFileSync(
      path.join(process.cwd(), 'src', 'prompts', 'ui_components_list.md'),
      'utf-8',
    );

    const lucidReactIcons = fs.readFileSync(
      path.join(process.cwd(), 'src', 'prompts', 'lucid_react_components.txt'),
      'utf-8',
    );

    const promptPath = path.join(
      process.cwd(),
      'src',
      'tools',
      'get-files-with-description.tool.ts.md',
    );
    const prompt = fs
      .readFileSync(promptPath, 'utf-8')
      .replace('{baseTemplate}', JSON.stringify(baseTemplate))
      .replace('{uiComponentsList}', uiComponentsList)
      .replace('{lucidReactIcons}', lucidReactIcons);

    const agent = SimpleAgent.create(this.configService, prompt, {
      outputFormat: 'json',
      baseUrl: this.configService.get('GEMINI_BASE_URL'),
      apiKey: this.configService.get('GEMINI_API_KEY'),
      model: this.configService.get('GEMINI_FLASH_MODEL'),
    });

    try {
      const response = await agent.execute(
        `Create a list of files and their descriptions for micro application building plan: '${problemStatement}'.
Format the response as a JSON object with the following keys:`,
        'json',
      );
      return response.files;
    } catch (error) {
      console.error('Error getting files with description:', error);
      throw error;
    }
  }
}
