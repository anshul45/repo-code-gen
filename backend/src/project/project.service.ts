import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/request.dto';
import { ProjectResponseDto } from './dto/response.dto';
import { UpdateProjectDto } from './types/project.types';
import { CodebaseSyncService } from './codebase-sync.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly codebaseSyncService: CodebaseSyncService,
  ) {}

  async createProject(userId: string, data: CreateProjectDto): Promise<ProjectResponseDto> {
    // Generate a project name based on the initial prompt
    // This is a simple implementation - in the future, you might want to use an AI model
    const projectName = this.generateProjectName(data.initialPrompt);
    
    // Load base template for the initial codebase
    const baseTemplate = this.loadBaseTemplate();
    
    const project = await this.prisma.project.create({
      data: {
        name: projectName,
        userId,
        codebase: baseTemplate || {}, // Initialize with template or empty JSON object if template loading fails
      },
    });

    return {
      id: project.id,
      name: project.name,
    };
  }

  // Load the base template from the template file
  private loadBaseTemplate(): Record<string, any> {
    try {
      const templatePath = path.resolve(__dirname, '..', 'tools', 'base-template.json');
      if (fs.existsSync(templatePath)) {
        const templateData = fs.readFileSync(templatePath, 'utf-8');
        return JSON.parse(templateData);
      }
      console.error('Base template file not found at', templatePath);
      return {};
    } catch (error) {
      console.error('Error loading base template:', error);
      return {};
    }
  }

  // Simple function to generate a project name from the prompt
  private generateProjectName(prompt: string): string {
    // Extract first few words (up to 5) and capitalize each word
    const words = prompt.split(/\s+/).slice(0, 5);
    if (words.length === 0) return "New Project";
    
    // Create a name from the first few words
    return words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .substring(0, 50); // Limit length
  }

  async getProject(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // When a project is opened, sync its codebase from MongoDB to the filesystem
    // This ensures that if there's codebase data in MongoDB, it's available as a markdown file
    await this.codebaseSyncService.syncCodebaseFromMongoDB(userId, projectId);

    return project;
  }

  async getUserProjects(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateProject(projectId: string, data: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  async deleteProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return this.prisma.project.delete({
      where: { id: projectId },
    });
  }

  async getProjectById(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    return project;
  }

}