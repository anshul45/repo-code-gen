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

interface FileChange {
  filename: string;
  content: string;
  isNew?: boolean;
  isSaved?: boolean;
}

const createFileChange = (
  filename: string,
  content: string,
  options?: { isNew?: boolean; isSaved?: boolean }
): FileChange => ({
  filename,
  content,
  ...options
});

interface FileState {
  files: DirectoryNode;
  fileChanges: FileChange | null;
  projectId: string | null;
  projectName: string | null;
  setProject: (projectId: string, projectName: string) => void;
  updateFile: (filename: string, content: string, isSaved?: boolean) => void;
  addFile: (filename: string, content: string) => void;
  isMount: boolean;
  mountFile: string | null;
  updateMountFile: (file: string) => void;
  activeFile: { path: string; content: string; isNew: boolean } | null;
  setActiveFile: (file: { path: string; content: string; isNew: boolean } | null) => void;
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
  projectId: null,
  projectName: null,
  lockedFiles: new Set<string>(),
  
  setProject: (projectId: string, projectName: string) => set({ projectId, projectName }),
  
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
      try {
        const parsedFiles = JSON.parse(file);
        const filenames = Object.keys(parsedFiles);
        const newLockedFiles = new Set(state.lockedFiles);
        filenames.forEach((filename) => newLockedFiles.add(filename));

        return {
          mountFile: file,
          isMount: true,
          lockedFiles: newLockedFiles,
        };
      } catch (error) {
        console.error("Error parsing mount file:", error);
        return {
          mountFile: file,
          isMount: true,
        };
      }
    }),

  updateFile: (filename: string, content: string, isSaved: boolean = false) =>
    set((state) => {
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

      return {
        files: { ...updatedFiles },
        fileChanges: createFileChange(filename, content, { isSaved }),
      };
    }),

  addFile: (filename: string, content: string) =>
    set((state) => {
      if (state.lockedFiles.has(filename)) {
        console.warn(`Attempted to modify locked file: ${filename}`);
        return state;
      }

      const updatedFiles = JSON.parse(JSON.stringify(state.files));
      let isNewFile = false;

      const addOrUpdateFile = (node: DirectoryNode, pathParts: string[]) => {
        if (!pathParts.length) return;

        const currentPart = pathParts[0];
        if (pathParts.length === 1) {
          if (node[currentPart]?.file) {
            node[currentPart].file.contents = content;
          } else {
            node[currentPart] = { file: { contents: content } };
            isNewFile = true;
          }
        } else {
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
        if (updatedFiles[pathParts[0]]?.file) {
          updatedFiles[pathParts[0]].file.contents = content;
        } else {
          updatedFiles[pathParts[0]] = { file: { contents: content } };
          isNewFile = true;
        }
      } else {
        addOrUpdateFile(updatedFiles, pathParts);
      }

      return {
        files: { ...updatedFiles },
        fileChanges: createFileChange(filename, content, { isNew: isNewFile, isSaved: false }),
        isMount: isNewFile,
      };
    }),
}))
