'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Chat() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isStreaming,
    currentStreamedContent,
    sendMessage
  } = useChatStore();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentStreamedContent]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = input;
    setInput('');
    setError(null);
    
    try {
      // Generate a unique user ID if not already stored
      let userId = localStorage.getItem('chatUserId');
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('chatUserId', userId);
      }
      
      await sendMessage(message, userId);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error in chat:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto p-4">
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-12'
                  : 'bg-muted mr-12'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </Card>
          ))}
          {isStreaming && (
            <Card className="p-4 bg-muted mr-12">
              <p className="whitespace-pre-wrap">{currentStreamedContent}</p>
            </Card>
          )}
          {error && (
            <Card className="p-4 bg-destructive text-destructive-foreground">
              <p>{error}</p>
            </Card>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isStreaming}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isStreaming}
          className="min-w-[80px]"
        >
          {isStreaming ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}
