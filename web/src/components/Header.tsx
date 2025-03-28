"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { Download } from 'lucide-react'
import { useFileStore } from '@/store/fileStore'
import JSZip from 'jszip'

interface FileContents {
  contents: string;
}

interface DirectoryContents {
  [key: string]: FileNode;
}

interface FileNode {
  file?: FileContents;
  directory?: DirectoryContents;
}

interface FileInfo {
  filename: string;
  content: string;
}

const downloadZip = async (files: FileInfo[]) => {
  const zip = new JSZip();
  
  files.forEach(file => {
    zip.file(file.filename, file.content);
  });
  
  const blob = await zip.generateAsync({ type: "blob" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "project.zip";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const downloadDirectory = (node: FileNode, basePath: string): FileInfo[] => {
  if (node.file) {
    return [{
      filename: basePath,
      content: node.file.contents
    }];
  }

  if (node.directory) {
    return Object.entries(node.directory).flatMap(([key, value]: [string, FileNode]): FileInfo[] => {
      const newPath = basePath ? `${basePath}/${key}` : key;
      return downloadDirectory(value, newPath);
    });
  }

  return Object.entries(node).flatMap(([key, value]: [string, FileNode]): FileInfo[] => {
    const newPath = basePath ? `${basePath}/${key}` : key;
    return downloadDirectory(value, newPath);
  });
};

const Header = () => {
    const pathname = usePathname()
  return (
    <div className="flex items-center h-full pr-3">
        {pathname  == "/" ?""
        :
        <div className='text-sm ml-4'>Project Description</div>
        }
        <button 
          type="button"
          className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors ml-auto"
          onClick={async () => {
            const { files } = useFileStore.getState();
            const allFiles = downloadDirectory(files, "");
            await downloadZip(allFiles);
          }}
        >
          <Download size={18} />
          <span className="text-sm">Download Project</span>
        </button>
    </div>
  )
}

export default Header
