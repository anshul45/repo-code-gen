import React from "react";
import { useChatStore } from "@/store/toggle";

const ChatHistory = ({
  messages,
  selectedMessage,
  setSelectedMessage,
  scrollRef,
}: any) => {
  const isChat = useChatStore();
  return (
    <div
      className=" bg-gray-200 p-4 overflow-y-auto h-[92.6vh] absolute w-56"
      style={{ scrollbarWidth: "thin" }}
      onMouseLeave={() => isChat.toggleChats()}
    >
      <h3 className="text-lg font-semibold mb-2">Messages</h3>
      {messages?.length === 0 && (
        <p className="text-gray-500">No messages yet</p>
      )}
      {messages?.map((msg:any, index:number) => (
        <div
          key={index}
          className={`p-2 cuiframeRefrsor-pointer ${
            selectedMessage === msg ? "bg-blue-300" : "hover:bg-gray-300"
          }`}
          onClick={() => setSelectedMessage(msg)}
        >
          {msg.role === "user" ? "You" : "AI"}: {msg.content?.substring(0, 30)}
          ...
        </div>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatHistory;