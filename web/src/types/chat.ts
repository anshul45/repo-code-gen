export interface ChatMessage {
  role: 'assistant' | 'user' | 'tool';
  content: string;
  type?: string;
  status?: 'pending' | 'generating' | 'completed' | 'error';
  output?: string;
  tool_call_id?: string;
  name?: string;
  agent_name?: string;
  currentFile?: string;
  generatedFiles?: { [key: string]: string };
  isNew?: boolean;
}

export type SetSelectedMessageType = (messageOrUpdater: ((prev: ChatMessage | null) => ChatMessage | null) | ChatMessage | null) => void;

export interface FileDescription {
  file_path: string;
  description: string;
}

export interface ApiResponse {
  result: {
    type: string;
    content: string;
  }[];
  error?: string;
}

export interface FileNode {
  file?: { contents: string };
  directory?: Record<string, FileNode>;
}

export type FileValue = {
  contents: string;
} & Record<string, unknown>;

export interface CodeResult {
  type: string;
  content: string;
}

export interface ToolMessageProps {
  message: FileDescription[];
  setSelectedMessage: SetSelectedMessageType;
  setActiveFile?: (file: { content: string; path: string; isNew: boolean }) => void;
  userId: string;
}
