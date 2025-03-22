import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore } from "@/store/toggle";
import { useFileStore } from '@/store/fileStore';
import InputBox from './chat/input-box';
import UserMessage from './chat/UserMessage';
import AiMessage from './chat/AiMessage';
import ToolMessage from './chat/ToolMessage';


interface ChatMessage {
  role: 'assistant' | 'user' | 'tool';
  content: string;
  type?: string;
  status?: 'pending' | 'generating' | 'completed' | 'error';
  output?: string;
  tool_call_id?: string;
  name?: string;
  agent_name?: string;
  currentFile?: string;
  generatedFiles?: { [key: string]: string };
}


interface FileInfo {
  file_path: string;
  description: string;
}

const ChatPreview = () => {

  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addFile, updateMountFile } = useFileStore();


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      let userId = localStorage.getItem('chatUserId');
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('chatUserId', userId);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          user_id: userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      const data = await response.json();


      if (data.error) {
        throw new Error(data.error);
      }

      if (data.result) {
        // Add new messages to the list
        setMessages(prev => [...prev, ...data.result]);

        // Select the latest message
        if (data.result.length > 0) {
          setSelectedMessage(data.result[data.result.length - 1]);
        }
      }
    } catch (err) {
      setError('Failed to send request. Please try again.');
      console.error('Error in chat:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const generateCode = async () => {
    try {
      setIsGenerating(true);
      const files = JSON.parse(selectedMessage?.content) as FileInfo[];

      // Initialize generatedFiles if it doesn't exist
      setSelectedMessage(prev => prev ? {
        ...prev,
        generatedFiles: prev.generatedFiles || {}
      } : null);

      for (const file of files) {
        // Update status to generating for current file
        setSelectedMessage(prev => prev ? {
          ...prev,
          status: 'generating',
          currentFile: file.file_path
        } : null);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Generate ${file.file_path}`,
            user_id: localStorage.getItem('chatUserId'),
            intent: 'code'
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate ${file.file_path}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const code = data?.result?.filter((data: any) => data.type === "code");

        function extractPathAndContent(obj: any, currentPath = ''): { path: string, contents: any }[] {
          const result: { path: string, contents: any }[] = [];

          for (const key in obj) {
            const value = obj[key];

            if (key === 'file' && value.contents !== undefined) {
              result.push({ path: currentPath, contents: value.contents });
            } else if (typeof value === 'object' && value !== null) {
              const newPath = key === 'directory' ? currentPath : (currentPath ? `${currentPath}/${key}` : key);
              result.push(...extractPathAndContent(value, newPath));
            }
          }

          return result;
        }

        const latestCode = code[code.length - 1]?.content;

        updateMountFile(latestCode);

        const updatedData = extractPathAndContent(JSON.parse(latestCode));

        addFile(updatedData[0]?.path, updatedData[0]?.contents);

        setSelectedMessage(prev => {
          if (!prev) return null;

          const newGeneratedFiles = {
            ...prev.generatedFiles,
            [file.file_path]: data.result[0]?.content || `Generated ${file.file_path}`
          };

          return {
            ...prev,
            status: 'completed',
            generatedFiles: newGeneratedFiles
          };
        });
      }
    } catch (error) {
      console.error('Error generating files:', error);
      setSelectedMessage(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
    } finally {
      setIsGenerating(false);
    }
  }




  return (
    <div className='w-full flex h-[calc(100vh-60px)]'>
      <ScrollArea className='h-[calc(100vh-190px)] w-96'>

      <div className="w-full flex flex-col gap-5 px-3">
        {messages.map((message, idx) => {
          if (message.role === "user") {
            return <UserMessage key={idx} message={message?.content} />;
          } else if (message.role === "assistant") {
            return <AiMessage key={idx} message={message?.content} />;
          }
          else {
            return <ToolMessage generateCode={generateCode} key={idx} message={JSON.parse(message?.content)}/>
          }
        }
      )}
        {/* Input Form */}
      </div>
      </ScrollArea>
        <InputBox input={input} setInput={setInput} isLoading={isLoading} handleSubmit={handleSubmit} />
    </div>
  )
}

export default ChatPreview