"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { useFileStore } from "@/store/fileStore";
import { useSidebar } from "@/components/ui/sidebar";

interface CodeEditorProps {
  data: { path: string; content: string } | null;
}

const CodeEditor = ({ data }: CodeEditorProps) => {
  const { updateFile } = useFileStore();
  const { open } = useSidebar();

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
        height="calc(100vh - 266px)"
        width="100%"
        language={language}
        value={data.content}
        onChange={handleEditorChange}
        theme="vs-light"
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
        }}
        loading={<div className="text-gray-500">Loading editor...</div>} 
      />
    </div>
  );
};

export default CodeEditor;