import { Prisma } from '@prisma/client';

export type Project = {
  id: string;
  name: string;
  codebase: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: any;
};

export interface CreateProjectDto {
  name: string;
  codebase: Prisma.JsonValue;
}

export interface UpdateProjectDto {
  name?: string;
  codebase?: Prisma.JsonValue;
} 