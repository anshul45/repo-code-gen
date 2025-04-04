import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CodebaseSyncService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates a specific file in the project's codebase
   * @param projectId The project ID
   * @param filePath The path of the file to update
   * @param content The new content of the file
   */
  async updateFile(projectId: string, filePath: string, content: string): Promise<void> {
    try {
      // Get the current project
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        console.error(`Project with ID ${projectId} not found`);
        return;
      }

      // Get the current codebase
      const codebase = project.codebase as Record<string, any>;
      
      // Update the file in the codebase
      this.addFileToCodebase(codebase, filePath, content);
      
      // Save the updated codebase back to the database
      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          codebase,
          updatedAt: new Date(),
        },
      });
      
      console.log(`Successfully updated file ${filePath} in project ${projectId}`);
    } catch (error) {
      console.error('Error updating file in codebase:', error);
      throw error;
    }
  }

  /**
   * Updates multiple files in the project's codebase at once
   * @param projectId The project ID
   * @param files Array of files with their paths and contents
   */
  async updateMultipleFiles(
    projectId: string, 
    files: { path: string; content: string }[]
  ): Promise<void> {
    try {
      // Get the current project
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        console.error(`Project with ID ${projectId} not found`);
        return;
      }

      // Get the current codebase
      const codebase = project.codebase as Record<string, any>;
      
      // Update each file in the codebase
      for (const file of files) {
        this.addFileToCodebase(codebase, file.path, file.content);
      }
      
      // Save the updated codebase back to the database
      await this.prisma.project.update({
        where: { id: projectId },
        data: {
          codebase,
          updatedAt: new Date(),
        },
      });
      
      console.log(`Successfully updated ${files.length} files in project ${projectId}`);
    } catch (error) {
      console.error('Error updating multiple files in codebase:', error);
      throw error;
    }
  }

  /**
   * Gets the content of a specific file from the project's codebase
   * @param projectId The project ID
   * @param filePath The path of the file to get
   * @returns The content of the file, or null if not found
   */
  async getFileContent(projectId: string, filePath: string): Promise<string | null> {
    try {
      // Get the current project
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        console.error(`Project with ID ${projectId} not found`);
        return null;
      }

      // Get the current codebase
      const codebase = project.codebase as Record<string, any>;
      
      // Get the file from the codebase
      const fileContent = this.getFileFromCodebase(codebase, filePath);
      
      return fileContent;
    } catch (error) {
      console.error('Error getting file from codebase:', error);
      return null;
    }
  }

  /**
   * Helper method to add a file to the codebase structure
   */
  private addFileToCodebase(
    codebase: Record<string, any>,
    filePath: string,
    content: string
  ): void {
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

  /**
   * Helper method to get a file from the codebase structure
   */
  private getFileFromCodebase(
    codebase: Record<string, any>,
    filePath: string
  ): string | null {
    // Split path components
    const pathParts = filePath.split('/');
    const filename = pathParts.pop() || '';
    
    // Navigate directory structure
    let current = codebase;
    for (const part of pathParts) {
      if (!part) continue;
      
      if (!current[part] || !current[part].directory) {
        return null; // Directory not found
      }
      
      current = current[part].directory;
    }
    
    // Get file at the final level
    if (filename && current[filename] && current[filename].file) {
      return current[filename].file.contents;
    }
    
    return null; // File not found
  }
} 