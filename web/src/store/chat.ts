import { create, StoreApi } from 'zustand';
import { streamChat } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  currentStreamedContent: string;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  updateStreamedContent: (content: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  sendMessage: (content: string, userId: string) => Promise<void>;
}

type SetState = StoreApi<ChatState>['setState'];
type GetState = StoreApi<ChatState>['getState'];

export const useChatStore = create<ChatState>((set: SetState, get: GetState) => ({
  messages: [],
  isStreaming: false,
  currentStreamedContent: '',

  addMessage: (content: string, role: 'user' | 'assistant') => {
    const message: Message = {
      id: crypto.randomUUID(),
      content,
      role,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...(state as ChatState).messages, message],
      currentStreamedContent: '',
    }));
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
    const { addMessage, setIsStreaming, updateStreamedContent } = get();
    
    try {
      // Add user message immediately
      addMessage(content, 'user');
      setIsStreaming(true);
      
      // Start streaming the assistant's response
      for await (const chunk of streamChat(content, userId)) {
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
