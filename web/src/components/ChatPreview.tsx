import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatHistory from './ChatHistory';
import { useChatStore } from "@/store/toggle";
import { useFileStore } from '@/store/fileStore';


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

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isChatsOpen } = useChatStore();

  const { addFile,updateMountFile } = useFileStore();



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

        const code = data?.result?.filter((data:any) => data.type === "code");

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
  }




  return (
    <div className='w-full flex h-[calc(100vh-60px)]'>
      {isChatsOpen &&
        <ChatHistory messages={messages} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} scrollRef={scrollRef} />
      }
      <div className="w-full flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
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
                    <ul className=" mt-2 list-none">
                      {(() => {
                        try {
                          const files = JSON.parse(selectedMessage.content) as FileInfo[];
                          return files.map((file) => (
                            <li key={file.file_path} className="mb-2 bg-white rounded-md py-1 px-2 border-[1px]">
                              <span className="font-semibold text-sm">{file.file_path}</span>
                              <p className="text-gray-600 text-sm">
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
                                  className={`font-semibold cursor-pointer ${selectedMessage.generatedFiles?.[file.file_path] ? 'text-blue-600 hover:text-blue-800' : ''
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
                        onClick={generateCode}
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
            <p className="text-gray-500 text-center text-lg">Select a message to view content</p>
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
  )
}

export default ChatPreview