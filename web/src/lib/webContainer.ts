import { WebContainer } from "@webcontainer/api";

export const bootWebContainer = async (
  files: any,
  iframeRef: React.RefObject<HTMLIFrameElement>,
  setIsLoadingPreview: (loading: boolean) => void
) => {
  console.log("Booting WebContainer...");
  
  try {
    setIsLoadingPreview(true); 
    const webcontainerInstance = await WebContainer.boot();
    console.log("Mounting Files");

    await webcontainerInstance.mount(files);
    console.log("Mounting Success");

    const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    const installExitCode = await installProcess.exit;
    if (installExitCode !== 0) {
      throw new Error("Unable to run npm install");
    }

    console.log("Starting dev server...");
    const runProcess = await webcontainerInstance.spawn("npm", ["run", "dev"]);

    runProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    
    setIsLoadingPreview(false); 

    webcontainerInstance.fs.watch("/", async (event, filename) => {
      console.log("File Changed:", filename);
    });
    
    webcontainerInstance.on("server-ready", (port, url) => {
      console.log("Server Ready:", url);
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
    });

    return webcontainerInstance;
  } catch (error) {
    console.error("Error booting WebContainer:", error);
    // setIsLoadingPreview(false); 
    return null;
  }
};
