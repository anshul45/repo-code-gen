import { create } from "zustand";
import { files } from "@/common/next_template";

interface FileContent {
  contents: string;
}

interface DirectoryNode {
  [key: string]: FileNode;
}

interface FileNode {
  file?: FileContent;
  directory?: DirectoryNode;
  contents?: string;
}

interface FileState {
  files: DirectoryNode;
  fileChanges: { filename: string; content: string; isNew?: boolean } | null;
  updateFile: (filename: string, content: string) => void;
  addFile: (filename: string, content: string) => void;
  isMount: boolean;
  mountFile: string | null;
  updateMountFile: (file: string) => void;
  activeFile: { path: string; content: string; isNew : boolean  } | null;
  setActiveFile: (file: { path: string; content: string; isNew : boolean } | null) => void;
  lockedFiles: Set<string>;
  lockFile: (filename: string) => void;
  unlockFile: (filename: string) => void;
}


export const useFileStore = create<FileState>((set) => ({
  files: files,
  fileChanges: null,
  isMount: false,
  mountFile: null,
  activeFile: null,
  lockedFiles: new Set<string>(),
  setActiveFile: (file) => set({ activeFile: file }),
  lockFile: (filename) => set((state) => {
    const newLockedFiles = new Set(state.lockedFiles);
    newLockedFiles.add(filename);
    return { lockedFiles: newLockedFiles };
  }),
  unlockFile: (filename) => set((state) => {
    const newLockedFiles = new Set(state.lockedFiles);
    newLockedFiles.delete(filename);
    return { lockedFiles: newLockedFiles };
  }),

  updateMountFile: (file: string) =>
    set((state) => {
      // Parse the file to get the filenames that will be modified
      try {
        const parsedFiles = JSON.parse(file);
        const filenames = Object.keys(parsedFiles);
        const newLockedFiles = new Set(state.lockedFiles);
        filenames.forEach(filename => newLockedFiles.add(filename));
        
        return {
          mountFile: file,
          isMount: true,
          lockedFiles: newLockedFiles
        };
      } catch (error) {
        console.error('Error parsing mount file:', error);
        return {
          mountFile: file,
          isMount: true
        };
      }
    }),
 
  updateFile: (filename: string, content: string) =>
    set((state) => {
      // Prevent modifying locked files
      if (state.lockedFiles.has(filename)) {
        console.warn(`Attempted to modify locked file: ${filename}`);
        return state;
      }
      const updatedFiles = JSON.parse(JSON.stringify(state.files));

      const updateFileContent = (node: DirectoryNode, pathParts: string[]) => {
        if (!pathParts.length) return;

        const currentPart = pathParts[0];

        if (pathParts.length === 1) {
          if (node[currentPart]?.file) {
            node[currentPart].file.contents = content;
          } else if (node[currentPart]) {
            node[currentPart].contents = content;
          }
        } else {
          const dir = node[currentPart]?.directory;
          if (dir) {
            updateFileContent(dir, pathParts.slice(1));
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
        // Prevent modifying locked files
        if (state.lockedFiles.has(filename)) {
          console.warn(`Attempted to modify locked file: ${filename}`);
          return state;
        }

        const updatedFiles = JSON.parse(JSON.stringify(state.files));
        let fileChanged = null;
        let isNewFile = false;
        const addOrUpdateFile = (node: DirectoryNode, pathParts: string[]) => {
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
            const dir = node[currentPart]?.directory;
            if (dir) {
              addOrUpdateFile(dir, pathParts.slice(1));
            }
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
