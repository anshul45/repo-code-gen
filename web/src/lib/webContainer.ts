import { WebContainer } from "@webcontainer/api";

export const bootWebContainer = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any,
  setIsLoadingPreview: (loading: boolean) => void,
  appendTerminal: (data: string) => void,
  setUrl:(url : string) => void,
  lockFile?: (filename: string) => void,
  unlockFile?: (filename: string) => void
) => {
  console.log("Booting WebContainer...");
  
  try {
    setIsLoadingPreview(true); 
    const webcontainerInstance = await WebContainer.boot();
    console.log("Mounting Files");
    
    // Prevent overwriting page.tsx during initial mount
    // Check for page.tsx in any directory
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
          console.log(data);
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
    runProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          appendTerminal(data);
          console.log(data);
        },
      })
    );

    webcontainerInstance.fs.watch("/", async (event, filename) => {
      console.log("File Changed:", filename);
      appendTerminal(`📁 File changed: ${filename}\n`);
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
    console.error("Error booting WebContainer:", error);
    appendTerminal(`❌ Error: ${error instanceof Error ? error.message : 'Failed to boot container'}\n`);
    // setIsLoadingPreview(false); 
    return null;
  }
};
