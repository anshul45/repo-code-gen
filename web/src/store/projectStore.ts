import { create } from 'zustand';
import { Project, getProjectById } from '@/services/project-api';
import { resetWebContainer, loadProjectIntoWebContainer } from '@/services/webContainer';
import { useChatStore } from '@/store/chat';

// File entry structure
export interface FileEntry {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

// File change structure (for compatibility with existing fileStore)
export interface FileChange {
  filename: string;
  content: string;
  isNew?: boolean;
  isSaved?: boolean;
}

// Directory structure (for compatibility with existing fileStore)
export interface DirectoryNode {
  [key: string]: FileNode;
}

export interface FileNode {
  file?: { contents: string };
  directory?: DirectoryNode;
  contents?: string;
}

// Combined project and file store state
interface ProjectState {
  // Project state
  currentProject: Project | null;
  isLoading: boolean;
  error: Error | null;
  
  // File state
  files: Map<string, FileEntry>;
  currentFile: string | null;
  fileChanges: FileChange | null;
  isMount: boolean;
  mountFile: string | null;
  lockedFiles: Set<string>;
  activeFile: { path: string; content: string; isNew: boolean } | null;
  
  // Legacy file structure (for compatibility)
  legacyFiles: DirectoryNode;
  
  // Project ID and Name (compatibility with fileStore)
  projectId: string | null;
  projectName: string | null;
  
  // Actions - Project
  loadProject: (projectId: string) => Promise<void>;
  resetProject: () => void;
  setProject: (projectId: string, projectName: string) => void;
  
  // Actions - Files
  getFile: (path: string) => FileEntry | undefined;
  getAllFiles: () => Map<string, FileEntry>;
  setCurrentFile: (path: string) => void;
  addFile: (filename: string, content: string) => void;
  updateFile: (filename: string, content: string, isSaved?: boolean) => void;
  deleteFile: (path: string) => void;
  resetFiles: () => void;
  
  // Compatibility methods
  setActiveFile: (file: { path: string; content: string; isNew: boolean } | null) => void;
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
  ...options
});

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial project state
  currentProject: null,
  isLoading: false,
  error: null,
  
  // Initial file state
  files: new Map<string, FileEntry>(),
  currentFile: null,
  fileChanges: null,
  isMount: false,
  mountFile: null,
  lockedFiles: new Set<string>(),
  activeFile: null,
  
  // Legacy file structure - initialize as empty object instead of templateFiles
  legacyFiles: {},
  
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
      chatStore.setProject(projectId, ''); // Temporarily set project ID with empty name
      chatStore.resetMessages(); // Reset chat messages
      
      // Fetch project data
      const project = await getProjectById(projectId);
      
      // Update project state
      set({ 
        currentProject: project,
        projectId: project.id,
        projectName: project.name
      });
      
      // Update chat store with project name
      chatStore.setProject(project.id, project.name);
      
      // Reset files before loading new ones
      get().resetFiles();
      
      // Load project data into file store and WebContainer
      if (project.codebase) {
        // Load files into our file store
        loadCodebaseIntoFileStore(project.codebase, get().addFile);
        
        // Load into WebContainer
        await loadProjectIntoWebContainer(project.codebase);
      }
      
    } catch (err) {
      // Handle error
      set({ error: err as Error });
      console.error('Failed to load project:', err);
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
      projectName: null
    });
    
    // Reset files
    get().resetFiles();
    
    // Reset WebContainer
    resetWebContainer();
    
    // Reset chat store
    const chatStore = useChatStore.getState();
    chatStore.setProject('', '');
    chatStore.resetMessages();
  },
  
  setProject: (projectId: string, projectName: string) => 
    set({ projectId, projectName }),
  
  // File actions
  getFile: (path: string) => {
    return get().files.get(path);
  },
  
  getAllFiles: () => {
    return get().files;
  },
  
  setCurrentFile: (path: string) => {
    set({ currentFile: path });
  },
  
  addFile: (filename: string, content: string) => {
    set((state) => {
      // Check for locked files
      if (state.lockedFiles.has(filename)) {
        console.warn(`[DEBUG] projectStore: Attempted to modify locked file: ${filename}`);
        return state;
      }
      
      console.log(`[DEBUG] projectStore: Adding file ${filename}`);
      // Update modern Map-based files
      const newFiles = new Map(state.files);
      const isNewFile = !newFiles.has(filename);
      newFiles.set(filename, { path: filename, content, type: 'file' });
      
      // Also update legacy files object for compatibility
      const updatedLegacyFiles = JSON.parse(JSON.stringify(state.legacyFiles));
      
      // Helper function to add file to legacy structure
      const addOrUpdateLegacyFile = (node: DirectoryNode, pathParts: string[]) => {
        if (!pathParts.length) return;

        const currentPart = pathParts[0];
        if (pathParts.length === 1) {
          if (node[currentPart]?.file) {
            node[currentPart].file.contents = content;
          } else {
            node[currentPart] = { file: { contents: content } };
          }
        } else {
          if (!node[currentPart] || node[currentPart]?.file) {
            node[currentPart] = { directory: {} };
          }
          const dir = node[currentPart]?.directory;
          if (dir) {
            addOrUpdateLegacyFile(dir, pathParts.slice(1));
          }
        }
      };

      const pathParts = filename.split("/");
      if (pathParts.length === 1) {
        if (updatedLegacyFiles[pathParts[0]]?.file) {
          updatedLegacyFiles[pathParts[0]].file.contents = content;
        } else {
          updatedLegacyFiles[pathParts[0]] = { file: { contents: content } };
        }
      } else {
        addOrUpdateLegacyFile(updatedLegacyFiles, pathParts);
      }
      
      return {
        files: newFiles,
        legacyFiles: updatedLegacyFiles,
        fileChanges: createFileChange(filename, content, { isNew: isNewFile, isSaved: false }),
        isMount: isNewFile
      };
    });
  },
  
  updateFile: (filename: string, content: string, isSaved: boolean = false) => {
    set((state) => {
      // Check for locked files
      if (state.lockedFiles.has(filename)) {
        console.warn(`[DEBUG] projectStore: Attempted to modify locked file: ${filename}`);
        return state;
      }
      
      console.log(`[DEBUG] projectStore: Updating file ${filename}, isSaved: ${isSaved}`);
      // Update modern Map-based files
      const newFiles = new Map(state.files);
      const existingFile = newFiles.get(filename);
      newFiles.set(filename, { 
        path: filename, 
        content, 
        type: existingFile?.type || 'file' 
      });
      
      // Update legacy files structure
      const updatedLegacyFiles = JSON.parse(JSON.stringify(state.legacyFiles));
      
      // Helper function to update legacy file structure
      const updateLegacyFileContent = (node: DirectoryNode, pathParts: string[]) => {
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
            updateLegacyFileContent(dir, pathParts.slice(1));
          }
        }
      };

      const pathParts = filename.split("/");
      if (pathParts.length === 1) {
        if (updatedLegacyFiles[pathParts[0]]?.file) {
          updatedLegacyFiles[pathParts[0]].file.contents = content;
        } else {
          updatedLegacyFiles[pathParts[0]].contents = content;
        }
      } else {
        updateLegacyFileContent(updatedLegacyFiles, pathParts);
      }
      
      return {
        files: newFiles,
        legacyFiles: updatedLegacyFiles,
        fileChanges: createFileChange(filename, content, { isSaved })
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
      
      // Update modern files Map
      const newFiles = new Map(state.files);
      newFiles.delete(path);
      
      // TODO: Update legacy files structure (more complex, omitted for brevity)
      
      return { 
        files: newFiles,
        currentFile: state.currentFile === path ? null : state.currentFile
      };
    });
  },
  
  resetFiles: () => {
    set({
      files: new Map<string, FileEntry>(),
      currentFile: null,
      legacyFiles: {}, // Initialize as empty object instead of templateFiles
      fileChanges: null,
      isMount: false,
      mountFile: null,
      activeFile: null,
      lockedFiles: new Set<string>()
    });
  },
  
  // Compatibility methods
  setActiveFile: (file) => set({ activeFile: file }),
  
  updateMountFile: (file: string) => {
    set((state) => {
      console.log('[DEBUG] projectStore: updateMountFile called');
      try {
        const parsedFiles = JSON.parse(file);
        console.log(`[DEBUG] projectStore: Parsed mount file with ${Object.keys(parsedFiles).length} files`);
        
        // Validate file structure
        let hasValidStructure = true;
        for (const [key, value] of Object.entries(parsedFiles)) {
          if (typeof value !== 'string' && typeof value !== 'object') {
            console.error(`[DEBUG] projectStore: Invalid file structure for ${key}, type: ${typeof value}`);
            hasValidStructure = false;
            break;
          }
        }
        
        if (!hasValidStructure) {
          console.error('[DEBUG] projectStore: Invalid file structure detected, not mounting');
          return {
            mountFile: file,
            isMount: false
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
  
  lockFile: (filename) => set((state) => {
    console.log(`[DEBUG] projectStore: Locking file ${filename}`);
    const newLockedFiles = new Set(state.lockedFiles);
    newLockedFiles.add(filename);
    return { lockedFiles: newLockedFiles };
  }),
  
  unlockFile: (filename) => set((state) => {
    console.log(`[DEBUG] projectStore: Unlocking file ${filename}`);
    const newLockedFiles = new Set(state.lockedFiles);
    newLockedFiles.delete(filename);
    return { lockedFiles: newLockedFiles };
  })
}));

// Helper function to load codebase into the file store
function loadCodebaseIntoFileStore(
  codebase: Record<string, any>, 
  addFile: (path: string, content: string) => void
) {
  try {
    // Process codebase and add files
    for (const [path, content] of Object.entries(codebase)) {
      // Determine if it's a file or directory based on content
      const type = typeof content === 'string' ? 'file' : 'directory';
      
      if (type === 'file') {
        addFile(path, content as string);
      } else if (type === 'directory') {
        // Handle directories - simplified approach for now
        // Add an empty file for the directory path
        addFile(path, '');
        
        // Recursively process nested files
        for (const [subPath, subContent] of Object.entries(content)) {
          const fullPath = `${path}/${subPath}`;
          if (typeof subContent === 'string') {
            addFile(fullPath, subContent);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error loading project into file store:', error);
    return false;
  }
} 