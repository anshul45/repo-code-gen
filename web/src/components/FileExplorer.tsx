import React, { useState } from "react";
import {files} from "@/common/next_template"

const FileNode = ({ node, path = "", setActiveFile }: { node: any; path: string; setActiveFile: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentPath = path;

  if (node.directory) {
    return (
      <div>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer font-bold text-blue-600"
        >
          {isExpanded ? "📂" : "📁"} {path}
        </div>
        {isExpanded &&
          Object.keys(node.directory).map((key) => (
            <FileNode
              key={key}
              node={node.directory[key]}
              path={`${key}`}
              setActiveFile={setActiveFile} 
            />
          ))}
      </div>
    );
  } else if (node.file) {
    return (
      <div className="">
        <div
          className="text-gray-700 cursor-pointer"
          onClick={() => setActiveFile({content :node.file.contents, path})} 
        >
          📄 {path}
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
            path={path ? `${path}/${key}` : key}
            setActiveFile={setActiveFile} 
          />
        ))}
      </div>
    );
  }
};

const FileExplorer = ({ setActiveFile }: any) => {
  return (
    <div className="bg-gray-50 rounded-md shadow-lg h-[85.1vh] w-64 border-r-[1px]">
      <h1 className="text-base border-b-[1px] pl-1 font-semibold py-0.5">Files</h1>
      <div className="pl-2">
      <FileNode path="" setActiveFile={setActiveFile} node={files} />
      </div>
    </div>
  );
};

export default FileExplorer;
