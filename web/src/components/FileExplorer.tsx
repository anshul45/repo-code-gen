/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useFileStore } from '@/store/fileStore';
import { ChevronDown, ChevronRight, FolderTree, SquareDashedBottomCode } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const FileNode = ({ node, path = "", level = 0, activeFilePath, setActiveFile, fileChanges }: { 
  node: any; 
  path: string;
  level: number;
  activeFilePath: string;
  setActiveFile: any;
  fileChanges: { filename: string; content: string; isNew?: boolean } | null;
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
          className={`cursor-pointer flex text-sm w-full pl-${level || 1 * 2} py-1`}
        >
          {isExpanded ? <ChevronDown size={18} className="mt-0.5" /> : <ChevronRight size={18} className="mt-0.5" />} 
          {getFileName(currentPath) || "root"}
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
            />
          ))}
      </div>
    );
  } else if (node.file) {
    const isNew = fileChanges?.filename === currentPath && fileChanges.isNew;
    return (
      <div className="w-full">
        <div
          className={`text-gray-700 text-sm cursor-pointer flex items-center px-2 py-1 w-full pl-${level || 1 * 2} ${
            activeFilePath === currentPath ? "bg-blue-200 text-blue-700 font-semibold" : ""
          }`}
          onClick={() => setActiveFile({ content: node.file.contents, path: currentPath, isNew })}
        >
          <SquareDashedBottomCode size={15} className="mt-1 mb-[1px] mr-1" />{getFileName(currentPath).length >12 ? getFileName(currentPath).slice(0,9)+"...":getFileName(currentPath)}
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
          />
        ))}
      </div>
    );
  }
};

const FileExplorer = ({ setActiveFile }: any) => {
  const { files, fileChanges } = useFileStore();
  const [activeFilePath, setActiveFilePath] = useState("");

  useEffect(() => {
    const defaultPath = "src/app/page.tsx";
    const defaultContent = files?.["src"]?.["directory"]?.["app"]?.["directory"]?.["page.tsx"]?.["file"]?.["contents"] || "";
    setActiveFile({ content: defaultContent, path: defaultPath, isNew: false });
    setActiveFilePath(defaultPath);
  }, []);

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
          />
        </div>
      </ScrollArea>
    </>
  );
};

export default FileExplorer;
