'use client';

import { useState, useEffect, useRef } from 'react';
import { WebContainer } from "@webcontainer/api";
import { bootWebContainer } from "@/lib/webContainer";
import { Download } from 'lucide-react';
import { createProjectZip } from '@/lib/zipUtils';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import ChatPreview from './ChatPreview';
import { useFileStore } from '@/store/fileStore';
import { useLandingPageStore } from '@/store/landingPageStore';
import { useChatStore } from '@/store/chat';
import Terminal from './Terminal';
import { motion } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { PreviewPanel } from './PreviewPanel';

export function Chat({ mode = "default", userId }: { mode?: "default" | "landing-page", userId: string }) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">(mode === "landing-page" ? "preview" : "code");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true);
  const fileStore = useFileStore();
  const landingPageStore = useLandingPageStore();
  const { files, fileChanges, isMount, mountFile, setActiveFile, lockFile, unlockFile } = 
    mode === "landing-page" ? landingPageStore : fileStore;
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const shellRef = useRef<WritableStreamDefaultWriter<string> | null>(null);
  const [url,setUrl] = useState<string|null>(null);
  const chatStore = useChatStore();

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
        const instance = await bootWebContainer(
          files, 
          setIsLoadingPreview, 
          appendTerminal, 
          setUrl, 
          lockFile, 
          unlockFile,
          (error, role = 'assistant', type = 'error') => {
            console.log("Adding error to chat:", error, role, type);
            // Add error message to chat store
            chatStore.addMessage(error, role, type);
            // Also log current messages for debugging
            console.log("Current chat messages:", chatStore.messages);
          }
        );
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
  }, [webcontainer, mode, files, lockFile, unlockFile]);

  useEffect(() => {
    if (fileChanges && 'isSaved' in fileChanges && fileChanges.isSaved) {
      writeFileToWebContainer(fileChanges.filename, fileChanges.content);
    }
  }, [fileChanges]);

  useEffect(() => {
    if (isMount && mountFile) {
      try {
        const parsedFiles = JSON.parse(mountFile);
        const filesToMount = { ...parsedFiles };
        
        // Lock files that will be modified
        Object.keys(parsedFiles).forEach(key => {
          lockFile(key);
        });

        if (Object.keys(filesToMount).length > 0) {
          webcontainer?.mount(filesToMount).then(() => {
            // Unlock files after mounting is complete
            Object.keys(parsedFiles).forEach(key => {
              unlockFile(key);
            });
          });
        }
      } catch (error) {
        console.error('Error parsing mount file:', error);
        // Unlock all files in case of error
        if (typeof mountFile === 'string') {
          try {
            const parsedFiles = JSON.parse(mountFile);
            Object.keys(parsedFiles).forEach(key => {
              unlockFile(key);
            });
          } catch (e) {
            console.error('Error unlocking files:', e);
          }
        }
      }
    }
  }, [isMount, mountFile, lockFile, unlockFile, webcontainer]);

  return (
    <div className="w-full grid grid-cols-12 h-[calc(100vh-29px)] px-4 pt-2 pb-2 gap-4 bg-gray-100 dark:bg-gray-900 min-w-[1000px] overflow-hidden min-h-0">
      {/* Chat Preview */}
      <div className={`col-span-4 h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden min-w-0 min-h-0`}>
        <ChatPreview 
          setActiveFile={(file: { path: string; content: string; isNew:boolean } | null) => setActiveFile(file)} 
          userId={userId}
        />
      </div>

      {/* Right Section */}
      <div className={`col-span-8 h-full rounded-lg shadow-lg flex flex-col bg-white dark:bg-gray-800 min-h-0`}>
        {mode === "default" ? (
          <>
            {/* IDE Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 min-w-0">
              {/* Left side: Tabs */}
              <div className="flex items-center space-x-2 min-w-0">
                <div className="flex bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
                  <button
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === "code"
                        ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTab("code")}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Code
                    </div>
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === "preview"
                        ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTab("preview")}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </div>
                  </button>
                </div>
              </div>

              {/* Right side: Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    try {
                      await createProjectZip(files);
                    } catch (error) {
                      console.error('Error creating zip file:', error);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Project
                </button>
              </div>
            </div>

            {/* Code or Preview Section */}
            <div className="flex-1 overflow-hidden h-full w-full">
              {activeTab === "code" ? (
                <PanelGroup direction="vertical" className="h-full min-w-0">
                  <Panel defaultSize={80}>
                    <PanelGroup direction="horizontal" className="min-w-0">
                      {/* File Explorer with title */}
                      <Panel defaultSize={20} minSize={20} maxSize={25}>
                        <div className="h-full flex flex-col min-w-0">
                          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 min-w-0">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Explorer</h3>
                          </div>
                          <div className="flex-1 overflow-auto">
                            <FileExplorer setActiveFile={(file: { path: string; content: string; isNew:boolean } | null) => setActiveFile(file)} />
                          </div>
                        </div>
                      </Panel>
                      
                      <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />
                      
                      {/* Code Editor with title */}
                      <Panel defaultSize={80}>
                        <div className="h-full flex flex-col min-w-0">
                          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 min-w-0">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Editor</h3>
                          </div>
                          <div className="flex-1">
                            <CodeEditor />
                          </div>
                        </div>
                      </Panel>
                    </PanelGroup>
                  </Panel>

                  {/* Terminal with title */}
                  <Panel defaultSize={20}>
                    <div className="h-full flex flex-col border-t border-gray-200 dark:border-gray-700 min-w-0">
                      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 min-w-0">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Terminal</h3>
                      </div>
                      <div className="flex-1">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="h-full"
                        >
                          <Terminal
                            output={terminalOutput}
                            command={command}
                            onCommandChange={setCommand}
                            onCommandSubmit={handleCommandSubmit}
                            onClear={clearTerminal}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </Panel>
                </PanelGroup>
              ) : (
                <PreviewPanel
                  url={url}
                  isLoading={isLoadingPreview}
                  onUrlChange={setUrl}
                  onReset={() => setUrl(null)}
                />
              )}
            </div>
          </>
        ) : (
          <PreviewPanel
            url={url}
            isLoading={isLoadingPreview}
            onUrlChange={setUrl}
            onReset={() => setUrl(null)}
          />
        )}
      </div>
    </div>
  );
}
