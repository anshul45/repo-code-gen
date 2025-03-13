import React from 'react'
import Editor from '@monaco-editor/react';

const CodeEditor = ({data}:any) => {
  return (
    <div>
      <div className='border-b-[1px] mb-2 py-0.5'> 📄 {data?.path}</div>
    <Editor height="76.2vh" width="100%" defaultLanguage="javascript" value={data?.content} options={{ minimap: { enabled: false } }} />
    </div>
  )
}

export default CodeEditor