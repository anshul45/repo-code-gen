import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { useFileStore } from "@/store/fileStore";
import { useSidebar } from "@/components/ui/sidebar";

interface FileInfo {
  file_path: string;
  description: string;
}

const ToolMessage = ({ message,selectedMessage,setSelectedMessage }: any) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { addFile, updateMountFile } = useFileStore();
  const { open } = useSidebar(); 

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
    <div className={`p-5 border-[1px] rounded-md text-sm bg-gray-100 ${open ? "w-[304px]":"w-[377px]"}`}>
      <div className='bg-white border-[1px] rounded-sm'>
        <div className='border-b-2 p-3 text-[15px] font-semibold'>Files to be Created.</div>
        {message.map((message: any, idx: number) => (<PreviewFiles file={message} key={idx} />))}
      </div>
      <Button onClick={generateCode} className='w-full mt-3' style={{ backgroundColor: 'black', color: 'white' }}>Generate</Button>
    </div>
  )
}


const PreviewFiles = ({ file }: any) => {
  return (
    <div className='p-3 flex items-center gap-2'>
      <Checkbox />
      <div className='font-semibold'>{file?.file_path}</div>
    </div>
  )
}

export default ToolMessage