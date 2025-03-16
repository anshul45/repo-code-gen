"use client";
import React from "react";
import { useChatStore } from "@/store/toggle";

const Sidebar = () => {
  const {toggleChats} = useChatStore();
  return (
    <div
      className={`w-full h-[calc(100vh-41px)] flex align-bottom bg-gray-50`}
      onMouseEnter={() => toggleChats()}
    >
      <div>.</div>
    </div>
  );
};

export default Sidebar;