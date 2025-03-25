import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { useFileStore } from "@/store/fileStore";
import { useSidebar } from "@/components/ui/sidebar";
import { Loader2 } from 'lucide-react';

const ToolMessage = ({ message, setSelectedMessage }: any) => {
  const [currentGeneratingFile, setCurrentGeneratingFile] = useState<string | null>(null);
  const { addFile, updateMountFile } = useFileStore();
  const { open } = useSidebar();
  const [generate, setGenerate] = useState<boolean>(false);
  
  const [generatedFiles, setGeneratedFiles] = useState<{ [key: string]: boolean }>({});

  const generateCode = async () => {
    try {
      setGenerate(true);

      setSelectedMessage(prev => prev ? {
        ...prev,
        generatedFiles: prev.generatedFiles || {}
      } : null);

      for (const file of message) {
        setCurrentGeneratingFile(file.file_path);

        setSelectedMessage(prev => prev ? {
          ...prev,
          status: 'generating',
          currentFile: file.file_path 
        } : null);

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Generate ${file.file_path} , Description ${file.description}`,
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

        // Mark the file as generated (checked)
        setGeneratedFiles(prev => ({ ...prev, [file.file_path]: true }));

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

        setCurrentGeneratingFile(null);
      }
    } catch (error) {
      console.error('Error generating files:', error);
      setSelectedMessage(prev => prev ? {
        ...prev,
        status: 'error'
      } : null);
    } finally {
      setGenerate(false);
    }
  };

  return (
    <div className={`p-5 border-[1px] rounded-md text-sm  bg-gray-100  ${open ? "w-[304px]" : "w-[377px]"}`}>
      <div className='bg-white border-[1px] rounded-sm'>
        <div className='border-b-2 p-3 text-[15px] font-semibold'>Files to be Created.</div>
        {message.map((file: any, idx: number) => (
          <PreviewFiles 
            key={idx} 
            file={file} 
            isGenerating={currentGeneratingFile === file.file_path} 
            isChecked={generatedFiles[file.file_path] || false}
          />
        ))}
      </div>
      <Button onClick={generateCode} className='w-full mt-3' style={{ backgroundColor: 'black', color: 'white' }}>
        Generate
      </Button>
    </div>
  );
};

const PreviewFiles = ({ file, isGenerating, isChecked }: any) => {
  return (
    <div className='p-3 flex items-center gap-2'>
      {isGenerating ? (
        <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
      ) : (
        <Checkbox checked={isChecked} />
      )}
      <div className='font-semibold text-xs flex items-center gap-2'>
        {file?.file_path}
      </div>
    </div>
  );
};

export default ToolMessage;
