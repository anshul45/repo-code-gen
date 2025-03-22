import React, { useEffect, useState } from "react";
import { useFileStore } from '@/store/fileStore';
import { ChevronDown, ChevronRight, FolderTree, SquareDashedBottomCode } from "lucide-react";

const FileNode = ({ node, path = "", level = 0, activeFilePath, setActiveFile }: { 
  node: any; 
  path: string;
  level: number;
  activeFilePath: string;
  setActiveFile: any 
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
            />
          ))}
      </div>
    );
  } else if (node.file) {
    return (
      <div className="w-full">
        <div
          className={`text-gray-700 text-sm cursor-pointer flex items-center px-2 py-1 w-full pl-${level || 1 * 2} ${
            activeFilePath === currentPath ? "bg-blue-200 text-blue-700 font-semibold" : ""
          }`}
          onClick={() => setActiveFile({ content: node.file.contents, path: currentPath })}
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
          />
        ))}
      </div>
    );
  }
};

const FileExplorer = ({ setActiveFile }: any) => {
  const { files } = useFileStore();
  const [activeFilePath, setActiveFilePath] = useState("");

  useEffect(() => {
    const defaultPath = "src/app/page.tsx";
    setActiveFile({ content: files["src"]["directory"]["app"]["directory"]["page.tsx"]["file"]["contents"], path: defaultPath });
    setActiveFilePath(defaultPath);
  }, []);

  const handleSetActiveFile = (file: { content: string, path: string }) => {
    setActiveFile(file);
    setActiveFilePath(file.path);
  };

  return (
    <div className="bg-gray-50 h-[calc(100vh-70px)] rounded-bl-md w-full border-r-[1px] overflow-y-auto border-t-[1px]">
      <h1 className="text-sm border-b-[1px] py-1 flex pl-3 "><FolderTree size={13} className="mt-1 mr-1" />Files</h1>
      <div className="">
        <FileNode path="" level={0} setActiveFile={handleSetActiveFile} activeFilePath={activeFilePath} node={files} />
      </div>
    </div>
  );
};

export default FileExplorer;
