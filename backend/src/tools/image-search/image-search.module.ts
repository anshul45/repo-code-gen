import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageSearchTool } from './image-search.tool';

@Module({
  imports: [ConfigModule],
  providers: [ImageSearchTool],
  exports: [ImageSearchTool],
})
export class ImageSearchModule {}
