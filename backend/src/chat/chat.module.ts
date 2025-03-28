import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ManagerAgent } from '../agents/manager.agent';
import { CoderAgent } from '../agents/coder.agent';
import { GetFilesWithDescriptionTool } from '../tools/get-files-with-description.tool';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ManagerAgent,
    CoderAgent,
    GetFilesWithDescriptionTool,
  ],
})
export class ChatModule {}
