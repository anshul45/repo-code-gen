import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/request.dto';
import { ProjectResponseDto } from './dto/response.dto';
import { UpdateProjectDto } from './types/project.types';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(userId: string, data: CreateProjectDto): Promise<ProjectResponseDto> {
    // TODO: Implement agent to generate project name based on initialPrompt
    const projectName = "New Project"; // Placeholder until agent is implemented
    
    const project = await this.prisma.project.create({
      data: {
        name: projectName,
        userId,
        codebase: {}, // Initialize with empty JSON object as required by schema
      },
    });

    return {
      id: project.id,
      name: project.name,
    };
  }

  async getProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

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
} 