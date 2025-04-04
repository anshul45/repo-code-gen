import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CodebaseSyncService } from './codebase-sync.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService, CodebaseSyncService],
  exports: [ProjectService, CodebaseSyncService],
})
export class ProjectModule {} 