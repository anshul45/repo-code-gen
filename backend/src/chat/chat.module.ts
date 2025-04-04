import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ManagerAgent } from '../agents/manager.agent';
import { CoderAgent } from '../agents/coder.agent';
import { EditorAgent } from '../agents/editor.agent';
import { RouterAgent } from '../agents/router.agent';
import { GetFilesWithDescriptionTool } from '../tools/get-files-with-description.tool';
import { ConfigModule } from '@nestjs/config';
import { ImageSearchModule } from '../tools/image-search/image-search.module';
import { RedisCacheModule } from '../redis/redis.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ConfigModule, ImageSearchModule, RedisCacheModule, ProjectModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    RouterAgent,
    ManagerAgent,
    EditorAgent,
    CoderAgent,
    GetFilesWithDescriptionTool,
  ],
})
export class ChatModule {}
