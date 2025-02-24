import React from 'react'
import Editor from '@monaco-editor/react';

const CodeEditor = ({data}:any) => {
  return (
    <div>
      <div className='border-b-[1px] mb-2 py-0.5'> 📄 {data.path}</div>
    <Editor height="77vh" width='100%' defaultLanguage="javascript" value={data.content}/>
    </div>
  )
}

export default CodeEditor