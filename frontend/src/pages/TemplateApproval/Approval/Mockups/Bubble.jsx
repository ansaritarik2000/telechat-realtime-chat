import React from "react";

export default function ChatBubble({ message }) {
  return (
    <div>
      <div className="flex justify-start px-3 py-4 items-start">
        <div className="max-w-xs mx-auto relative">
          <div className="bg-gray-300 text-gray-800 shadow-lg p-2 mr-3 rounded-lg relative">
            <span className="block text-xs">{message}</span>
            <div className="absolute w-4 h-4 bg-gray-300 transform rotate-45 -mb-1 ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
