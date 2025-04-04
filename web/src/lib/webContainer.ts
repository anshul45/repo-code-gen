import { WebContainer } from "@webcontainer/api";

// Function to strip ANSI escape codes
const stripAnsi = (str: string) => {
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

// Properly transforms nested directory structures into WebContainer-compatible format
const transformFilesForWebContainer = (files: any): any => {
  if (!files || Object.keys(files).length === 0) {
    console.log("[DEBUG] No files to transform");
    return {};
  }

  const result: any = {};
  
  // Process each file/directory
  Object.entries(files).forEach(([path, content]) => {
    // If it's a simple string content, it's already in the right format
    if (typeof content === 'string') {
      result[path] = { file: { contents: content } };
      return;
    }
    
    // If it has 'file' property with 'contents', it's already formatted correctly
    if (content && typeof content === 'object' && 'file' in content && 
        typeof content.file === 'object' && content.file && 'contents' in content.file) {
      result[path] = content;
      return;
    }
    
    // If it has 'contents' directly, convert to proper format
    if (content && typeof content === 'object' && 'contents' in content && 
        typeof content.contents === 'string') {
      result[path] = { file: { contents: content.contents } };
      return;
    }
    
    // For directories or complex objects, convert to proper directory format
    if (content && typeof content === 'object') {
      // Handle explicit directory structure
      if ('directory' in content && typeof content.directory === 'object') {
        result[path] = content;
        return;
      }
      
      // Treat as a directory with nested files
      const nestedFiles = transformFilesForWebContainer(content);
      result[path] = { directory: nestedFiles };
    }
  });
  
  return result;
};

// Error handling state
class ErrorState {
  private buffer: string = "";
  private isCollecting: boolean = false;
  private lastError: string = "";
  private onError: ((error: string, role?: 'user' | 'assistant' | 'tool', type?: string) => void) | undefined;

  constructor(onError?: (error: string, role?: 'user' | 'assistant' | 'tool', type?: string) => void) {
    this.onError = onError;
  }

  reset() {
    this.buffer = "";
    this.isCollecting = false;
  }

  resetLastError() {
    this.lastError = "";
  }

  processLine(line: string) {
    // Start collecting on error markers
    if (line.includes("Failed to compile") || 
        (line.includes("error") && !line.includes("npm ERR!")) || // Ignore npm errors
        (line.includes("Error:") && !line.includes("warn")) || // Ignore warnings
        line.includes("SyntaxError:") ||
        line.includes("TypeError:")) {
      console.log("Found error marker:", line);
      this.isCollecting = true;
      this.buffer = line + "\n";
      return;
    }

    // Keep collecting error lines
    if (this.isCollecting) {
      this.buffer += line + "\n";
      console.log("Current error buffer:", this.buffer);

      // End of error block
      if (line.trim() === "" || line.includes("Failed to compile")) {
        const cleanError = stripAnsi(this.buffer).trim();
        console.log("Processing complete error:", cleanError);
        
        if (cleanError && cleanError !== this.lastError) {
          console.log("Sending new error to chat");
          this.onError?.("```\n" + cleanError + "\n```", 'assistant', 'error');
          this.lastError = cleanError;
        }
        
        this.reset();
      }
    }
  }

  handleSuccess() {
    console.log("Compilation succeeded, resetting error state");
    this.resetLastError();
  }
}

export const bootWebContainer = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any,
  setIsLoadingPreview: (loading: boolean) => void,
  appendTerminal: (data: string) => void,
  setUrl:(url : string) => void,
  lockFile?: (filename: string) => void,
  unlockFile?: (filename: string) => void,
  onError?: (error: string, role?: 'user' | 'assistant' | 'tool', type?: string) => void
) => {
  console.log("[DEBUG] Booting WebContainer...");
  console.log("[DEBUG] Initial files structure:", Object.keys(files).length, "files");
  
  // Create a static variable to track if we've already booted
  if ((bootWebContainer as any).instance) {
    console.log("[DEBUG] Reusing existing WebContainer instance");
    const existingInstance = (bootWebContainer as any).instance;
    
    // Clear existing files before mounting new ones
    try {
      const rootDir = await existingInstance.fs.readdir('/');
      console.log("[DEBUG] Clearing existing files:", rootDir);
      
      for (const file of rootDir) {
        if (file !== 'node_modules') { // Preserve node_modules to speed up npm install
          await existingInstance.fs.rm(file, { recursive: true, force: true });
        }
      }
    } catch (e) {
      console.error("[DEBUG] Error clearing existing files:", e);
    }
    
    // Transform and mount new files
    const transformedFiles = transformFilesForWebContainer(files);
    console.log("[DEBUG] Transformed files structure:", 
                Object.keys(transformedFiles).length, "files");
    
    if (Object.keys(transformedFiles).length > 0) {
      try {
        console.log("[DEBUG] Mounting files to existing instance");
        await existingInstance.mount(transformedFiles);
        console.log("[DEBUG] Mounting to existing instance successful");
      } catch (e) {
        console.error("[DEBUG] Error mounting to existing instance:", e);
        onError?.(`Error remounting files: ${e instanceof Error ? e.message : String(e)}`,
                'assistant', 'error');
      }
    }
    
    return existingInstance;
  }
  
  try {
    setIsLoadingPreview(true); 
    const webcontainerInstance = await WebContainer.boot();
    console.log("[DEBUG] WebContainer instance created successfully");
    
    // Store the instance for future use
    (bootWebContainer as any).instance = webcontainerInstance;
    
    // Transform files to WebContainer format
    const transformedFiles = transformFilesForWebContainer(files);
    console.log("[DEBUG] Transformed files structure:", 
                Object.keys(transformedFiles).length, "files",
                "First key:", Object.keys(transformedFiles)[0]);
    
    // Log sample of transformed structure
    if (Object.keys(transformedFiles).length > 0) {
      const firstKey = Object.keys(transformedFiles)[0];
      console.log(`[DEBUG] First file transformed structure:`, 
                 JSON.stringify(transformedFiles[firstKey]).substring(0, 100) + '...');
    }
    
    // Prevent overwriting page.tsx during initial mount
    Object.keys(transformedFiles).forEach(key => {
      if (key.endsWith('/page.tsx') || key === 'page.tsx') {
        console.log(`[DEBUG] Skipping page.tsx file: ${key}`);
        delete transformedFiles[key];
      }
    });
    
    // Lock files before mounting
    if (lockFile) {
      console.log("[DEBUG] Locking files before mounting");
      Object.keys(transformedFiles).forEach(key => {
        lockFile(key);
      });
    }

    try {
      if (Object.keys(transformedFiles).length > 0) {
        console.log("[DEBUG] Executing WebContainer.mount with transformed files");
        await webcontainerInstance.mount(transformedFiles);
        console.log("[DEBUG] Mounting Success");
      } else {
        console.log("[DEBUG] No files to mount");
      }
    } catch (mountError) {
      console.error("[DEBUG] Mount Error:", mountError);
      onError?.(`WebContainer Mount Error: ${mountError instanceof Error ? mountError.message : String(mountError)}`, 'assistant', 'error');
    }

    // Unlock files after mounting
    if (unlockFile) {
      console.log("[DEBUG] Unlocking files after mounting");
      Object.keys(transformedFiles).forEach(key => {
        unlockFile(key);
      });
    }

    // Verify mount status by listing files
    try {
      console.log("[DEBUG] Verifying mount by listing files");
      const rootDir = await webcontainerInstance.fs.readdir('/');
      console.log("[DEBUG] Root directory contents:", rootDir);
    } catch (listError) {
      console.error("[DEBUG] Error listing files:", listError);
    }

    // Add terminal output for install process
    appendTerminal("📦 Installing dependencies...\n");
    try {
      console.log("[DEBUG] Running npm install");
      const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            appendTerminal(data);
            console.log('[DEBUG] Install data:', data);
          },
        })
      );

      const installExitCode = await installProcess.exit;
      console.log("[DEBUG] npm install exit code:", installExitCode);
      if (installExitCode !== 0) {
        appendTerminal("❌ Installation failed\n");
        throw new Error("Unable to run npm install");
      }
      appendTerminal("✅ Dependencies installed successfully\n");
    } catch (installError) {
      console.error("[DEBUG] npm install error:", installError);
      onError?.(`npm install error: ${installError instanceof Error ? installError.message : String(installError)}`, 'assistant', 'error');
    }

    // Add terminal output for dev server
    appendTerminal("🚀 Starting development server...\n");
    try {
      console.log("[DEBUG] Starting development server (npm run dev)");
      const runProcess = await webcontainerInstance.spawn("npm", ["run", "dev"]);
      
      // Create error state handler
      const errorState = new ErrorState(onError);

      // Handle stderr
      runProcess.stderr.pipeTo(
        new WritableStream({
          write(data) {
            appendTerminal(data);
            console.log("[DEBUG] Stderr data:", data);
            const lines = data.split('\n');
            for (const line of lines) {
              errorState.processLine(line);
            }
          },
        })
      );

      // Create a stream handler that persists
      const streamHandler = new WritableStream({
        write(data) {
          appendTerminal(data);
          console.log("[DEBUG] Stream data:", data);

          // Reset error tracking when compilation succeeds
          if (data.includes("compiled successfully")) {
            console.log("[DEBUG] Compilation successful");
            errorState.handleSuccess();
          }
          
          // Process each line for errors
          const lines = data.split('\n');
          for (const line of lines) {
            errorState.processLine(line);
          }
        }
      });

      // Pipe the output to our handler
      runProcess.output.pipeTo(streamHandler);
    } catch (devError) {
      console.error("[DEBUG] npm run dev error:", devError);
      onError?.(`npm run dev error: ${devError instanceof Error ? devError.message : String(devError)}`, 'assistant', 'error');
    }

    // Watch for file changes
    webcontainerInstance.fs.watch("/", async (event, filename) => {
      console.log("[DEBUG] File Changed:", filename, "Event:", event);
      appendTerminal(`📁 File changed: ${filename}\n`);
    });

    // Listen for runtime errors
    webcontainerInstance.on("error", (error) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[DEBUG] Runtime Error:", errorMessage);
      appendTerminal(`❌ Runtime Error: ${errorMessage}\n`);
      onError?.(`Runtime Error: ${errorMessage}`, 'assistant', 'error');
    });
    
    webcontainerInstance.on("server-ready", (port, url) => {
      console.log("[DEBUG] Server Ready on port:", port, "URL:", url);
      appendTerminal(`🌐 Server ready at ${url}\n`);
      if(url) {
        setUrl(url);
        setIsLoadingPreview(false);
      }
    });

    return webcontainerInstance;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to boot container';
    console.error("[DEBUG] Error booting WebContainer:", error);
    appendTerminal(`❌ Error: ${errorMessage}\n`);
    // Don't show WebContainer initialization errors in chat
    if (!errorMessage.includes("Only a single WebContainer instance")) {
      onError?.(`WebContainer Error: ${errorMessage}`, 'assistant', 'error');
    }
    return null;
  }
};
