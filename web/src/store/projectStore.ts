import { create } from "zustand";
import { Project, getProjectById } from "@/services/project-api";
import { useChatStore } from "@/store/chat";

// File content structure
interface FileContent {
  contents: string;
}

// Directory node structure
interface DirectoryNode {
  [key: string]: FileNode;
}

// File node structure
interface FileNode {
  file?: FileContent;
  directory?: DirectoryNode;
  contents?: string;
}

// File change structure
export interface FileChange {
  filename: string;
  content: string;
  isNew?: boolean;
  isSaved?: boolean;
}

// Project state interface
interface ProjectState {
  // Project state
  currentProject: Project | null;
  isLoading: boolean;
  error: Error | null;

  // File state
  files: DirectoryNode;
  currentFile: string | null;
  fileChanges: FileChange | null;
  isMount: boolean;
  mountFile: string | null;
  lockedFiles: Set<string>;
  activeFile: { path: string; content: string; isNew: boolean } | null;

  // Project ID and Name
  projectId: string | null;
  projectName: string | null;

  // Actions - Project
  loadProject: (projectId: string) => Promise<void>;
  resetProject: () => void;
  setProject: (projectId: string, projectName: string) => void;

  // Actions - Files
  updateFile: (filename: string, content: string, isSaved?: boolean) => void;
  addFile: (filename: string, content: string) => void;
  deleteFile: (path: string) => void;
  resetFiles: () => void;

  // Compatibility methods
  setActiveFile: (
    file: { path: string; content: string; isNew: boolean } | null
  ) => void;
  updateMountFile: (file: string) => void;
  lockFile: (filename: string) => void;
  unlockFile: (filename: string) => void;
}

// Helper function to create a FileChange object
const createFileChange = (
  filename: string,
  content: string,
  options?: { isNew?: boolean; isSaved?: boolean }
): FileChange => ({
  filename,
  content,
  ...options,
});

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial project state
  currentProject: null,
  isLoading: false,
  error: null,

  // Initial file state
  files: {},
  currentFile: null,
  fileChanges: null,
  isMount: false,
  mountFile: null,
  lockedFiles: new Set<string>(),
  activeFile: null,

  // Project ID and Name
  projectId: null,
  projectName: null,

  // Project actions
  loadProject: async (projectId: string) => {
    // Set loading state
    set({ isLoading: true, error: null });

    try {
      // Reset chat store
      const chatStore = useChatStore.getState();
      chatStore.setProject(projectId, ""); // Temporarily set project ID with empty name
      chatStore.resetMessages(); // Reset chat messages

      // Fetch project data
      const project = await getProjectById(projectId);

      // Update project state
      set({
        currentProject: project,
        projectId: project.id,
        projectName: project.name,
      });

      // Update chat store with project name
      chatStore.setProject(project.id, project.name);

      // Reset files before loading new ones
      get().resetFiles();

      // Load project data into file store
      if (project.codebase) {
        // Convert codebase directly to our file structure
        set({ files: project.codebase });
      }
    } catch (err) {
      // Handle error
      set({ error: err as Error });
      console.error("Failed to load project:", err);
    } finally {
      // Reset loading state
      set({ isLoading: false });
    }
  },

  resetProject: () => {
    // Reset all state
    set({
      currentProject: null,
      isLoading: false,
      error: null,
      projectId: null,
      projectName: null,
    });

    // Reset files
    get().resetFiles();

    // Reset chat store
    const chatStore = useChatStore.getState();
    chatStore.setProject("", "");
    chatStore.resetMessages();
  },

  setProject: (projectId: string, projectName: string) =>
    set({ projectId, projectName }),

  // File actions
  addFile: (filename: string, content: string) => {
    set((state) => {
      // Check for locked files
      if (state.lockedFiles.has(filename)) {
        console.warn(
          `[DEBUG] projectStore: Attempted to modify locked file: ${filename}`
        );
        return state;
      }

      console.log(`[DEBUG] projectStore: Adding file ${filename}`);

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
        fileChanges: createFileChange(filename, content, {
          isNew: isNewFile,
          isSaved: false,
        }),
        isMount: isNewFile,
      };
    });
  },

  updateFile: (filename: string, content: string, isSaved: boolean = false) => {
    set((state) => {
      // Check for locked files
      if (state.lockedFiles.has(filename)) {
        console.warn(
          `[DEBUG] projectStore: Attempted to modify locked file: ${filename}`
        );
        return state;
      }

      console.log(
        `[DEBUG] projectStore: Updating file ${filename}, isSaved: ${isSaved}`
      );

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
    });
  },

  deleteFile: (path: string) => {
    set((state) => {
      // Check for locked files
      if (state.lockedFiles.has(path)) {
        console.warn(`Attempted to delete locked file: ${path}`);
        return state;
      }

      const updatedFiles = JSON.parse(JSON.stringify(state.files));
      const deleteFilePath = (node: DirectoryNode, pathParts: string[]): boolean => {
        if (!pathParts.length) return false;

        const currentPart = pathParts[0];
        if (pathParts.length === 1) {
          if (node[currentPart]) {
            delete node[currentPart];
            return true;
          }
          return false;
        } else {
          const dir = node[currentPart]?.directory;
          if (dir) {
            const deleted = deleteFilePath(dir, pathParts.slice(1));
            // If the directory is now empty, remove it
            if (deleted && Object.keys(dir).length === 0) {
              delete node[currentPart];
            }
            return deleted;
          }
          return false;
        }
      };

      const pathParts = path.split("/");
      deleteFilePath(updatedFiles, pathParts);

      return {
        files: { ...updatedFiles },
        currentFile: state.currentFile === path ? null : state.currentFile,
      };
    });
  },

  resetFiles: () => {
    set({
      files: {},
      currentFile: null,
      fileChanges: null,
      isMount: false,
      mountFile: null,
      activeFile: null,
      lockedFiles: new Set<string>(),
    });
  },

  // Compatibility methods
  setActiveFile: (file) => set({ activeFile: file }),

  updateMountFile: (file: string) => {
    set((state) => {
      console.log("[DEBUG] projectStore: updateMountFile called");
      try {
        const parsedFiles = JSON.parse(file);
        console.log(
          `[DEBUG] projectStore: Parsed mount file with ${
            Object.keys(parsedFiles).length
          } files`
        );

        // Validate file structure
        let hasValidStructure = true;
        for (const [key, value] of Object.entries(parsedFiles)) {
          if (typeof value !== "string" && typeof value !== "object") {
            console.error(
              `[DEBUG] projectStore: Invalid file structure for ${key}, type: ${typeof value}`
            );
            hasValidStructure = false;
            break;
          }
        }

        if (!hasValidStructure) {
          console.error(
            "[DEBUG] projectStore: Invalid file structure detected, not mounting"
          );
          return {
            mountFile: file,
            isMount: false,
          };
        }

        // Lock files that will be modified
        const filenames = Object.keys(parsedFiles);
        const newLockedFiles = new Set(state.lockedFiles);
        filenames.forEach((filename) => newLockedFiles.add(filename));

        return {
          mountFile: file,
          isMount: true,
          lockedFiles: newLockedFiles,
        };
      } catch (error) {
        console.error("[DEBUG] projectStore: Error parsing mount file:", error);
        return {
          mountFile: file,
          isMount: false, // Don't attempt to mount if we can't parse the file
        };
      }
    });
  },

  lockFile: (filename) =>
    set((state) => {
      console.log(`[DEBUG] projectStore: Locking file ${filename}`);
      const newLockedFiles = new Set(state.lockedFiles);
      newLockedFiles.add(filename);
      return { lockedFiles: newLockedFiles };
    }),

  unlockFile: (filename) =>
    set((state) => {
      console.log(`[DEBUG] projectStore: Unlocking file ${filename}`);
      const newLockedFiles = new Set(state.lockedFiles);
      newLockedFiles.delete(filename);
      return { lockedFiles: newLockedFiles };
    }),
}));
