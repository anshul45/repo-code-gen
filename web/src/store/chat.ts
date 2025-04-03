import { create, StoreApi } from 'zustand';
import { streamChat } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'tool';
  type?: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  currentStreamedContent: string;
  projectId: string | null;
  projectName: string | null;
  addMessage: (content: string, role: 'user' | 'assistant' | 'tool', type?: string) => void;
  updateStreamedContent: (content: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  sendMessage: (content: string, userId: string) => Promise<void>;
  setProject: (projectId: string, projectName: string) => void;
}

type SetState = StoreApi<ChatState>['setState'];
type GetState = StoreApi<ChatState>['getState'];

export const useChatStore = create<ChatState>((set: SetState, get: GetState) => ({
  messages: [],
  isStreaming: false,
  currentStreamedContent: '',
  projectId: null,
  projectName: null,

  setProject: (projectId: string, projectName: string) => {
    set({ projectId, projectName });
  },

  addMessage: (content: string, role: 'user' | 'assistant' | 'tool', type?: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      content,
      role,
      type,
      timestamp: new Date(),
    };
    console.log("Adding message to chat store:", message);
    set((state) => {
      const newState = {
        messages: [...state.messages, message],
        currentStreamedContent: '',
      };
      console.log("New chat store state:", newState);
      return newState;
    });
  },

  updateStreamedContent: (content: string) => {
    set((state) => ({
      currentStreamedContent: (state as ChatState).currentStreamedContent + content,
    }));
  },

  setIsStreaming: (isStreaming: boolean) => {
    set({ isStreaming });
  },

  sendMessage: async (content: string, userId: string) => {
    const { addMessage, setIsStreaming, updateStreamedContent, projectId } = get();
    
    try {
      // Add user message immediately
      addMessage(content, 'user');
      setIsStreaming(true);
      
      // Start streaming the assistant's response
      for await (const chunk of streamChat(content, userId, projectId || undefined)) {
        updateStreamedContent(chunk);
      }
      
      // Add the complete assistant message
      const { currentStreamedContent } = get();
      addMessage(currentStreamedContent, 'assistant');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('An error occurred while processing your message.', 'assistant');
    } finally {
      setIsStreaming(false);
    }
  },
}));
