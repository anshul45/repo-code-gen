import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
const AiMessage = ({message}:any) => {
  return (
    <div className='p-3.5 border-[1px] rounded-md text-sm bg-gray-50'>
      <Markdown remarkPlugins={[remarkGfm]}>{message}</Markdown>
    </div>
  )
}

export default AiMessage