/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import InputBox from './chat/input-box';
import UserMessage from './chat/UserMessage';
import AiMessage from './chat/AiMessage';
import ToolMessage from './chat/ToolMessage';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ChatMessage, FileDescription } from '@/types/chat';
import { useChatStore } from '@/store/chat';

interface ChatPreviewProps {
  setActiveFile: (file: { content: string; path: string; isNew: boolean }) => void;
}

const ChatPreview = ({ setActiveFile }: ChatPreviewProps) => {
  const [input, setInput] = useState<string>('');
  const chatStore = useChatStore();
  console.log("ChatPreview rendering with messages:", chatStore.messages);
  
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `
✨ **Hello, I'm Curie!** ✨ 

🚀 I'm your personal coding companion, ready to help you build amazing applications!

📌 Here are some ideas to get you started:

    🎵  Spotify Clone
        Stream your favorite music
   
    📝  Todo List
        Organize your tasks
   
    🌤️  Weather App
        Check the forecast

💡 Just tell me what you'd like to build, and I'll guide you through every step of the process!

✨ Let's create something awesome together! ✨`
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, chatStore.messages]);

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
          user_id: userId,
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
        const newMessages = data.result.map((msg: ChatMessage) => ({ ...msg, isNew: true }));
        setLocalMessages((prev: ChatMessage[]) => [...prev, ...newMessages]);

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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden min-h-0">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-6 py-4 w-full min-h-0">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 min-h-0">
          {[...localMessages, ...chatStore.messages].filter((message: ChatMessage) => {
            if (message.role === 'user' || message.role === 'assistant') return true;
            if (message.role === 'tool' && message.type === 'json-files') {
              return true;
            }
            return false;
          }).map((message, idx) => {
            console.log("Rendering message:", message);
            return ('isNew' in message && message.isNew) ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                  setLocalMessages((prev: ChatMessage[]) => 
                    prev.map((msg: ChatMessage, i: number) => 
                      i === idx ? { ...msg, isNew: false } : msg
                    )
                  );
                }}
              >
                {message.role === 'user' ? (
                  <UserMessage key={idx} message={message?.content} />
                ) : message.role === 'assistant' ? (
                  <AiMessage key={idx} message={message?.content} type={message?.type} />
                ) : (
                  <ToolMessage 
                    key={idx} 
                    setSelectedMessage={setSelectedMessage} 
                    message={JSON.parse(message?.content) as FileDescription[]}
                    setActiveFile={setActiveFile}
                  />
                )}
              </motion.div>
            ) : (
              <div key={idx}>
                {message.role === 'user' ? (
                  <UserMessage key={idx} message={message?.content} />
                ) : message.role === 'assistant' ? (
                  <AiMessage key={idx} message={message?.content} type={message?.type} />
                ) : (
                  <ToolMessage 
                    key={idx} 
                    setSelectedMessage={setSelectedMessage} 
                    message={JSON.parse(message?.content) as FileDescription[]}
                    setActiveFile={setActiveFile}
                  />
                )}
              </div>
            );
          })}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Curie is thinking...</span>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-800 shrink-0">
        <div className="max-w-4xl mx-auto w-full">
          <InputBox
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
