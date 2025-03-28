import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
interface AiMessageProps {
  message: string;
}

const AiMessage = ({ message }: AiMessageProps) => {
  return (
    <div className="p-3.5 border-[1px] rounded-md text-sm bg-gray-50 max-w-full">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="break-words">{children}</p>,
          code: ({ children, ...props }) => {
            const isInline = !props.className?.includes('code-block');
            return isInline ? (
              <code className="font-mono text-sm">{children}</code>
            ) : (
              <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            )
          },
          pre: ({ children }) => (
            <pre className="overflow-auto font-mono whitespace-pre p-2 text-sm">{children}</pre>
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
