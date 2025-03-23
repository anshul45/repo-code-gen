"use client";

import React from "react";
import { parseAnsi } from "@/lib/ansi";

interface TerminalProps {
  output: string[];
  command: string;
  onCommandChange: (cmd: string) => void;
  onCommandSubmit: (cmd: string) => void;
  onClear: () => void; 
}

const Terminal = ({
  output,
  command,
  onCommandChange,
  onCommandSubmit,
  onClear,
}: TerminalProps) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      if (command.trim() === "clear") {
        onClear(); 
      } else {
        onCommandSubmit(command);
      }
    }
  };


  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="bg-black text-green-400 font-mono text-sm p-4  h-32 flex flex-col rounded-b-xl">
      <div className="flex-1 overflow-y-auto mb-2 text-xs">
        {output.map((line, idx) => (
          <div
            key={idx}
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: parseAnsi(line) }}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-white mr-2">$</span>
        <input
          value={command}
          onChange={(e) => onCommandChange(e.target.value)}
          className="bg-transparent outline-none flex-1 text-white caret-green-500"
          placeholder="Type a command..."
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;