import React from 'react';
import Editor from '@monaco-editor/react';
import { useFileStore } from '@/store/fileStore';

const CodeEditor = ({ data }: any) => {
  const { updateFile,files } = useFileStore();

  const language: string[] = data?.path?.split(".");

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      updateFile(data?.path, newValue);
    }
  };

  return (
    <div>
      <div className='border-b-[1px] mb-2 py-0.5'> 📄 {data?.path}</div>
      <Editor
        height="76.2vh"
        width="100%"
        defaultLanguage={language && language[language?.length - 1]}
        value={data?.content}
        onChange={handleEditorChange} 
        options={{ minimap: { enabled: false } }}
      />
    </div>
  );
};

export default CodeEditor;
