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
    // Read base template
    const baseTemplatePath = path.join(
      process.cwd(),
      'src',
      'tools',
      'base-template.json',
    );
    const baseTemplate = JSON.parse(fs.readFileSync(baseTemplatePath, 'utf-8'));

    const agent = SimpleAgent.create(
      this.configService,
      `You are a highly skilled **100x Next.js TypeScript developer** specializing in **Radix UI**, **Tailwind CSS**, and **App Router (Next.js 14)**.  
Your task is to plan which files need to be created for the project and provide the description of what needs to be done in those files like a best MVP product.
These files are connected to each other, meaning this is functional connected application, where user can navigate between pages and components.
You need to mention the files transition in the descriptcion of the file that is interacting with other files.
The **base_template** is already set up with **Next.js 14 App Router**, **Radix UI** and **Tailwind CSS** and it is provided to you as a context in json format.

Your task is to **expand the application** by adding **routes, components, layouts, styling and features** as required. 
You will be provided with the plan for a micro application which needs to implemented, understand it and create which files need to be created and provide the description of what needs to be done in those files for implementation purposes.

**IMPORTANT POINTS:**
    - the code should use src/app/page.tsx as the main page or any app should start from this page. for example, if you are cereating a todo app, then the code should start from src/app/page.tsx where the todo app should start.
    - The UI page .tsx file should be inside folder in the app directory.
    - the api file is .route.ts file and should be inside folder in the api directory.
    
OUTPUT JSON FORMAT:
    {
        "files": [
            {
                "file_path": 'src/app/api/chat/route.ts',
                "description": <description>,
            }
        ]
    }

[base_template]
${JSON.stringify(baseTemplate)}`,
      {
        outputFormat: { type: 'json_object' },
        baseUrl: this.configService.get('LLM_BASE_URL'),
        apiKey: this.configService.get('LLM_API_KEY'),
        model: this.configService.get('LLM_MODEL', 'gemini-2.0-flash'),
      },
    );

    try {
      const response = await agent.execute(
        `Create a list of files and their descriptions for micro application building plan: '${problemStatement}'.
Format the response as a JSON object with the following keys:`,
      );
      return response.files;
    } catch (error) {
      console.error('Error getting files with description:', error);
      throw error;
    }
  }
}
