'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import FileExplorer from '@/components/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function ProjectPage() {
  const { id } = useParams();
  const [activeFile, setActiveFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Handle form submission here, for now we'll just log the input
    console.log('Submitting message:', input);
    // Optionally, add the new message to state
    setMessages([...messages, { id: Date.now(), role: 'user', content: input }]);
    setInput(''); // Clear input after submit
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim().length === 0) return;  // Validate empty input

    setIsLoading(true);
    try {
      await handleSubmit(e); // Call the handleSubmit function
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-57px)] bg-gray-50">
      {/* Selector */}
          {/* Chat Interface */}
          <div className="flex-[0.33] border-r border-gray-200 bg-white flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex  justify-center`}
                >
                  <div className={`w-96 p-3 rounded-lg ${
                    message.role === 'assistant'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-purple-600 text-white'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans">
                      {message?.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors ${
                    isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-purple-700'
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
          <div className='flex-[0.67]'>
          <Tabs defaultValue="account">
  <TabsList className='flex justify-start w-fit mx-2 my-2 rounded-3xl py-0 px-2'>
    <TabsTrigger value="account" className='rounded-3xl px-4 py-1'>Code</TabsTrigger>
    <TabsTrigger value="password" className='rounded-3xl px-4 py-1'>Preview</TabsTrigger>
  </TabsList>
  
<TabsContent value="account" className='rounded-none border-t-[1px]'>
          {/* IDE Interface */}
          <div className=" flex flex-col">
            <div className="flex">
              {/* File Explorer */}
              <div className='flex-[0.25]'>
                <FileExplorer setActiveFile={setActiveFile} />
              </div>

              {/* Code Editor */}
              <div className="flex-[0.75] bg-white">
                {activeFile ? (
                  <CodeEditor data={activeFile} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select a file to view code
                  </div>
                )}
              </div>
            </div>
          </div>
          </TabsContent>

          <TabsContent value="password">Preview Soon.</TabsContent>
          </Tabs>
          </div>
    </div>
  );
}
