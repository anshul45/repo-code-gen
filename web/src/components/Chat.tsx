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
  const {files,fileChanges,isMount,mountFile} = useFileStore()


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
    <div className="flex h-[calc(100vh-60px)] gap-4">
      {/* Message Content Section */}
      <div className='flex-[3.5]'>
    <ChatPreview/>
      </div>
   
      {/* Custom Tabs*/}
      <div className="flex-[6.5] border-[1px] rounded-md">
        <div className="flex bg-gray-100 px-1 py-1 rounded-3xl w-fit my-2 ml-2">
          <button
            className={`rounded-3xl px-2 py-0.5 text-sm ${activeTab === "code" ? "bg-white" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
          <button
            className={`rounded-3xl px-2 py-0.5 text-sm ${activeTab === "preview" ? "bg-white" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>


        <div className="">
          {/* Code Editor */}
          <div className={activeTab === "code" ? "block" : "hidden"}>
            <div className="flex">
              <div className='flex-[0.2]'>
                <FileExplorer setActiveFile={setActiveFile} />
              </div>
              <div className='flex-[0.8]'>
                <CodeEditor data={activeFile} />
              </div>
            </div>
          </div>

          {/* Preview  */}
          <div className={activeTab === "preview" ? "block w-full border-t-[1px]" : "hidden"}>
          {isLoadingPreview ? (
              <div className="flex items-center justify-center h-60 text-gray-500 w-full">
                Loading preview...
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="WebContainer"
                width={718}
                height={466}
                className='rounded-b-md'
              />
            )}
          </div>
        </div>
      </div>
            
    </div>
  );
}
