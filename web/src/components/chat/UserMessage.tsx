import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
interface UserMessageProps {
  message: string;
}

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="p-3.5 rounded-md border-[1px] flex items-center gap-3 bg-gray-50 max-w-full">
        <Avatar className='w-9 h-9'>
        <AvatarImage src="" />
        <AvatarFallback>PC</AvatarFallback>
        </Avatar>
        <div className='text-sm'>{message}</div>
    </div>
  ) 
}

export default UserMessage
