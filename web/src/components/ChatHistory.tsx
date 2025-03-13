import React from 'react'

const ChatHistory = ({messages,selectedMessage,setSelectedMessage,scrollRef}:any) => {
  return (
    <div className="w-1/5 bg-gray-200 p-4 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
    <h3 className="text-lg font-semibold mb-2">Messages</h3>
    {messages?.length === 0 && <p className="text-gray-500">No messages yet</p>}
    {messages?.map((msg, index) => (
      <div
        key={index}
        className={`p-2 cuiframeRefrsor-pointer ${selectedMessage === msg ? 'bg-blue-300' : 'hover:bg-gray-300'}`}
        onClick={() => setSelectedMessage(msg)}
      >
        {msg.role === 'user' ? 'You' : 'AI'}: {msg.content?.substring(0, 30)}...
      </div>
    ))}
    <div ref={scrollRef} />
  </div>
  )
}

export default ChatHistory