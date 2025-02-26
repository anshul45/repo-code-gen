import { useState } from 'react';
import { ChatMessage, FileInfo, GeneratedFiles, ParsedCode } from './types';

export function useCodeGeneration() {
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [filesToGenerate, setFilesToGenerate] = useState<FileInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentlyGenerating, setCurrentlyGenerating] = useState<string | null>(null);
  const [chatId] = useState<string>(() => crypto.randomUUID());

  const parseCodeContent = (content: string): ParsedCode | null => {
    if (!content) return null;
    
    try {
      // Check if content is a JSON string that might be truncated
      if (content.startsWith('{') && !content.endsWith('}')) {
        // Try to find where the JSON object likely ends
        const lastCodeQuoteIndex = content.lastIndexOf('"}');
        if (lastCodeQuoteIndex > 0) {
          // Add closing brace to make it valid JSON
          content = content.substring(0, lastCodeQuoteIndex + 2) + '}';
        } else {
          // Less reliable fallback - just add a closing brace
          content = content + '"}';
        }
      }
      
      // Try to parse the content
      const parsed = JSON.parse(content);
      if (parsed.file_name && parsed.file_path && parsed.code) {
        return parsed as ParsedCode;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing code content:', error);
      
      // Try a more aggressive approach for salvaging the code
      try {
        // Extract code using regex pattern matching
        const fileNameMatch = content.match(/"file_name":\s*"([^"]+)"/);
        const filePathMatch = content.match(/"file_path":\s*"([^"]+)"/);
        const codeStartMatch = content.match(/"code":\s*"(.*)/);
        
        if (fileNameMatch && filePathMatch && codeStartMatch) {
          const fileName = fileNameMatch[1];
          const filePath = filePathMatch[1];
          let code = codeStartMatch[1];
          
          // Clean up escaped newlines and quotes
          code = code.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          // Remove trailing partial JSON if present
          const lastEndQuoteIndex = code.lastIndexOf('\\n"}');
          if (lastEndQuoteIndex > 0) {
            code = code.substring(0, lastEndQuoteIndex);
          }
          
          return {
            file_name: fileName,
            file_path: filePath,
            code: code
          };
        }
      } catch (fallbackError) {
        console.error('Failed fallback parsing:', fallbackError);
      }
      
      return null;
    }
  };

  const handleSubmit = async (input: string) => {
    setError(null);
    setIsLoading(true);
    
    // Reset files state for new request
    setFilesToGenerate([]);
    setSelectedFile(null);
    setGeneratedFiles({});

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          user_id: chatId 
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
        // Since the API returns the complete conversation thread,
        // we should replace our current messages with the returned ones
        setMessages(data.result);
        
        // Find files response in the results
        const filesMessage = data.result.find((msg: ChatMessage) => 
          msg.role === 'tool' && msg.type === 'json-files'
        );
        
        if (filesMessage && filesMessage.content) {
          try {
            const filesData = JSON.parse(filesMessage.content as string) as FileInfo[];
            setFilesToGenerate(filesData);
          } catch (error) {
            console.error('Error parsing file list:', error);
          }
        }
      }
    } catch (err) {
      setError('Failed to send request. Please try again.');
      console.error('Error in chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFile = async (filePath: string) => {
    setCurrentlyGenerating(filePath);
    setSelectedFile(filePath);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate ${filePath}`,
          user_id: chatId,
          intent: 'code'
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate ${filePath}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.result) {
        // Since API returns complete conversation thread, update messages
        setMessages(data.result);
        
        // Find code message in results
        const codeMessage = data.result.find((msg: ChatMessage) =>
          msg.role === 'assistant' && msg.intent === 'code'
        );
        
        if (codeMessage && codeMessage.content) {
          const parsedCode = parseCodeContent(codeMessage.content as string);
          if (parsedCode) {
            // Initialize with empty streamedCode for streaming effect
            parsedCode.streamedCode = '';
            parsedCode.streamIndex = 0;
            
            setGeneratedFiles(prev => ({
              ...prev,
              [filePath]: {
                parsedCode,
                status: 'completed'
              }
            }));

            // Start streaming effect
            const streamCode = () => {
              const codeLength = parsedCode.code.length;
              let currentIndex = 0;
              const streamInterval = setInterval(() => {
                currentIndex += 1; // Stream one character at a time
                const isComplete = currentIndex >= codeLength;
                
                setGeneratedFiles(prev => {
                  const currentFile = prev[filePath];
                  if (!currentFile?.parsedCode) return prev;
                  
                  return {
                    ...prev,
                    [filePath]: {
                      ...currentFile,
                      parsedCode: {
                        ...currentFile.parsedCode,
                        streamedCode: parsedCode.code.slice(0, isComplete ? codeLength : currentIndex),
                        streamIndex: isComplete ? codeLength : currentIndex
                      }
                    }
                  };
                });

                if (isComplete) {
                  clearInterval(streamInterval);
                }
              }, 30); // Slower interval for smoother animation
            };

            streamCode();
            
            // If this is the first file generated, select it
            if (!selectedFile) {
              setSelectedFile(filePath);
            }
          } else {
            throw new Error(`Failed to parse code for ${filePath}`);
          }
        } else {
          throw new Error(`No code returned for ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`Error generating ${filePath}:`, error);
      setGeneratedFiles(prev => ({
        ...prev,
        [filePath]: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to generate file'
        }
      }));
    } finally {
      setCurrentlyGenerating(null);
    }
  };

  const generateAllFiles = async () => {
    for (const file of filesToGenerate) {
      if (!generatedFiles[file.file_path]) {
        await generateFile(file.file_path);
      }
    }
  };

  return {
    error,
    messages,
    filesToGenerate,
    selectedFile,
    generatedFiles,
    isLoading,
    currentlyGenerating,
    chatId,
    handleSubmit,
    generateFile,
    generateAllFiles,
    setSelectedFile
  };
}
