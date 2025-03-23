import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar";

const UserMessage = ({message}:any) => {
   const { open } = useSidebar(); 
  return (
    <div className={`p-3.5 rounded-md border-[1px] flex items-center gap-3 bg-gray-50 ${open ? "w-[304px]":"w-[377px]"}`}>
        <Avatar className='w-9 h-9'>
        <AvatarImage src="" />
        <AvatarFallback>PC</AvatarFallback>
        </Avatar>
        <div className='text-sm'>{message}</div>
    </div>
  ) 
}

export default UserMessage