import React, { useRef, ChangeEvent, FormEvent } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

const InputBox: React.FC = ({ input, setInput, isLoading, handleSubmit }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = (event: FormEvent<HTMLTextAreaElement>): void => {
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
        handleSubmit(event); 
      }
    }
  };

  return (
    <div className='border-[1px] rounded-md flex absolute bottom-3  bg-white w-[383px]'>
      <Textarea
        ref={textareaRef}
        value={input}
        onInput={handleInput}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
        onKeyDown={handleKeyPress} 
        rows={5}
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
        className="w-full resize-none overflow-hidden focus:outline-none focus:border-none active:border-none border-none shadow-none"
      />
      {input ? (
        <Button
          variant="secondary"
          style={{ backgroundColor: 'black', color: 'white', marginTop: "12px", marginRight: "8px" }}
          onClick={(e) => handleSubmit(e)} 
          disabled={isLoading} 
        >
          <Send />
        </Button>
      ) : (
        <div className='mx-[28px]'></div>
      )}
    </div>
  );
};

export default InputBox;
