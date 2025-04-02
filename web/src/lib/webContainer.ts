import { WebContainer } from "@webcontainer/api";

// Function to strip ANSI escape codes
const stripAnsi = (str: string) => {
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
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
  console.log("Booting WebContainer...");
  
  try {
    setIsLoadingPreview(true); 
    const webcontainerInstance = await WebContainer.boot();
    console.log("Mounting Files");
    
    // Prevent overwriting page.tsx during initial mount
    Object.keys(files).forEach(key => {
      if (key.endsWith('/page.tsx') || key === 'page.tsx') {
        delete files[key];
      }
    });
    
    // Lock files before mounting
    if (lockFile) {
      Object.keys(files).forEach(key => {
        lockFile(key);
      });
    }

    await webcontainerInstance.mount(files);
    console.log("Mounting Success");

    // Unlock files after mounting
    if (unlockFile) {
      Object.keys(files).forEach(key => {
        unlockFile(key);
      });
    }

    // Add terminal output for install process
    appendTerminal("📦 Installing dependencies...\n");
    const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          appendTerminal(data);
          console.log('Install data:', data);
        },
      })
    );

    const installExitCode = await installProcess.exit;
    if (installExitCode !== 0) {
      appendTerminal("❌ Installation failed\n");
      throw new Error("Unable to run npm install");
    }
    appendTerminal("✅ Dependencies installed successfully\n");

    // Add terminal output for dev server
    appendTerminal("🚀 Starting development server...\n");
    const runProcess = await webcontainerInstance.spawn("npm", ["run", "dev"]);
    
    // Create error state handler
    const errorState = new ErrorState(onError);

    // Handle stderr
    runProcess.stderr.pipeTo(
      new WritableStream({
        write(data) {
          appendTerminal(data);
          console.log("Stderr data:", data);
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
        console.log("Stream data:", data);

        // Reset error tracking when compilation succeeds
        if (data.includes("compiled successfully")) {
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

    // Watch for file changes
    webcontainerInstance.fs.watch("/", async (event, filename) => {
      console.log("File Changed:", filename);
      appendTerminal(`📁 File changed: ${filename}\n`);
    });

    // Listen for runtime errors
    webcontainerInstance.on("error", (error) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Runtime Error:", errorMessage);
      appendTerminal(`❌ Runtime Error: ${errorMessage}\n`);
      onError?.(`Runtime Error: ${errorMessage}`, 'assistant', 'error');
    });
    
    webcontainerInstance.on("server-ready", (port, url) => {
      appendTerminal(`🌐 Server ready at ${url}\n`);
      console.log("Server Ready:", url);
      if(url) {
        setUrl(url);
        setIsLoadingPreview(false);
      }
    });

    return webcontainerInstance;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to boot container';
    console.error("Error booting WebContainer:", error);
    appendTerminal(`❌ Error: ${errorMessage}\n`);
    // Don't show WebContainer initialization errors in chat
    if (!errorMessage.includes("Only a single WebContainer instance")) {
      onError?.(`WebContainer Error: ${errorMessage}`, 'assistant', 'error');
    }
    return null;
  }
};
