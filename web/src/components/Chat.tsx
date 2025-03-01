'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export function Chat() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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

  return (
    <div className="flex h-[92.5vh]">
      {/* Sidebar for Message List */}
      <div className="w-1/5 bg-gray-200 p-4 overflow-y-auto" style={{scrollbarWidth:"thin"}}>
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        {messages.length === 0 && <p className="text-gray-500">No messages yet</p>}
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-2 cursor-pointer ${selectedMessage === msg ? 'bg-blue-300' : 'hover:bg-gray-300'}`}
            onClick={() => setSelectedMessage(msg)}
          >
            {msg.role === 'user' ? 'You' : 'AI'}: {msg.content?.substring(0, 30)}...
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Message Content Section */}
      <div className="w-2/5 flex flex-col h-[92.5vh]">
        <div className="flex-1 p-4 overflow-y-auto" style={{scrollbarWidth:"thin"}}>
          {selectedMessage ? (
            <>
              <h3 className="text-lg font-semibold">
                {selectedMessage.role === 'user' ? 'Your Message' : 'AI Response'}
                {selectedMessage.agent_name && ` (${selectedMessage.agent_name})`}
              </h3>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {selectedMessage.type === 'json-files' ? (
                  <div>
                    <p>The following files will be added:</p>
                    <ul className="list-disc pl-6 mt-2">
                      {(() => {
                        try {
                          const files = JSON.parse(selectedMessage.content) as FileInfo[];
                          return files.map((file) => (
                            <li key={file.file_path} className="mb-2">
                              <span className="font-semibold">{file.file_path}</span>
                              <p className="text-gray-600 text-sm mt-1">
                                {file.description}
                              </p>
                            </li>
                          ));
                        } catch (error) {
                          console.error('Error parsing JSON:', error);
                          return <li>Error parsing file list</li>;
                        }
                      })()}
                    </ul>
                    <div className="space-y-4">
                      {(() => {
                        try {
                          const files = JSON.parse(selectedMessage.content) as FileInfo[];
                          return files.map((file) => (
                            <div key={file.file_path} className="mt-4">
                              <div className="flex items-center gap-2">
                                <span 
                                  className={`font-semibold cursor-pointer ${
                                    selectedMessage.generatedFiles?.[file.file_path] ? 'text-blue-600 hover:text-blue-800' : ''
                                  }`}
                                  onClick={() => {
                                    if (selectedMessage.generatedFiles?.[file.file_path]) {
                                      setSelectedMessage(prev => prev ? {
                                        ...prev,
                                        currentFile: file.file_path
                                      } : null);
                                    }
                                  }}
                                >
                                  {file.file_path}
                                </span>
                                {selectedMessage.currentFile === file.file_path && selectedMessage.status === 'generating' && (
                                  <span className="text-blue-500 text-sm">Generating...</span>
                                )}
                                {selectedMessage.generatedFiles?.[file.file_path] && (
                                  <span className="text-green-500 text-sm">✓ Generated</span>
                                )}
                                {selectedMessage.status === 'error' && (
                                  <span className="text-red-500 text-sm">Error</span>
                                )}
                              </div>
                            </div>
                          ));
                        } catch (error) {
                          console.error('Error parsing JSON:', error);
                          return null;
                        }
                      })()}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={async () => {
                          try {
                            setIsGenerating(true);
                            const files = JSON.parse(selectedMessage.content) as FileInfo[];
                            
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

                              // Update generated files with the new content
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
                        }}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Continue with Generation'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  typeof selectedMessage.content === 'string' 
                    ? selectedMessage.content 
                    : JSON.stringify(selectedMessage.content, null, 2)
                )}
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

      {/* Code Display Section */}
      <div className="w-2/5 border-l border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Generated Code</h3>
          {selectedMessage?.currentFile && selectedMessage?.generatedFiles?.[selectedMessage.currentFile] ? (
            <>
              <div className="mb-2 text-sm text-gray-600">{selectedMessage.currentFile}</div>
              <pre className="p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {selectedMessage.generatedFiles[selectedMessage.currentFile]}
              </pre>
            </>
          ) : (
            <p className="text-gray-500">Select a file to view its generated code</p>
          )}
        </div>
      </div>
    </div>
  );
}
