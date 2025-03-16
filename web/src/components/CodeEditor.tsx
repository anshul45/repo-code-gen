import React from 'react';
import Editor from '@monaco-editor/react';
import { useFileStore } from '@/store/fileStore';

const CodeEditor = ({ data }: any) => {
  const { updateFile, files } = useFileStore();

  const language: string[] = data?.path?.split(".");

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      updateFile(data?.path, newValue);
    }
  };

  return (
    <div className='h-[calc(100vh-106px)]  border-t-[1px]'>
      <div className='border-b-[1px] mb-2 py-1 pl-2 text-sm'> 📄 {data?.path}</div>
      <Editor
        height="88.5%"
        width="100%"
        defaultLanguage={language && language[language?.length - 1]}
        value={data?.content}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;
