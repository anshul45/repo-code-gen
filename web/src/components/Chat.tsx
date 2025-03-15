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
  const {files,fileChanges} = useFileStore()


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


  return (
    <div className="flex h-[calc(100vh-73px)] gap-4">
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
              <div className="flex items-center justify-center h-60 text-gray-500">
                Loading preview...
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="WebContainer"
                width={765}
                height={465}
                className='rounded-b-md'

              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

{/* <div className="w-2/5 border-l border-gray-200 overflow-y-auto">
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">Generated Code</h3>
    {selectedMessage?.currentFile && selectedMessage?.generatedFiles?.[selectedMessage.currentFile] ? (
      <>
        <div className="mb-2 text-sm text-gray-600">{selectedMessage.currentFile}</div>
        <pre className="p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
          {selectedMessage.generatedFiles[selectedMessage.currentFile]}
        </pre>
      </>
    ) : (
      <p className="text-gray-500">Select a file to view its generated code</p>
    )}
  </div>
</div> */}