"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from 'monaco-editor';
import { useFileStore } from "@/store/fileStore";
import { useSidebar } from "@/components/ui/sidebar";

interface CodeEditorProps {
  data: { path: string; content: string; isNew?: boolean } | null;
}

const CodeEditor = ({ data }: CodeEditorProps) => {
  const { updateFile } = useFileStore();
  const { open } = useSidebar();
  const [displayContent, setDisplayContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const isUserEditRef = useRef(false);
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const streamContent = async (content: string) => {
    setIsStreaming(true);
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
      await new Promise(resolve => setTimeout(resolve, 5)); // Slightly longer delay for smoother animation
    }
    
    setIsStreaming(false);
  };

  useEffect(() => {
    if (data?.content) {
      if (data.isNew) {
        streamContent(data.content);
      } else {
        setDisplayContent(data.content);
      }
    }
  }, [data?.content, data?.isNew]);

  // Only set isUserEditRef to false when the file changes
  useEffect(() => {
    isUserEditRef.current = false;
  }, [data?.path]);

  const fileExtension = data?.path?.split(".").pop() || "plaintext";
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
    if (newValue !== undefined && data?.path) {
      isUserEditRef.current = true;
      setDisplayContent(newValue);
      updateFile(data.path, newValue);
    }
  };


  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {open ? "Select a file to start editing" : "Open a file to start editing"}
      </div>
    );
  }

  return (
    <div className="border-t-[1px]">
      {/* File path header */}
      <div className="border-b-[1px] mb-2 pl-2 py-1 text-sm bg-gray-50 dark:bg-gray-800">
        📄 {data.path}
      </div>

      {/* Monaco Editor */}
      <Editor
        height="calc(100vh - 296px)"
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
