import { WebContainer } from '@webcontainer/api';
import { useProjectStore } from '@/store/projectStore';

// Store a reference to the WebContainer instance
let webContainerInstance: WebContainer | null = null;

// Initialize the WebContainer
export async function initializeWebContainer() {
  if (!webContainerInstance) {
    try {
      webContainerInstance = await WebContainer.boot();
      console.log('WebContainer initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error);
      return false;
    }
  }
  return true;
}

// Get the WebContainer instance
export function getWebContainer() {
  if (!webContainerInstance) {
    throw new Error('WebContainer not initialized');
  }
  return webContainerInstance;
}

// Load files into the WebContainer
export async function loadProjectIntoWebContainer(codebase: Record<string, any>) {
  // Make sure WebContainer is initialized
  if (!webContainerInstance) {
    await initializeWebContainer();
  }
  
  try {
    // Convert codebase to WebContainer file format
    const files = convertCodebaseToWebContainerFiles(codebase);
    
    // Mount files to WebContainer
    await webContainerInstance!.mount(files);
    
    // Check if package.json exists and install dependencies if needed
    if (files['package.json']) {
      await installDependencies();
    }
    
    // Start development server if needed
    // This might depend on project type and configuration
    return true;
  } catch (error) {
    console.error('Error loading project into WebContainer:', error);
    return false;
  }
}

// Convert codebase to WebContainer file format
function convertCodebaseToWebContainerFiles(codebase: Record<string, any>) {
  const files: Record<string, { file: { contents: string } } | { directory: {} }> = {};
  
  for (const [path, content] of Object.entries(codebase)) {
    // Skip empty paths
    if (!path) continue;
    
    // Determine if it's a file or directory based on content
    if (typeof content === 'string') {
      // It's a file
      files[path] = {
        file: {
          contents: content
        }
      };
    } else {
      // It's a directory
      files[path] = {
        directory: {}
      };
      
      // Process nested files recursively
      // This is simplified - would need more complex path handling for deeply nested files
      for (const [subPath, subContent] of Object.entries(content)) {
        const fullPath = `${path}/${subPath}`;
        if (typeof subContent === 'string') {
          files[fullPath] = {
            file: {
              contents: subContent
            }
          };
        }
      }
    }
  }
  
  return files;
}

// Convert files from project store to WebContainer format
export function convertProjectStoreFilesToWebContainer() {
  const projectStore = useProjectStore.getState();
  const files: Record<string, { file: { contents: string } } | { directory: {} }> = {};
  
  // Iterate through all files in the store
  projectStore.getAllFiles().forEach((fileEntry) => {
    const { path, content, type } = fileEntry;
    
    if (type === 'file') {
      files[path] = {
        file: {
          contents: content
        }
      };
    } else if (type === 'directory') {
      files[path] = {
        directory: {}
      };
    }
  });
  
  return files;
}

// Install dependencies in the WebContainer
async function installDependencies() {
  if (!webContainerInstance) return false;
  
  try {
    // Run npm install
    const installProcess = await webContainerInstance.spawn('npm', ['install']);
    
    // Wait for the process to complete
    const installExitCode = await installProcess.exit;
    
    return installExitCode === 0;
  } catch (error) {
    console.error('Error installing dependencies:', error);
    return false;
  }
}

// Start a development server
export async function startDevServer() {
  if (!webContainerInstance) return false;
  
  try {
    // Run npm start or similar command
    const startProcess = await webContainerInstance.spawn('npm', ['start']);
    
    // You may want to capture output for logs/debugging
    startProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log('Server output:', data);
      }
    }));
    
    return true;
  } catch (error) {
    console.error('Error starting development server:', error);
    return false;
  }
}

// Reset the WebContainer
export async function resetWebContainer() {
  if (webContainerInstance) {
    // In a real implementation, you'd want to clean up all processes and state
    // For now, just re-initialize
    webContainerInstance = null;
    return initializeWebContainer();
  }
  return true;
} 