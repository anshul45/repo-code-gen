import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatControler } from "./chat.controller";

@Module({
    controllers:[ChatControler],
    providers:[ChatService],
})
export class ChatModule {}