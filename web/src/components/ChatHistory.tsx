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
      className=" bg-gray-50 overflow-y-auto h-[calc(100vh-41px)] absolute w-72 top-[40px] left-0 p-4 rounded-r-3xl border-[1px]"
      style={{ scrollbarWidth: "thin" }}
      onMouseLeave={() => isChat.toggleChats()}
    >
      <h3 className="font-semibold mb-2 text-center text-xl">Messages</h3>
      {messages?.length === 0 && (
        <p className="text-gray-500">No messages yet</p>
      )}
      {messages?.map((msg:any, index:number) => (
        <div
          key={index}
          className={`py-2 px-4 my-1 cursor-pointer rounded-md ${
            selectedMessage === msg ? "bg-white" : "hover:bg-gray-300"
          }`}
          onClick={() => setSelectedMessage(msg)}
        >
          {msg.role === "user" ? "You" : "AI"}: {msg.content?.substring(0, 40)}
          ...
        </div>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatHistory;