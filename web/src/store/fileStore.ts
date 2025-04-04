// This file is deprecated and will be removed in a future version
// It now re-exports from projectStore for backwards compatibility

import { useProjectStore } from './projectStore';

// Re-export the project store as file store for backward compatibility
export const useFileStore = useProjectStore;

// Export any additional types needed for backward compatibility
export type { DirectoryNode, FileNode, FileChange } from './projectStore';
