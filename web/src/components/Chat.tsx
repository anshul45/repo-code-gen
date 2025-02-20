'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Editor from "@monaco-editor/react";

export function Chat() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]); // Store messages instead of files
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
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
        body: JSON.stringify({ message: input, user_id: userId }),
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

  return (
    <div className="flex h-screen">
      {/* Sidebar for Message List */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        {messages.length === 0 && <p className="text-gray-500">No messages yet</p>}
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-2 cursor-pointer ${selectedMessage === msg ? 'bg-blue-300' : 'hover:bg-gray-300'}`}
            onClick={() => setSelectedMessage(msg)}
          >
            {msg.role === 'assistant' ? 'AI' : 'You'}: {msg.content?.substring(0, 30)}...
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Message Content Section */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 p-4">
          {selectedMessage ? (
            <>
              <h3 className="text-lg font-semibold">{selectedMessage.role === 'assistant' ? 'AI Response' : 'Your Message'}</h3>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {typeof selectedMessage.content === 'string' 
                  ? selectedMessage.content 
                  : JSON.stringify(selectedMessage.content, null, 2)}
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a message to view content</p>
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a request (e.g., 'Build a Spotify app')..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[80px]"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
