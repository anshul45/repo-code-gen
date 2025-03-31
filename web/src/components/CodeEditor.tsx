"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from 'monaco-editor';
import { useFileStore } from "@/store/fileStore";
import { useSidebar } from "@/components/ui/sidebar";



const CodeEditor = () => {

   const { setActiveFile,activeFile } = useFileStore();

  const { updateFile } = useFileStore();
  const { open } = useSidebar();
  const [displayContent, setDisplayContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingFile, setStreamingFile] = useState<string | null>(null);
  const isUserEditRef = useRef(false);
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);


  //Todo need to keep it stream untill it stream all activeFile
  const streamContent = async ( content: string, path: string ) => {
    setIsStreaming(true);
    setStreamingFile(activeFile && activeFile.path || "");
    let currentContent = "";
    const chunkSize = 25; // Process smaller chunks for smoother scrolling
    
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      currentContent += chunk;
      setDisplayContent(currentContent);
      
      // Scroll to bottom after each chunk
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          const lineCount = model.getLineCount();
          // Scroll to the last line with smooth scrolling
          editorRef.current.revealLineInCenter(lineCount);
          // Force a layout update to ensure proper scrolling
          editorRef.current.layout();
        }
      }
      
      // Small delay between chunks for visible effect
      await new Promise(resolve => setTimeout(resolve, 5));
    }

    if (streamingFile === path) {
      setIsStreaming(false);
      setStreamingFile(null);
      setActiveFile({ content,path, isNew: false });
      updateFile(path, content);
    }
    
    setIsStreaming(false);
  };

  useEffect(() => {
    if (activeFile?.content) {
      if (activeFile.isNew && !isUserEditRef.current) {
        streamContent(activeFile.content, activeFile.path).then(() => {
          setActiveFile({ content: activeFile.content, path: activeFile.path, isNew: false });
        });
      } else {
        setDisplayContent(activeFile.content);
        if (activeFile.isNew) {
          setActiveFile({ content: activeFile.content, path: activeFile.path, isNew: false });
        }
      }
    }
  }, [activeFile?.content, activeFile?.isNew, activeFile?.path]);
  

  // Only set isUserEditRef to false when the file changes
  useEffect(() => {
    isUserEditRef.current = false;
  }, [activeFile?.path]);

  const fileExtension = activeFile?.path?.split(".").pop() || "plaintext";
  const supportedLanguages = [
    "javascript",
    "typescript",
    "html",
    "css",
    "json",
    "python",
    "java",
    "tsx", 
  ];
  const language = supportedLanguages.includes(fileExtension) ? fileExtension : "plaintext";

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined && activeFile?.path) {
      isUserEditRef.current = true;
      setDisplayContent(newValue);
      setActiveFile({path :activeFile.path, content:newValue,isNew:false});
      updateFile(activeFile.path, newValue);
    }
  };


  if (!activeFile) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {open ? "Select a file to start editing" : "Open a file to start editing"}
      </div>
    );
  }

  return (
    <div className="border-t-[1px]">
      <div className="border-b-[1px] mb-2 pl-2 py-1 text-sm bg-gray-50 dark:bg-gray-800">
        📄 {activeFile.path}
      </div>

      {/* Code Editor */}
      <Editor
        height="calc(100vh - 230px)"
        width="100%"
        language={language}
        value={displayContent}
        onMount={(editor: editor.IStandaloneCodeEditor) => {
          editorRef.current = editor;
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          wordWrap: "on",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
          readOnly: isStreaming
        }}
        onChange={handleEditorChange}
        theme="vs-light"
        loading={<div className="text-gray-500">Loading editor...</div>}
      />
    </div>
  );
};

export default CodeEditor;
