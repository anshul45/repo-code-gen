/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjectStore } from "@/store/projectStore";
import { Loader2 } from "lucide-react";
import {
  FileDescription,
  ApiResponse,
  FileNode,
  FileValue,
  CodeResult,
  ToolMessageProps,
  ChatMessage,
} from "@/types/chat";

type FileContent = {
  file: {
    contents: string;
  };
};

type DirectoryContent = {
  directory: {
    [key: string]: FileContent | DirectoryContent;
  };
};

interface PreviewFilesProps {
  file: FileDescription;
  isGenerating: boolean;
  isChecked: boolean;
}

const ToolMessage = ({
  message,
  setSelectedMessage,
  setActiveFile,
  userId,
}: ToolMessageProps) => {
  const [currentGeneratingFile, setCurrentGeneratingFile] = useState<
    string | null
  >(null);
  const { addFile, updateMountFile, projectId, getFile } = useProjectStore();
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedFiles, setGeneratedFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const appendTerminal = (msg: string) => {
    setTerminalOutput((prev) => [...prev, msg]);
    // Also log to console for debugging
    console.log(msg);
  };

  const generateCode = async () => {
    try {
      setGenerating(true);

      setSelectedMessage((prev: ChatMessage | null) =>
        prev
          ? {
              ...prev,
              generatedFiles: prev.generatedFiles || {},
            }
          : null
      );

      for (const file of message) {
        setCurrentGeneratingFile(file.file_path);

        setSelectedMessage((prev: ChatMessage | null) =>
          prev
            ? {
                ...prev,
                status: "generating",
                currentFile: file.file_path,
              }
            : null
        );

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Generate ${file.file_path} , Description ${file.description}. 
Important: Ensure the following for React/TypeScript components:
1. Use proper import paths with @/ prefix (e.g., '@/components/ui/button')
2. Use proper TypeScript types and interfaces
3. Follow React best practices and patterns`,
            user_id: userId,
            intent: "code",
            project_id: projectId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate ${file.file_path}`);
        }

        const data: ApiResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const code = data?.result?.filter(
          (item: CodeResult) => item.type === "code"
        );

        function extractPathAndContent(
          obj: Record<string, unknown>,
          currentPath = ""
        ): { path: string; contents: string }[] {
          const result: { path: string; contents: string }[] = [];

          for (const key in obj) {
            const value = obj[key];

            if (key === "file" && typeof value === "object" && value !== null) {
              console.log(key, currentPath, value);
              const fileValue = value as FileValue;
              if (fileValue.contents !== undefined) {
                result.push({
                  path: currentPath,
                  contents: fileValue.contents,
                });
              }
            } else if (typeof value === "object" && value !== null) {
              console.log(key, currentPath, value);
              const newPath =
                key === "directory"
                  ? currentPath
                  : currentPath
                  ? `${currentPath}/${key}`
                  : key;
              result.push(
                ...extractPathAndContent(
                  value as Record<string, unknown>,
                  newPath
                )
              );
            }
          }

          return result;
        }

        let latestCode = code[code.length - 1]?.content;

        if (!latestCode) {
          appendTerminal("❌ No code generated\n");
          appendTerminal("🔄 Retrying code generation...\n");

          // Retry the request
          const retryResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Generate ${file.file_path} , Description ${file.description}. 
Important: Ensure the following for React/TypeScript components:
1. Use proper import paths with @/ prefix (e.g., '@/components/ui/button')
3. Use proper TypeScript types and interfaces
4. Follow React best practices and patterns
Please ensure code is generated properly.`,
              user_id: userId,
              intent: "code",
              project_id: projectId,
            }),
          });

          if (!retryResponse.ok) {
            throw new Error(`Failed to generate ${file.file_path} on retry`);
          }

          const retryData: ApiResponse = await retryResponse.json();
          const retryCode = retryData?.result?.filter(
            (item: CodeResult) => item.type === "code"
          );
          const retryLatestCode = retryCode[retryCode.length - 1]?.content;

          if (!retryLatestCode) {
            appendTerminal("❌ Failed to generate code even after retry\n");
            throw new Error("No code generated even after retry");
          }

          latestCode = retryLatestCode;
        }

        let parsedCode;
        console.log("latestCode", latestCode);
        try {
          if (typeof data === "string") {
            try {
              parsedCode = JSON.parse(latestCode);
            } catch (e) {
              console.error("Invalid JSON string:", e);
              return null;
            }
          } else {
            parsedCode = latestCode;
          }
        } catch (error) {
          console.error("Error parsing generated code:", error);
          appendTerminal("❌ Generated code is not in valid JSON format\n");
          appendTerminal("🔄 Retrying code generation...\n");

          // Retry the request once
          const retryResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `Generate ${file.file_path} , Description ${file.description}. 
Important: Ensure the following for React/TypeScript components:
1. Use proper import paths with @/ prefix (e.g., '@/components/ui/button')
3. Use proper TypeScript types and interfaces
4. Follow React best practices and patterns
Please ensure the response is valid JSON.`,
              user_id: userId,
              intent: "code",
              project_id: projectId,
            }),
          });

          if (!retryResponse.ok) {
            throw new Error(`Failed to generate ${file.file_path} on retry`);
          }

          const retryData: ApiResponse = await retryResponse.json();
          const retryCode = retryData?.result?.filter(
            (item: CodeResult) => item.type === "code"
          );
          const retryLatestCode = retryCode[retryCode.length - 1]?.content;

          if (!retryLatestCode) {
            throw new Error("No code generated on retry");
          }

          try {
            parsedCode = JSON.parse(retryLatestCode);
          } catch (error) {
            appendTerminal(
              "❌ Failed to generate valid code even after retry\n"
            );
            throw new Error("Failed to parse generated code even after retry");
          }
        }

        try {
          updateMountFile(JSON.stringify(parsedCode));
          const updatedData = extractPathAndContent(parsedCode);

          const filePath = updatedData[0]?.path;
          let fileContent = updatedData[0]?.contents;

          console.log("filePath", filePath);
          console.log("fileContent", fileContent);

          if (!filePath || !fileContent) {
            appendTerminal(
              "❌ Generated code is missing required file information\n"
            );
            throw new Error("Generated code is missing path or content");
          }

          // Ensure UI components are mounted first
          if (
            filePath.includes("components/") &&
            !filePath.includes("components/ui/")
          ) {
            // Add UI components first if they don't exist
            const requiredComponents = ["button", "input"];
            for (const comp of requiredComponents) {
              const uiPath = `src/components/ui/${comp}.tsx`;
              if (!getFile(uiPath)) {
                appendTerminal(
                  `⚠️ Required UI component ${comp} not found - will need to be created separately\n`
                );
              }
            }
          }

          // Ensure proper import paths
          if (typeof fileContent === "string") {
            // Fix component imports
            fileContent = fileContent.replace(
              /from ['"]components\//g,
              'from "@/components/'
            );
            fileContent = fileContent.replace(
              /from ['"]lib\//g,
              'from "@/lib/'
            );
            fileContent = fileContent.replace(
              /from ['"]hooks\//g,
              'from "@/hooks/'
            );

            // Fix data file imports with various patterns
            fileContent = fileContent.replace(
              /from ['"]data\//g,
              'from "@/app/data/'
            );
            fileContent = fileContent.replace(
              /from ['"](\.\.\/)+data\//g,
              'from "@/app/data/'
            );
            fileContent = fileContent.replace(
              /from ['"]\.\/data\//g,
              'from "@/app/data/'
            );
            fileContent = fileContent.replace(
              /from ['"]tasks\.['"]/g,
              'from "@/app/data/tasks"'
            );

            // Fix direct imports of data files
            fileContent = fileContent.replace(
              /import\s+(\w+)\s+from\s+['"]data\//g,
              'import $1 from "@/app/data/'
            );
            fileContent = fileContent.replace(
              /import\s+(\w+)\s+from\s+['"](\.\.\/)+data\//g,
              'import $1 from "@/app/data/'
            );
            fileContent = fileContent.replace(
              /import\s+(\w+)\s+from\s+['"]\.\/data\//g,
              'import $1 from "@/app/data/'
            );
            fileContent = fileContent.replace(
              /import\s+(\w+)\s+from\s+['"]tasks\.['"]/g,
              'import $1 from "@/app/data/tasks"'
            );

            // Clean up any malformed paths
            fileContent = fileContent.replace(
              /['"]\.?\.?\/tasks\.['"]/g,
              '"@/app/data/tasks"'
            );
            fileContent = fileContent.replace(
              /['"]\.*\/data\/tasks\.['"]/g,
              '"@/app/data/tasks"'
            );

            // Remove .json extension from imports if present
            fileContent = fileContent.replace(
              /from ['"]@\/app\/data\/([^'"]+)\.json['"]/g,
              'from "@/app/data/$1"'
            );
          } else {
            appendTerminal("❌ Generated code content is not a string\n");
          }

          // Ensure 'use client' directive for client components
          if (
            filePath.endsWith(".tsx") &&
            !fileContent.includes("use client")
          ) {
            fileContent = "'use client';\n\n" + fileContent;
          }

          // Add utils if needed
          if (fileContent.includes("@/lib/utils")) {
            const utilsPath = "src/lib/utils.ts";
            if (!getFile(utilsPath)) {
              appendTerminal(
                `⚠️ Utils library not found - generating placeholder\n`
              );
              const basicUtilsContent = `
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
`.trim();
              addFile(utilsPath, basicUtilsContent);
            }
          }

          addFile(filePath, fileContent);

          // Automatically select and show the newly generated file
          if (setActiveFile) {
            setActiveFile({
              path: filePath,
              content: fileContent,
              isNew: true,
            });
          }

          appendTerminal(`✅ Successfully generated ${filePath}\n`);
        } catch (error) {
          console.error("Error processing generated code:", error);
          appendTerminal(
            `❌ Error processing generated code: ${
              error instanceof Error ? error.message : "Unknown error"
            }\n`
          );
          throw error;
        }

        // Mark the file as generated (checked)
        setGeneratedFiles((prev) => ({ ...prev, [file.file_path]: true }));

        setSelectedMessage((prev: ChatMessage | null) => {
          if (!prev) return null;

          const newGeneratedFiles = {
            ...prev.generatedFiles,
            [file.file_path]:
              data.result[0]?.content || `Generated ${file.file_path}`,
          };

          return {
            ...prev,
            status: "completed",
            generatedFiles: newGeneratedFiles,
          };
        });

        setCurrentGeneratingFile(null);
      }
    } catch (error) {
      console.error("Error generating files:", error);
      setSelectedMessage((prev: ChatMessage | null) =>
        prev
          ? {
              ...prev,
              status: "error",
            }
          : null
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-5 border-[1px] rounded-md text-sm bg-gray-100 max-w-full">
      <div className="bg-white border-[1px] rounded-sm">
        <div className="border-b-2 p-3 text-[15px] font-semibold">
          Files to be Created.
        </div>
        {message &&
          message.length > 0 &&
          message.map((file, idx) => (
            <PreviewFiles
              key={idx}
              file={file}
              isGenerating={currentGeneratingFile === file.file_path}
              isChecked={generatedFiles[file.file_path] || false}
            />
          ))}
      </div>
      <div className="mt-3">
        {/* Terminal output */}
        {terminalOutput.length > 0 && (
          <div className="mb-3 p-2 bg-black text-white rounded text-xs font-mono max-h-32 overflow-y-auto">
            {terminalOutput.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}

        <Button
          onClick={generateCode}
          className="w-full"
          style={{ backgroundColor: "black", color: "white" }}
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
};

const PreviewFiles = ({ file, isGenerating, isChecked }: PreviewFilesProps) => {
  return (
    <div className="p-3 flex items-center gap-2">
      {isGenerating ? (
        <Loader2 className="animate-spin w-4 h-4 text-blue-500" />
      ) : (
        <Checkbox checked={isChecked} />
      )}
      <div className="font-semibold text-xs flex items-center gap-2">
        {file.file_path}
      </div>
    </div>
  );
};

export default ToolMessage;
