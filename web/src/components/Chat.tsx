'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { WebContainer } from "@webcontainer/api";
import { bootWebContainer } from "@/lib/webContainer";
import { files } from "@/common/next_template";
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import ChatPreview from './ChatPreview';

export function Chat() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeFile, setActiveFile] = useState<any>()
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true)

  // Auto-scroll when new messages arrive
  

  useEffect(() => {
    const initialize = async () => {
      if (!webcontainer) {
        const instance = await bootWebContainer(files, iframeRef as RefObject<HTMLIFrameElement>, setIsLoadingPreview);
        setWebcontainer(instance);
      }
    };

    initialize();
  }, [webcontainer]);


  return (
    <div className="flex h-[92.5vh]">
      {/* Message Content Section */}
      <div className='flex-[3.5]'>
    <ChatPreview/>
      </div>

      {/* Custom Tabs*/}
      <div className="flex-[6.5]">
        <div className="flex bg-gray-100 rounded-lg w-fit px-1 py-1.5">
          <button
            className={`rounded-lg px-3 py-1 ${activeTab === "code" ? "bg-white" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
          <button
            className={`rounded-lg px-3 py-1 ${activeTab === "preview" ? "bg-white" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>


        <div className="py-2">
          {/* Code Editor */}
          <div className={activeTab === "code" ? "block" : "hidden"}>
            <div className="flex">
              <div className='flex-[0.3]'>
                <FileExplorer setActiveFile={setActiveFile} />
              </div>
              <div className='flex-[0.7]'>
                <CodeEditor data={activeFile} />
              </div>
            </div>
          </div>

          {/* Preview  */}
          <div className={activeTab === "preview" ? "block w-full" : "hidden"}>
          {isLoadingPreview ? (
              <div className="flex items-center justify-center h-60 text-gray-500">
                Loading preview...
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="WebContainer"
                width={596}
                height={480}
                className=""
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