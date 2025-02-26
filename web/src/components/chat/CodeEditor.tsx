import { useEffect, useRef } from 'react';
import { GeneratedFiles } from './types';
import { Button } from '@/components/ui/button';

interface CodeEditorProps {
  selectedFile: string | null;
  generatedFiles: GeneratedFiles;
  currentlyGenerating: string | null;
  onRegenerateFile: (filePath: string) => void;
  isLoading: boolean;
}

export function CodeEditor({
  selectedFile,
  generatedFiles,
  currentlyGenerating,
  onRegenerateFile,
  isLoading
}: CodeEditorProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const codeContent = selectedFile ? generatedFiles[selectedFile]?.parsedCode?.streamedCode ?? '' : '';

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTo({
        top: preRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [Math.floor(codeContent.length / 20)]); // Only scroll every 20 characters

  if (!selectedFile) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 text-gray-500">
        Select a file from the explorer to view or generate code
      </div>
    );
  }

  const file = generatedFiles[selectedFile];

  if (currentlyGenerating === selectedFile) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="text-center">
          <div className="mb-2">Generating code for {selectedFile.split('/').pop()}</div>
          <div className="animate-pulse">Please wait</div>
        </div>
      </div>
    );
  }

  if (file?.status === 'error') {
    return (
      <div className="p-6 bg-red-50 text-red-800 h-full">
        <div className="flex items-start">
          <div>
            <h3 className="text-lg font-medium mb-2">Generation Error</h3>
            <p className="mb-4">{file.error}</p>
            <Button 
              onClick={() => onRegenerateFile(selectedFile)}
              disabled={isLoading || currentlyGenerating !== null}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!file?.parsedCode) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 text-gray-500">
        Click to generate code for this file
      </div>
    );
  }

  const lines = codeContent.split('\n');

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden min-h-0">
        <div className="absolute inset-0 flex code-container" style={{ overflow: 'hidden' }}>
          {/* Line numbers */}
          <div className="bg-gray-100 text-gray-500 text-right p-4 pr-2 font-mono text-xs border-r border-gray-200 select-none">
            {lines.map((_: string, i: number) => (
              <div key={i} className="leading-5">{i + 1}</div>
            ))}
          </div>
          
          {/* Code */}
          <pre 
            ref={preRef}
            className="p-4 pl-2 bg-white text-sm overflow-auto whitespace-pre-wrap font-mono flex-1 leading-5 code-scroll-container scroll-smooth"
          >
            {codeContent}
          </pre>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-100 text-gray-600 p-2 text-xs flex justify-between items-center border-t border-gray-200">
        <div className="flex items-center">
          {selectedFile.split('.').pop()?.toUpperCase() || 'TXT'} | Generated successfully
        </div>
      </div>
    </div>
  );
}
