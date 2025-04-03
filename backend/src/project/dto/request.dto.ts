import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  initialPrompt: string;
  
  @IsString()
  @IsOptional()
  userId?: string;
}
