"use client";
import React from "react";
import { useChatStore } from "@/store/toggle";

const Sidebar = () => {
  const isChat = useChatStore();
  return (
    <div
      className={` w-full h-[calc(100vh-45px)] flex align-bottom bg-gray-200 `}
      onMouseEnter={() => isChat.toggleChats()}
    >
      <div>.</div>
    </div>
  );
};

export default Sidebar;