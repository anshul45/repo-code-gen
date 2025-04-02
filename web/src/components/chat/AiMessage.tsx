import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChatStore } from '@/store/chat';

interface AiMessageProps {
  message: string;
  type?: string;
}

const isCompilationError = (message: string, type?: string) => {
  return type === 'error' || message.includes("Failed to compile") || message.includes("Syntax Error");
};

const AiMessage = ({ message, type }: AiMessageProps) => {
  const chatStore = useChatStore();

  const handleFixError = async () => {
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('chatUserId', userId);
    }
    
    const cleanMessage = message.replace(/```/g, '').trim();
    await chatStore.sendMessage(`Please help me fix this error:\n${cleanMessage}`, userId);
  };

  return (
    <div className="p-3.5 border-[1px] rounded-md text-sm bg-gray-50 max-w-full">
      {isCompilationError(message, type) && (
        <button
          onClick={handleFixError}
          className="mb-2 px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
        >
          Fix Error
        </button>
      )}
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
