import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CodebaseSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async syncCodebaseToMongoDB(userId: string, projectId: string): Promise<void> {
    try {
      // Check if the project exists
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        console.error(`Project with ID ${projectId} not found for user ${userId}`);
        return;
      }

      // Read the project file from the filesystem
      const projectFilePath = path.resolve(`project_${userId}_${projectId}.md`);
      
      if (!fs.existsSync(projectFilePath)) {
        console.log(`Project file not found at ${projectFilePath}, nothing to sync`);
        return;
      }

      const projectContext = fs.readFileSync(projectFilePath, 'utf-8');
      
      // Parse the MD file to extract file structures
      const codebase = this.parseCodebaseFromMarkdown(projectContext);

      // Update the MongoDB record with the parsed codebase
      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          codebase,
          updatedAt: new Date(), // Ensure the updatedAt timestamp is refreshed
        },
      });

      console.log(`Successfully synced codebase to MongoDB for project ${projectId}`);
    } catch (error) {
      console.error('Error syncing codebase to MongoDB:', error);
    }
  }

  async syncCodebaseFromMongoDB(userId: string, projectId: string): Promise<void> {
    try {
      // Check if the project exists
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        console.error(`Project with ID ${projectId} not found for user ${userId}`);
        return;
      }

      // Check if the codebase is empty
      if (!project.codebase || Object.keys(project.codebase as any).length === 0) {
        console.log(`Codebase is empty for project ${projectId}, nothing to sync`);
        return;
      }

      // Generate markdown content from the codebase
      const markdownContent = this.generateMarkdownFromCodebase(project.codebase as any);
      
      // Define the project file path
      const projectFilePath = path.resolve(`project_${userId}_${projectId}.md`);
      
      // Write or append to the file
      const timestamp = new Date().toISOString();
      const newContent = `\n\n# Loaded From MongoDB - ${timestamp}\n\n${markdownContent}`;
      
      if (!fs.existsSync(projectFilePath)) {
        fs.writeFileSync(projectFilePath, newContent.trim(), 'utf-8');
      } else {
        // Append to existing file
        fs.appendFileSync(projectFilePath, newContent, 'utf-8');
      }
      
      console.log(`Successfully synced codebase from MongoDB to filesystem for project ${projectId}`);
    } catch (error) {
      console.error('Error syncing codebase from MongoDB:', error);
    }
  }

  private generateMarkdownFromCodebase(codebase: Record<string, any>): string {
    const files: { path: string; content: string }[] = [];
    
    const extractFiles = (obj: Record<string, any>, currentPath: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        if (!value || typeof value !== 'object') continue;
        
        if ('file' in value && value.file) {
          files.push({
            path: `${currentPath}${key}`,
            content: value.file.contents,
          });
        } else if ('directory' in value) {
          extractFiles(value.directory, `${currentPath}${key}/`);
        }
      }
    };
    
    extractFiles(codebase);
    
    return files
      .map(file => `## ${file.path}\n${file.content}\n\`\`\``)
      .join('\n\n');
  }

  private parseCodebaseFromMarkdown(markdownContent: string): Record<string, any> {
    const codebase: Record<string, any> = {};
    
    // Split by sections (each file is a section)
    const fileSections = markdownContent.split('## ').filter(Boolean);
    
    for (const section of fileSections) {
      // Extract file path and content
      const firstLineEnd = section.indexOf('\n');
      if (firstLineEnd === -1) continue;
      
      const filePath = section.substring(0, firstLineEnd).trim();
      const fileContent = section.substring(firstLineEnd).trim();
      
      if (!filePath || !fileContent) continue;
      
      // Add to codebase structure
      this.addFileToCodebase(codebase, filePath, fileContent);
    }
    
    return codebase;
  }

  private addFileToCodebase(
    codebase: Record<string, any>,
    filePath: string,
    content: string
  ): void {
    // Remove trailing ```
    content = content.replace(/```\s*$/, '').trim();
    
    // Split path components
    const pathParts = filePath.split('/');
    const filename = pathParts.pop() || '';
    
    // Navigate/create directory structure
    let current = codebase;
    for (const part of pathParts) {
      if (!part) continue;
      
      if (!current[part]) {
        current[part] = { directory: {} };
      } else if (!current[part].directory) {
        current[part].directory = {};
      }
      
      current = current[part].directory;
    }
    
    // Add file at the final level
    if (filename) {
      current[filename] = {
        file: {
          contents: content
        }
      };
    }
  }
} 