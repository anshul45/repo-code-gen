import { Body, Controller, Param, Post, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatControler{
    constructor(private readonly chatService:ChatService){}
@Post()
getChat(
    @Body() body: { message: string; user_id:string,intent:string},
){
    const intent = body.message;
    if(intent)
        this.chatService.generateResponse();
    else
        this.chatService.generateFiles();

    return "Working...";
}
}