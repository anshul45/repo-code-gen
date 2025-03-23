/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import InputBox from './chat/input-box';
import UserMessage from './chat/UserMessage';
import AiMessage from './chat/AiMessage';
import ToolMessage from './chat/ToolMessage';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [error, setError] = useState<string | null>(null);


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
        setMessages((prev) => [...prev, ...data.result]);

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
    <div className="w-full flex flex-col h-[calc(100vh-60px)] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="w-full flex flex-col gap-5">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {message.role === 'user' ? (
                  <UserMessage message={message?.content} />
                ) : message.role === 'assistant' ? (
                  <AiMessage message={message?.content} />
                ) : (
                  <ToolMessage message={JSON.parse(message?.content)} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Box */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
        <InputBox
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatPreview;