import React, { useRef, ChangeEvent, FormEvent } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

interface InputBoxProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const InputBox: React.FC<InputBoxProps> = ({ input, setInput, isLoading, handleSubmit }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = (): void => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (handleSubmit) {
        handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-end gap-2 bg-white dark:bg-gray-800"
    >
      <Textarea
        ref={textareaRef}
        value={input}
        onInput={handleInput}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        rows={1}
        placeholder="Type your message..."
        className="flex-1 resize-none overflow-hidden focus:outline-none focus:ring-0 border-none shadow-none bg-transparent dark:bg-transparent dark:text-white"
        style={{
          maxHeight: '150px', // Limit the maximum height of the textarea
        }}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="p-2 rounded-full bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
        disabled={isLoading || !input.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default InputBox;