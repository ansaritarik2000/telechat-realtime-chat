import React from "react";
import EmojiPicker from "emoji-picker-react";

export default function EmojiPickerIndex() {
  const [message, setMessage] = React.useState("");

  const handleEmojiSelect = (emojiData, event) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <EmojiPicker onEmojiClick={handleEmojiSelect} />
    </div>
  );
}
