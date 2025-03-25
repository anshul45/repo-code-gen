import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { RedisCacheModule } from './redis/redis.cache.module';

@Module({
  imports: [ChatModule,RedisCacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
