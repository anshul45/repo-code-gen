/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useFileStore } from '@/store/fileStore';
import { ChevronDown, ChevronRight, Download, FolderTree, SquareDashedBottomCode, Lock } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface FileInfo {
  filename: string;
  content: string;
}

const downloadFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const downloadDirectory = (node: any, basePath: string): FileInfo[] => {
  if (node.file) {
    return [{
      filename: basePath,
      content: node.file.contents
    }];
  }

  if (node.directory) {
    return Object.entries(node.directory).flatMap(([key, value]: [string, any]): FileInfo[] => {
      const newPath = basePath ? `${basePath}/${key}` : key;
      return downloadDirectory(value, newPath);
    });
  }

  return Object.entries(node).flatMap(([key, value]: [string, any]): FileInfo[] => {
    const newPath = basePath ? `${basePath}/${key}` : key;
    return downloadDirectory(value, newPath);
  });
};

const FileNode = ({ node, path = "", level = 0, activeFilePath, setActiveFile, fileChanges, isMount, lockedFiles }: { 
  node: any; 
  path: string;
  level: number;
  activeFilePath: string;
  setActiveFile: any;
  fileChanges: { filename: string; content: string; isNew?: boolean } | null;
  isMount: boolean;
  lockedFiles: Set<string>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentPath = path;

  const getFileName = (fullPath: string) => {
    const parts = fullPath.split("/");
    return parts[parts.length - 1]; 
  };

  if (node.directory) {
    return (
      <div className="w-full">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`cursor-pointer flex text-sm w-full pl-${level || 1 * 2} py-1 hover:bg-gray-100 group items-center justify-between pr-2`}
        >
          <div className="flex">
            {isExpanded ? <ChevronDown size={18} className="mt-0.5" /> : <ChevronRight size={18} className="mt-0.5" />} 
            {getFileName(currentPath) || "root"}
          </div>
          <Download 
            size={16} 
            className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-blue-600 mr-2" 
            onClick={(e) => {
              e.stopPropagation();
              const files: FileInfo[] = downloadDirectory(node, currentPath);
              if (files.length === 1) {
                downloadFile(files[0].content, getFileName(files[0].filename));
              } else {
                files.forEach(file => {
                  downloadFile(file.content, getFileName(file.filename));
                });
              }
            }}
          />
        </div>
        {isExpanded &&
          Object.keys(node.directory).map((key) => (
            <FileNode
              key={key}
              node={node.directory[key]}
              path={`${currentPath}/${key}`}
              level={level + 1} 
              activeFilePath={activeFilePath}
              setActiveFile={setActiveFile}
              fileChanges={fileChanges}
              isMount={isMount}
              lockedFiles={lockedFiles}
            />
          ))}
      </div>
    );
  } else if (node.file) {
    const isNew = fileChanges?.filename === currentPath && fileChanges.isNew;
    const isLocked = lockedFiles.has(currentPath);
    return (
      <div className="w-full">
        <div
          className={`text-gray-700 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between px-2 py-1 w-full pl-${level || 1 * 2} group ${
            activeFilePath === currentPath ? "bg-blue-200 text-blue-700 font-semibold" : ""
          } ${isLocked ? "opacity-75" : ""}`}
          onClick={() => setActiveFile({ content: node.file.contents, path: currentPath, isNew })}
        >
          <div className="flex items-center">
            <SquareDashedBottomCode size={15} className="mt-1 mb-[1px] mr-1" />
            {getFileName(currentPath).length >12 ? getFileName(currentPath).slice(0,9)+"...":getFileName(currentPath)}
            {isLocked && <Lock size={12} className="ml-1 text-yellow-600" />}
          </div>
          <Download 
            size={16} 
            className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-blue-600 mr-2" 
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(node.file.contents, getFileName(currentPath));
            }}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full">
        {Object.keys(node).map((key) => (
          <FileNode
            key={key}
            node={node[key]}
            path={currentPath ? `${currentPath}/${key}` : key}
            level={level + 1}
            activeFilePath={activeFilePath}
            setActiveFile={setActiveFile}
            fileChanges={fileChanges}
            isMount={isMount}
            lockedFiles={lockedFiles}
          />
        ))}
      </div>
    );
  }
};

const FileExplorer = ({ setActiveFile }: any) => {
  const { files, fileChanges, isMount, activeFile, lockedFiles } = useFileStore();
  const [activeFilePath, setActiveFilePath] = useState(activeFile?.path || "");

  useEffect(() => {
    if (activeFile?.path) {
      setActiveFilePath(activeFile.path);
    }
  }, [activeFile?.path]);

  useEffect(() => {
    // Only set default file on initial mount if no active file exists
    if (!activeFile && !activeFilePath) {
      const defaultPath = "src/app/page.tsx";
      const defaultContent = files?.["src"]?.["directory"]?.["app"]?.["directory"]?.["page.tsx"]?.["file"]?.["contents"] || "";
      setActiveFile({ content: defaultContent, path: defaultPath, isNew: false });
      setActiveFilePath(defaultPath);
    }
  }, [activeFile, activeFilePath, files, setActiveFile]);

  const handleSetActiveFile = (file: { content: string, path: string, isNew?: boolean }) => {
    setActiveFile(file);
    setActiveFilePath(file.path);
  };

  return (
    <>
      <h1 className="text-sm border-t-[1px] py-1 flex pl-3 "><FolderTree size={13} className="mt-1 mr-1" />Files</h1>
      <ScrollArea className="bg-gray-50 h-[calc(100vh-229px)]  w-full border-r-[1px] overflow-y-auto border-t-[1px]">
        <div className="">
          <FileNode 
            path="" 
            level={0} 
            setActiveFile={handleSetActiveFile} 
            activeFilePath={activeFilePath} 
            node={files}
            fileChanges={fileChanges}
            isMount={isMount}
            lockedFiles={lockedFiles}
          />
        </div>
      </ScrollArea>
    </>
  );
};

export default FileExplorer;
