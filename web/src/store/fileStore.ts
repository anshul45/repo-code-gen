import { create } from "zustand";
import { files } from "@/common/next_template";

interface FileState {
  files: any;
  fileChanges: { filename: string; content: string } | null;
  updateFile: (filename: string, content: string) => void;
  addFile: (filename: string, content: string) => void;
  isMount : boolean
  mountFile:any
  updateMountFile :(file:any) => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: files,
  fileChanges: null,
  isMount:false,
  mountFile:null,

  updateMountFile:(file) =>
 set((state) => {
  return { mountFile: file };
 }),
 
  updateFile: (filename, content) =>
    set((state) => {
      const updatedFiles = JSON.parse(JSON.stringify(state.files));

      const updateFileContent = (node: any, pathParts: string[]) => {
        if (!pathParts.length) return;

        const currentPart = pathParts[0];

        if (pathParts.length === 1) {
          if (node[currentPart]?.file) {
            node[currentPart].file.contents = content;
          } else if (node[currentPart]) {
            node[currentPart].contents = content;
          }
        } else {
          if (node[currentPart]?.directory) {
            updateFileContent(node[currentPart].directory, pathParts.slice(1));
          }
        }
      };

      const pathParts = filename.split("/");

      if (pathParts.length === 1) {
        if (updatedFiles[pathParts[0]]?.file) {
          updatedFiles[pathParts[0]].file.contents = content;
        } else {
          updatedFiles[pathParts[0]].contents = content;
        }
      } else {
        updateFileContent(updatedFiles, pathParts);
      }

      return { files: { ...updatedFiles }, fileChanges: { filename, content } };
    }),

    addFile: (filename, content) =>
      set((state) => {
        const updatedFiles = JSON.parse(JSON.stringify(state.files));
        let fileChanged = null;
        let isNewFile = false;
        const addOrUpdateFile = (node: any, pathParts: string[]) => {
          if (!pathParts.length) return;
    
          const currentPart = pathParts[0];
    
          if (pathParts.length === 1) {
            // If the file exists update its content
            if (node[currentPart]?.file) {
              node[currentPart].file.contents = content;
              fileChanged = { filename, content };
            } else {
              // create a new file entry
              node[currentPart] = { file: { contents: content } };
              isNewFile = true;
            }
          } else {
            // Ensure the current part is a directory before proceeding
            if (!node[currentPart] || node[currentPart]?.file) {
              node[currentPart] = { directory: {} };
            }
            addOrUpdateFile(node[currentPart].directory, pathParts.slice(1));
          }
        };
    
        const pathParts = filename.split("/");
    
        if (pathParts.length === 1) {
          // Handle files at the root level
          if (updatedFiles[pathParts[0]]?.file) {
            updatedFiles[pathParts[0]].file.contents = content;
          } else {
            updatedFiles[pathParts[0]] = { file: { contents: content } };
          }
        } else {
          addOrUpdateFile(updatedFiles, pathParts);
        }
    
        return { files: { ...updatedFiles },fileChanges: fileChanged, isMount: isNewFile  };
      }),
    
}));