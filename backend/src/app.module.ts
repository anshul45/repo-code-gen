import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { RedisCacheModule } from './redis/redis.module';
import { ImageSearchModule } from './tools/image-search/image-search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    RedisCacheModule,
    ImageSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
