import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/request.dto';
import { ProjectResponseDto } from './dto/response.dto';
import { UpdateProjectDto } from './types/project.types';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Request() req,
    @Body() data: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.createProject(req.user.id, data);
  }

  @Get()
  async getUserProjects(@Request() req) {
    return this.projectService.getUserProjects(req.user.id);
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    return this.projectService.getProject(id);
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() data: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(id, data);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
} 