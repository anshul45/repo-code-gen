import React, { useEffect, useState } from "react";
import { useFileStore } from '@/store/fileStore';

const FileNode = ({ node, path = "", setActiveFile }: { node: any; path: string; setActiveFile: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);


  const currentPath = path;

  const getFileName = (fullPath: string) => {
    const parts = fullPath.split("/");
    return parts[parts.length - 1]; 
  };

  if (node.directory) {
    return (
      <div>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer font-bold text-blue-600"
        >
          {isExpanded ? "📂" : "📁"} {getFileName(currentPath) || "root"}
        </div>
        {isExpanded &&
          Object.keys(node.directory).map((key) => (
            <FileNode
              key={key}
              node={node.directory[key]}
              path={`${currentPath}/${key}`}
              setActiveFile={setActiveFile}
            />
          ))}
      </div>
    );
  } else if (node.file) {
    return (
      <div className="">
        <div
          className="text-gray-700 text-sm cursor-pointer"
          onClick={() => setActiveFile({ content: node.file.contents, path: currentPath })}
        >
          📄 {getFileName(currentPath)}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {Object.keys(node).map((key) => (
          <FileNode
            key={key}
            node={node[key]}
            path={currentPath ? `${currentPath}/${key}` : key}
            setActiveFile={setActiveFile}
          />
        ))}
      </div>
    );
  }
};

const FileExplorer = ({ setActiveFile }: any) => {
  const {files} = useFileStore();

  useEffect(() => {
   setActiveFile({ content: files["src"]["directory"]["app"]["directory"]["page.tsx"]["file"]["contents"], path: "app/page.tsx" })
  },[])

  return (
    <div className="bg-gray-50 h-[calc(100vh-70px)] rounded-bl-md w-full border-r-[1px] overflow-y-auto border-t-[1px]">
      <h1 className="text-base border-b-[1px] pl-1 font-semibold py-0.5">Files</h1>
      <div className="pl-2">
        <FileNode path="" setActiveFile={setActiveFile} node={files} />
      </div>
    </div>
  );
};

export default FileExplorer;
