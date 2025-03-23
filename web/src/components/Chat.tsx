'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { WebContainer } from "@webcontainer/api";
import { bootWebContainer } from "@/lib/webContainer";
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import ChatPreview from './ChatPreview';
import { useFileStore } from '@/store/fileStore';

export function Chat() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeFile, setActiveFile] = useState<any>()
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true)
  const {files, fileChanges, isMount, mountFile} = useFileStore()


  const writeFileToWebContainer = async (path: string, content: string) => {
    console.log("hit")
    if (!webcontainer) return;
    console.log("path",path)
    await webcontainer.fs.writeFile(path, content);
  };
  

  useEffect(() => {
    const initialize = async () => {
      if (!webcontainer) {
        const instance = await bootWebContainer(files, iframeRef as RefObject<HTMLIFrameElement>, setIsLoadingPreview);
        setWebcontainer(instance);

        if(instance)
         instance.fs.watch("/", async (event, filename) => {
          console.log("File changed:", filename);
        });
      }
      }
    

    initialize();
  }, [webcontainer]);


  useEffect(() => {
    if (fileChanges && fileChanges.filename && fileChanges.content) {
      writeFileToWebContainer(fileChanges.filename, fileChanges.content);
    }
  }, [fileChanges]);


  useEffect(() => {
    if(isMount && mountFile)
    {
      webcontainer?.mount(JSON.parse(mountFile))
    }
  },[isMount])

  


  return (
    <div className="w-full flex h-[calc(100vh-20px)] px-4 py-4 gap-4">
      <div className='flex-[3.5]'>
        <ChatPreview/>
      </div>
   
      {/* Right: Tabs + Editor/Preview */}
      <div className="flex-[6.5] min-w-0 border rounded-md">
        {/* Tabs */}
        <div className="flex bg-gray-100 px-1 py-1 rounded-3xl my-2 ml-2 space-x-1">
          <button
            className={`rounded-3xl px-3 py-0.5 text-sm ${
              activeTab === "code" ? "bg-white" : ""
            }`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
          <button
            className={`rounded-3xl px-3 py-0.5 text-sm ${
              activeTab === "preview" ? "bg-white" : ""
            }`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
    
        {/* Code or Preview Section */}
        <div className="w-full flex-1 overflow-hidden">
          {activeTab === "code" ? (
            <div className="w-full flex flex-col md:flex-row h-full">
              <div className="w-full md:flex-[0.25]">
                <FileExplorer setActiveFile={setActiveFile} />
              </div>
              <div className="w-full md:flex-[0.75]">
                <CodeEditor data={activeFile} />
              </div>
            </div>
          ) : (
            <div className="w-full h-full border-t-[1px]">
              {isLoadingPreview ? (
                <div className="flex items-center justify-center text-gray-500 rounded-b-md w-full h-[calc(100vh-71px)]">
                  Loading preview...
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  title="WebContainer"
                  className="rounded-b-md w-full h-[calc(100vh-71px)]"
                />
              )}
            </div>
          )}
        </div>
      </div>
  </div>  
  );
}
