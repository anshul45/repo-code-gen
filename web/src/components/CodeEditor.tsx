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

  // Determine the file extension for language syntax highlighting
  const fileExtension = data?.path?.split(".").pop() || "plaintext";
  const supportedLanguages = [
    "javascript",
    "typescript",
    "html",
    "css",
    "json",
    "python",
    "java",
    "tsx", // Add support for TSX files
  ];
  const language = supportedLanguages.includes(fileExtension) ? fileExtension : "plaintext";

  // Handle editor content changes
  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined && data?.path) {
      updateFile(data.path, newValue);
    }
  };

  // If no file is selected, show a placeholder
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
      <div className="border-b-[1px] mb-2 pl-2 text-sm bg-gray-50 dark:bg-gray-800">
        📄 {data.path}
      </div>

      {/* Monaco Editor */}
      <Editor
        height="700px"
        width="100%"
        language={language}
        value={data.content}
        onChange={handleEditorChange}
        theme="vs-light" // Add theme support
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          wordWrap: "on", // Enable word wrap
          autoClosingBrackets: "always", // Auto-close brackets
          autoClosingQuotes: "always", // Auto-close quotes
          formatOnPaste: true, // Format on paste
          formatOnType: true, // Format on type
        }}
        loading={<div className="text-gray-500">Loading editor...</div>} // Loading state
      />
    </div>
  );
};

export default CodeEditor;