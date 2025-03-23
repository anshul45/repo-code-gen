import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSidebar } from "@/components/ui/sidebar";

const AiMessage = ({ message }: any) => {
  const { open } = useSidebar(); 
  return (
    <div className={`p-3.5 border-[1px] rounded-md text-sm bg-gray-50 ${open ? "w-[304px]":"w-[377px]"}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="break-words">{children}</p>,
          code: ({ children }) => (
            <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="overflow-auto bg-gray-200 p-2 rounded text-sm">{children}</pre>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 underline break-all" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {message}
      </Markdown>
    </div>
  )
}

export default AiMessage
