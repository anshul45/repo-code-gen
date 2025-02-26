import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatInput } from './ChatInput';
import { ChatHistory } from './ChatHistory';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { useCodeGeneration } from './useCodeGeneration';
import { useWebContainer } from './useWebContainer';
import { Button } from '../ui/button';

export function Chat() {
  const {
    error,
    messages,
    filesToGenerate,
    selectedFile,
    generatedFiles,
    isLoading,
    currentlyGenerating,
    handleSubmit,
    generateFile,
    generateAllFiles,
    setSelectedFile
  } = useCodeGeneration();

  const {
    previewUrl,
    previewLoading,
    previewError,
    startPreview,
    isReady: webcontainerReady
  } = useWebContainer();

  const [currentTab, setCurrentTab] = useState('code');

  const handleFileSelect = (filePath: string) => {
    if (generatedFiles[filePath]) {
      setSelectedFile(filePath);
    } else {
      generateFile(filePath);
    }
  };

  const handleStartPreview = () => {
    startPreview(generatedFiles);
    setCurrentTab('preview');
  };

  const handleRefreshPreview = () => {
    startPreview(generatedFiles);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Chat History & Input Sidebar */}
      <div className="w-1/4 flex flex-col border-r border-gray-200 bg-gray-50">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-100">
          <h3 className="text-lg font-semibold">AI Code Generator</h3>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ChatHistory messages={messages} />
        </div>
        
        {/* Input Form */}
        <ChatInput 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isGenerating={currentlyGenerating !== null}
        />
        {error && <p className="text-red-500 mt-2 text-sm p-4">{error}</p>}
      </div>

      {/* IDE Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* IDE Header with actions */}
        <div className="bg-gray-100 border-b border-gray-200 p-2 flex justify-between items-center">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm font-medium">Project Files</div>
            <div className="flex gap-2">
              {filesToGenerate.length > 0 && (
                <Button 
                  onClick={generateAllFiles}
                  disabled={isLoading || currentlyGenerating !== null}
                  size="sm"
                  variant="outline"
                >
                  Generate All Files
                </Button>
              )}
              {Object.keys(generatedFiles).length > 0 && (
                <Button 
                  onClick={handleStartPreview}
                  disabled={!webcontainerReady}
                  size="sm"
                  variant="outline"
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Run Preview
                </Button>
              )}
            </div>
          </div>
        </div>
      
        {/* IDE Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* File Explorer */}
          <div className="w-1/5 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <FileExplorer
              files={filesToGenerate}
              generatedFiles={generatedFiles}
              selectedFile={selectedFile}
              currentlyGenerating={currentlyGenerating}
              onFileSelect={handleFileSelect}
            />
          </div>
          
          {/* Code Editor & Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
              <div className="border-b border-gray-200 bg-gray-100">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="code" className="data-[state=active]:bg-white">
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className="data-[state=active]:bg-white"
                    disabled={!previewUrl}
                  >
                    Live Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Code Editor Tab */}
              <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col mt-0 border-none p-0">
                <CodeEditor
                  selectedFile={selectedFile}
                  generatedFiles={generatedFiles}
                  currentlyGenerating={currentlyGenerating}
                  onRegenerateFile={generateFile}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              {/* Preview Tab */}
              <TabsContent value="preview" className="flex-1 overflow-hidden flex flex-col mt-0 border-none p-0">
                <Preview
                  previewUrl={previewUrl}
                  previewLoading={previewLoading}
                  previewError={previewError}
                  onRefresh={handleRefreshPreview}
                  onStartPreview={handleStartPreview}
                  hasGeneratedFiles={Object.keys(generatedFiles).length > 0}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
