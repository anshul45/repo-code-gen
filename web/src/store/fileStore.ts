import { create } from "zustand";
import { files } from "@/common/next_template";

interface FileState {
  files: any;
  fileChanges: { filename: string; content: string } | null;
  updateFile: (filename: string, content: string) => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: files,
  fileChanges: null,

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

      return { files: {...updatedFiles},fileChanges: { filename, content } };
    }),
}));
