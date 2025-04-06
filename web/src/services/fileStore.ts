// Define the structure of a file in the file store
export interface FileEntry {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

// State for the file store
interface FileStoreState {
  files: Map<string, FileEntry>;
  currentFile: string | null;
}

// Initialize file store state
const fileStoreState: FileStoreState = {
  files: new Map<string, FileEntry>(),
  currentFile: null,
};

// File store operations
export const fileStore = {
  // Get all files
  getFiles: () => fileStoreState.files,

  // Get a specific file
  getFile: (path: string) => fileStoreState.files.get(path),

  // Get the current file
  getCurrentFile: () => fileStoreState.currentFile,

  // Set the current file
  setCurrentFile: (path: string) => {
    fileStoreState.currentFile = path;
  },

  // Add or update a file
  addFile: (path: string, content: string, type: 'file' | 'directory' = 'file') => {
    fileStoreState.files.set(path, { path, content, type });
  },

  // Delete a file
  deleteFile: (path: string) => {
    fileStoreState.files.delete(path);
    if (fileStoreState.currentFile === path) {
      fileStoreState.currentFile = null;
    }
  },

  // Reset the file store
  reset: () => {
    fileStoreState.files.clear();
    fileStoreState.currentFile = null;
  },
};

// Convert project codebase to file store entries
export async function loadProjectIntoFileStore(codebase: Record<string, any>) {
  // Reset current file store
  fileStore.reset();
  
  // Process codebase and add files to file store
  try {
    // Here we assume codebase is a simple object with file paths as keys and content as values
    for (const [path, content] of Object.entries(codebase)) {
      // Determine if it's a file or directory based on path and content
      const type = typeof content === 'string' ? 'file' : 'directory';
      
      if (type === 'file') {
        fileStore.addFile(path, content as string, type);
      } else if (type === 'directory') {
        // Handle directories if needed
        fileStore.addFile(path, '', 'directory');
        
        // Recursively process nested files
        for (const [subPath, subContent] of Object.entries(content)) {
          const fullPath = `${path}/${subPath}`;
          fileStore.addFile(fullPath, subContent as string, 'file');
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error loading project into file store:', error);
    return false;
  }
} 