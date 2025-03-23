'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { WebContainer } from "@webcontainer/api";
import { bootWebContainer } from "@/lib/webContainer";
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import ChatPreview from './ChatPreview';
import { useFileStore } from '@/store/fileStore';
import Terminal from './Terminal';
import { motion } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export function Chat() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [activeFile, setActiveFile] = useState<any>();
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true);
  const { files, fileChanges, isMount, mountFile } = useFileStore();
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const shellRef = useRef<WritableStreamDefaultWriter<string> | null>(null);
  const [url,setUrl] = useState<string|null>(null)

  const appendTerminal = (msg: string) => {
    if (msg.includes("\x1Bc") || msg.includes("\x1B[2J")) {
      clearTerminal();
    } else {
      setTerminalOutput((prev) => [...prev, msg]);
    }
  };

  const clearTerminal = () => {
    setTerminalOutput([]); 
  };

  const writeFileToWebContainer = async (path: string, content: string) => {
    if (!webcontainer) return;
    await webcontainer.fs.writeFile(path, content);
  };

  const handleCommandSubmit = async (command: string) => {
    if (!shellRef.current) return;
    await shellRef.current.write(command + '\n');
    setCommand('');
  };

  useEffect(() => {
    const initialize = async () => {
      if (!webcontainer) {
        const instance = await bootWebContainer(files, setIsLoadingPreview, appendTerminal,setUrl);
        setWebcontainer(instance);

        if (instance) {
          const shellProcess = await instance.spawn('jsh', {
            terminal: {
              cols: 80,
              rows: 10,
            },
          });

          shellProcess.output.pipeTo(new WritableStream({
            write(data) {
              appendTerminal(data);
            },
          }));

          const shellWriter = shellProcess.input.getWriter();
          shellRef.current = shellWriter;

          instance.fs.watch("/", async (event, filename) => {
            console.log("File changed:", filename);
          });
        }
      }
    };

    initialize();
  }, [webcontainer]);

  useEffect(() => {
    if (fileChanges && fileChanges.filename && fileChanges.content) {
      writeFileToWebContainer(fileChanges.filename, fileChanges.content);
    }
  }, [fileChanges]);

  useEffect(() => {
    if (isMount && mountFile) {
      webcontainer?.mount(JSON.parse(mountFile));
    }
  }, [isMount]);


  return (
    <div className="w-full  flex h-[calc(100vh-29px)] px-4 py-4 gap-4 bg-gray-100 dark:bg-gray-900">
      {/* Left: Chat Preview */}
      <div className='flex-[3.5] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
        <ChatPreview />
      </div>

      {/* Right: Tabs + Editor/Preview */}
      <div className="flex-[6.5] min-w-0 rounded-lg shadow-lg flex flex-col bg-white dark:bg-gray-800">
        {/* Tabs */}
        <div className="flex bg-gray-100 w-fit dark:bg-gray-700 px-1 py-1 rounded-2xl my-2 ml-2 space-x-1">
          <button
            className={`rounded-3xl px-3 py-0.5 text-sm transition-colors duration-200 ${activeTab === "code" ? "bg-white dark:bg-gray-600 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
          <button
            className={`rounded-3xl px-3 py-0.5 text-sm transition-colors duration-200 ${activeTab === "preview" ? "bg-white dark:bg-gray-600 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>

        {/* Code or Preview Section */}
        <div className="w-full flex-1 overflow-hidden flex flex-col">
          {activeTab === "code" ? (
            <div className="w-full flex flex-col md:flex-row h-full">
              {/* File Explorer */}
              <PanelGroup direction="vertical">
                <Panel defaultSize={75}>
                <PanelGroup direction="horizontal">
                  <Panel defaultSize={20} minSize={20} maxSize={25}>
                    <FileExplorer setActiveFile={setActiveFile} />
                  </Panel>
                  <PanelResizeHandle className="w-[1px] bg-gray-200 dark:bg-gray-700" />
                  <Panel>
                    <CodeEditor data={activeFile} />
                  </Panel>
                  </PanelGroup>
                </Panel>
                <Panel defaultSize={25}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='rounded-b-2xl'
                  >
                    <Terminal
                      output={terminalOutput}
                      command={command}
                      onCommandChange={setCommand}
                      onCommandSubmit={handleCommandSubmit}
                      onClear={clearTerminal}
                    />
                  </motion.div> 
                </Panel>
              </PanelGroup>
            </div>
          ) : (
            <div className="w-full h-full border-t-[1px] border-gray-200 dark:border-gray-700">
              {isLoadingPreview && !url ? (
                <div className="flex items-center justify-center text-gray-500 rounded-b-md w-full h-[calc(100vh-71px)]">
                  Loading preview...
                </div>
              ) : (
                <iframe
                  src={url as string}
                  title="WebContainer"
                  className="rounded-b-md w-full h-[calc(100vh-110px)]"
                  />
              )} 
            </div>
          )}
        </div>
      </div>
    </div>
  );
}