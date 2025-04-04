'use client';

import { useState, useEffect, useRef } from 'react';
import { WebContainer } from "@webcontainer/api";
import { bootWebContainer } from "@/lib/webContainer";
import { Download, Bug } from 'lucide-react';
import { createProjectZip } from '@/lib/zipUtils';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import ChatPreview from './ChatPreview';
import { useProjectStore } from '@/store/projectStore';
import { useLandingPageStore } from '@/store/landingPageStore';
import { useChatStore } from '@/store/chat';
import Terminal from './Terminal';
import { motion } from "framer-motion";
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { PreviewPanel } from './PreviewPanel';
import { getProjectById } from '@/services/project-api';

export function Chat({ mode = "default", userId, projectId }: { mode?: "default" | "landing-page", userId: string, projectId?: string }) {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">(mode === "landing-page" ? "preview" : "code");
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(true);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<Error | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  
  // Ref to track the loaded project ID to prevent redundant API calls
  const loadedProjectIdRef = useRef<string | null>(null);
  
  const projectStore = useProjectStore();
  const landingPageStore = useLandingPageStore();
  
  // Use files directly from projectStore since we're now using DirectoryNode structure
  const store = mode === "landing-page" ? landingPageStore : projectStore;
  const { fileChanges, isMount, mountFile, setActiveFile, lockFile, unlockFile } = store;
  const files = mode === "landing-page" ? landingPageStore.files : projectStore.files;
  
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const shellRef = useRef<WritableStreamDefaultWriter<string> | null>(null);
  const [url,setUrl] = useState<string|null>(null);
  const chatStore = useChatStore();

  // Override console.log to capture debug logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args) => {
      originalConsoleLog(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (logMessage.includes('[DEBUG]')) {
        setDebugLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} ${logMessage}`]);
      }
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setDebugLogs(prev => [...prev, `ERROR ${new Date().toISOString().split('T')[1].split('.')[0]} ${logMessage}`]);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setDebugLogs(prev => [...prev, `WARN ${new Date().toISOString().split('T')[1].split('.')[0]} ${logMessage}`]);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Load project based on the mode
  useEffect(() => {
    // Skip if no projectId or if we've already loaded this project
    if (!projectId || projectId === loadedProjectIdRef.current) return;
    
    const loadProjectData = async () => {
      setIsLoadingProject(true);
      setProjectError(null);
      
      try {
        console.log(`[DEBUG] Loading project ${projectId} in ${mode} mode`);
        const project = await getProjectById(projectId);
        console.log(`[DEBUG] Project data received:`, 
          { id: project.id, name: project.name, 
            codebaseEntries: project.codebase ? Object.keys(project.codebase).length : 0 
          });
        
        // Set the project in chat store
        chatStore.setProject(project.id, project.name);
        
        // Reset the appropriate store based on mode
        if (mode === "default") {
          console.log(`[DEBUG] Using projectStore for default mode`);
          // Reset the project store
          projectStore.resetFiles();
          
          // Load project into project store
          if (project.codebase) {
            console.log(`[DEBUG] Loading ${Object.keys(project.codebase).length} files into projectStore`);
            
            // Convert object structure to flat file paths with string contents
            const flattenFiles = (obj: any, basePath: string = ''): Record<string, string> => {
              const result: Record<string, string> = {};
              
              Object.entries(obj).forEach(([key, value]) => {
                const path = basePath ? `${basePath}/${key}` : key;
                
                if (typeof value === 'string') {
                  // It's a file with string content
                  result[path] = value;
                } else if (value && typeof value === 'object') {
                  // Handle directory field - extract its contents but ignore the field itself
                  if ('directory' in value && typeof value.directory === 'object') {
                    // Recursively process directory contents
                    const dirContents = flattenFiles(value.directory, path);
                    Object.assign(result, dirContents);
                    return;
                  }
                  
                  // Handle file with contents field
                  if ('file' in value && value.file && typeof value.file === 'object' && 
                      'contents' in value.file && typeof value.file.contents === 'string') {
                    result[path] = value.file.contents;
                    return;
                  }
                  
                  // Handle direct contents field
                  if ('contents' in value && typeof value.contents === 'string') {
                    result[path] = value.contents;
                    return;
                  }
                  
                  // It's a regular object (nested structure), recurse into it
                  const nestedFiles = flattenFiles(value, path);
                  Object.assign(result, nestedFiles);
                }
              });
              
              return result;
            };
            
            // Flatten the nested structure
            const files = flattenFiles(project.codebase);
            console.log(`[DEBUG] Flattened ${Object.keys(files).length} files from codebase`);
            
            // Process files and add to store
            Object.entries(files).forEach(([path, content]) => {
              if (typeof content === 'string') {
                projectStore.addFile(path, content);
              } else {
                console.log(`[DEBUG] Skipping non-string content for path: ${path}, type: ${typeof content}`);
              }
            });
          }
        } else {
          console.log(`[DEBUG] Using landingPageStore for landing-page mode`);
          // For landing page mode
          if (project.codebase) {
            console.log(`[DEBUG] Setting mountFile with ${Object.keys(project.codebase).length} files`);
            landingPageStore.updateMountFile(JSON.stringify(project.codebase));
          }
        }
        
        // Mark this project as loaded to prevent redundant API calls
        loadedProjectIdRef.current = projectId;
      } catch (err) {
        console.error('[DEBUG] Failed to load project:', err);
        setProjectError(err as Error);
      } finally {
        setIsLoadingProject(false);
      }
    };
    
    loadProjectData();
  }, [projectId, mode]);

  // Clean up when component unmounts or when mode changes
  useEffect(() => {
    return () => {
      // Reset the loaded project ID when component unmounts or mode changes
      loadedProjectIdRef.current = null;
    };
  }, [mode]);

  const clearDebugLogs = () => {
    setDebugLogs([]);
  };

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
        console.log('[DEBUG] Initializing WebContainer with files:', Object.keys(files).length);
        const instance = await bootWebContainer(
          files, 
          setIsLoadingPreview, 
          appendTerminal, 
          setUrl, 
          lockFile, 
          unlockFile,
          (error, role = 'assistant', type = 'error') => {
            console.log("[DEBUG] WebContainer error:", error, role, type);
            // Add error message to chat store
            chatStore.addMessage(error, role, type);
            // Also log current messages for debugging
            console.log("Current chat messages:", chatStore.messages);
          }
        );
        console.log('[DEBUG] WebContainer instance created:', !!instance);
        setWebcontainer(instance);

        if (instance) {
          // Check if package.json exists and is accessible
          try {
            const rootFiles = await instance.fs.readdir('/');
            console.log('[DEBUG] Root files after initialization:', rootFiles);
            
            if (rootFiles.includes('package.json')) {
              const packageJsonContent = await instance.fs.readFile('/package.json', 'utf-8');
              console.log('[DEBUG] Found package.json content:', packageJsonContent.substring(0, 100) + '...');
            } else {
              console.warn('[DEBUG] package.json not found in root directory');
              
              // Create package.json manually if not found
              const defaultPackageJson = {
                name: "nextjs-project",
                version: "0.1.0",
                private: true,
                scripts: {
                  dev: "next dev",
                  build: "next build",
                  start: "next start",
                  lint: "next lint"
                },
                dependencies: {
                  "next": "^13.5.1",
                  "react": "^18.2.0",
                  "react-dom": "^18.2.0"
                }
              };
              
              // Write the package.json to the root directory
              await instance.fs.writeFile('/package.json', JSON.stringify(defaultPackageJson, null, 2));
              console.log('[DEBUG] Created default package.json');
              
              // Verify it was created
              const filesAfterCreate = await instance.fs.readdir('/');
              console.log('[DEBUG] Files after creating package.json:', filesAfterCreate);
            }
          } catch (e) {
            console.error('[DEBUG] Error checking/creating package.json:', e);
          }

          console.log('[DEBUG] Setting up WebContainer shell');
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

          instance.fs.watch("/", (eventType, filename) => {
            console.log("[DEBUG] WebContainer file changed:", filename);
          });
          
          // Run commands to check environment
          try {
            // Check current directory and files
            appendTerminal("📁 Checking environment...\n");
            const pwdProcess = await instance.spawn('pwd');
            await pwdProcess.exit;
            
            const lsProcess = await instance.spawn('ls', ['-la']);
            await lsProcess.exit;
            
            // Create a startup script
            const startupScript = `
              echo "🔍 Checking for package.json..."
              if [ -f "./package.json" ]; then
                echo "✅ package.json found in current directory"
                cat package.json | head -n 10
              else
                echo "❌ package.json not found in current directory"
                echo "Checking other locations..."
                ls -la /
                if [ -f "/package.json" ]; then
                  echo "✅ package.json found in root directory"
                  cat /package.json | head -n 10
                  cp /package.json ./package.json
                  echo "📋 Copied package.json to current directory"
                fi
              fi
            `;
            
            await instance.fs.writeFile('/startup.sh', startupScript);
            await instance.spawn('chmod', ['+x', '/startup.sh']);
            
            // Run the startup script
            appendTerminal("🚀 Running startup checks...\n");
            const startupProcess = await instance.spawn('/startup.sh');
            await startupProcess.exit;
          } catch (e) {
            console.error('[DEBUG] Error running initial commands:', e);
            appendTerminal(`❌ Error during initialization: ${e}\n`);
          }
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
        console.log('[DEBUG] Mounting files to WebContainer');
        const parsedFiles = JSON.parse(mountFile);
        console.log('[DEBUG] Parsed files to mount:', Object.keys(parsedFiles).length);
        
        // Special handling to ensure package.json is mounted correctly
        const processMount = async () => {
          if (webcontainer) {
            console.log('[DEBUG] Checking for package.json in codebase...');
            
            // Function to find package.json in nested structure
            const findPackageJson = (obj: any, path: string = ''): {content: string, path: string} | null => {
              for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}/${key}` : key;
                
                // Direct match for package.json
                if (key === 'package.json' && typeof value === 'string') {
                  return { content: value, path: currentPath };
                }
                
                // Check for package.json in file.contents format
                if (key === 'package.json' && value && typeof value === 'object' && 
                    'file' in value && value.file && typeof value.file === 'object' &&
                    'contents' in value.file && typeof value.file.contents === 'string') {
                  return { content: value.file.contents, path: currentPath };
                }
                
                // Check for package.json in contents format
                if (key === 'package.json' && value && typeof value === 'object' && 
                    'contents' in value && typeof value.contents === 'string') {
                  return { content: value.contents, path: currentPath };
                }
                
                // Recursively check in nested objects
                if (value && typeof value === 'object') {
                  // Check in directory property
                  if ('directory' in value && typeof value.directory === 'object') {
                    const found = findPackageJson(value.directory, currentPath);
                    if (found) return found;
                  }
                  
                  // If not a special structure, check the object directly
                  if (!('file' in value) && !('contents' in value) && !('directory' in value)) {
                    const found = findPackageJson(value, currentPath);
                    if (found) return found;
                  }
                }
              }
              
              return null;
            };
            
            // Find package.json in the codebase
            const packageJson = findPackageJson(parsedFiles);
            
            if (packageJson) {
              console.log(`[DEBUG] Found package.json at path: ${packageJson.path}`);
              
              // Write package.json to the root directory first
              await webcontainer.fs.writeFile('/package.json', packageJson.content);
              console.log('[DEBUG] Written package.json to root directory');
              
              // Check if it was written correctly
              try {
                const content = await webcontainer.fs.readFile('/package.json', 'utf-8');
                console.log('[DEBUG] Verified package.json content:', content.substring(0, 100) + '...');
              } catch (e) {
                console.error('[DEBUG] Failed to verify package.json:', e);
              }
            } else {
              console.warn('[DEBUG] No package.json found in codebase');
            }
          }
          
          const filesToMount = { ...parsedFiles };
          
          // Lock files that will be modified
          Object.keys(parsedFiles).forEach(key => {
            lockFile(key);
          });

          if (Object.keys(filesToMount).length > 0 && webcontainer) {
            console.log('[DEBUG] Calling WebContainer.mount with files');
            try {
              await webcontainer.mount(filesToMount);
              console.log('[DEBUG] WebContainer mount completed successfully');
              
              // Verify the mount by listing files
              try {
                const files = await webcontainer.fs.readdir('/');
                console.log('[DEBUG] Files in root directory after mount:', files);
              } catch (e) {
                console.error('[DEBUG] Error reading root directory:', e);
              }
              
              // Unlock files after mounting is complete
              Object.keys(parsedFiles).forEach(key => {
                unlockFile(key);
              });
            } catch (error) {
              console.error('[DEBUG] WebContainer mount failed:', error);
              // Unlock files in case of error
              Object.keys(parsedFiles).forEach(key => {
                unlockFile(key);
              });
            }
          }
        };
        
        // Call the async function
        processMount().catch(error => {
          console.error('[DEBUG] Error in processMount:', error);
        });
      } catch (error) {
        console.error('[DEBUG] Error parsing mount file:', error);
        // Unlock all files in case of error
        if (typeof mountFile === 'string') {
          try {
            const parsedFiles = JSON.parse(mountFile);
            Object.keys(parsedFiles).forEach(key => {
              unlockFile(key);
            });
          } catch (e) {
            console.error('[DEBUG] Error unlocking files:', e);
          }
        }
      }
    }
  }, [isMount, mountFile, lockFile, unlockFile, webcontainer]);

  // Show loading while loading project
  if (isLoadingProject) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading project...</div>
      </div>
    );
  }

  // Show error if project loading failed
  if (projectError) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col gap-4">
        <div className="text-red-500">
          Error loading project: {projectError.message}
        </div>
      </div>
    );
  }

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

              {/* Center: Project Name */}
              {chatStore.projectName && (
                <div className="flex-1 text-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate px-4 border-b-2 border-primary inline-block pb-1">
                    {chatStore.projectName}
                  </h2>
                </div>
              )}

              {/* Right side: Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  title="Toggle Debug Panel"
                >
                  <Bug className="h-4 w-4" />
                </button>
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

            {/* Debug Panel */}
            {showDebugPanel && (
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 max-h-64 overflow-auto">
                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Debug Logs</h3>
                  <button 
                    onClick={clearDebugLogs}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Clear
                  </button>
                </div>
                <div className="p-2 font-mono text-xs">
                  {debugLogs.map((log, i) => (
                    <div key={i} className={`pb-1 ${log.includes('ERROR') ? 'text-red-500' : log.includes('WARN') ? 'text-yellow-500' : ''}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code or Preview Section */}
            <div className={`flex-1 overflow-hidden h-full w-full ${showDebugPanel ? 'h-[calc(100%-64px)]' : ''}`}>
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
