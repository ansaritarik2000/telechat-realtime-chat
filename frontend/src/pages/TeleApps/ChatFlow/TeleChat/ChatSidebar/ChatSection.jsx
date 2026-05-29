import React, { useContext, useState, useRef, useEffect } from "react";
import { TeleChatContext } from "../ChatBody";
import {
  Avatar,
  Input,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import RightBarSection from "./RightBar";
import { io } from "socket.io-client";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import EmojiPickerIndex from "../../../../../components/Common/EmojiPicker/Index";
import EmojiPicker from "emoji-picker-react";

export default function ChatSection(props) {
  const { setRightBar, isRightBarVisible, setRightBarVisible } =
    useContext(TeleChatContext);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const pickerRef = useRef(null);
  const chatEndRef = useRef(null);
  const socket = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [roomId, setRoomId] = useState();
  const { title, number, avatarURL, badgeCol, user_id, avatar } = props;
  const loginUserId = localStorage.getItem("loginUser_id");
  const [reactions, setReactions] = useState({});
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    console.log("user_id:", user_id);
    console.log("loginUserId:", loginUserId);

    // 🛑 Guard clause: Stop if user IDs are not valid
    if (!user_id || !loginUserId || isNaN(user_id) || isNaN(loginUserId)) {
      return;
    }

    // 🔌 Initialize socket connection only once
    if (!socket.current) {
      socket.current = io("http://localhost:3005");
    }

    // 🚪 Emit joinRoom event with sender and receiver IDs
    socket.current.emit("joinRoom", {
      sender: +loginUserId,
      receiver: +user_id,
    });

    // ✅ Once joined, set roomId and fetch existing messages
    socket.current.on("joinedRoom", (roomId) => {
      setRoomId(roomId);
      socket.current.emit("getMessages", { roomId });
    });

    // 📥 On receiving messages (initial load)
    socket.current.on("receiveMessages", (messages) => {
      const formatted = messages.map((msg) => ({
        ...msg,
        sender: msg.sender === +loginUserId ? "You" : "Other",
        status: "sent",
      }));
      setMessages(formatted);
    });

    // 📩 On receiving a new single message
    socket.current.on("receiveMessage", (msg) => {
      const isFromOtherUser = msg.sender === +user_id;
      const isFromYou = msg.sender === +loginUserId;
      const isCurrentRoom = msg.roomId === roomId;

      if (isCurrentRoom) {
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            sender: isFromYou ? "You" : "Other",
            status: isFromYou ? "sent" : "read",
          },
        ]);
      }
    });

    // 🧹 Clean up listeners when component unmounts or dependencies change
    return () => {
      socket.current.off("joinedRoom");
      // socket.current.off("receiveMessages");
      // socket.current.off("receiveMessage");
    };
  }, [loginUserId, user_id]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        sender: +loginUserId,
        receiver: +user_id,
        message,
        roomId, // ✅ Add this line
        created_at: new Date().toISOString(),
      };

      socket.current.emit("sendMessage", messageData);

      // setMessages((prev) => [...prev, { ...messageData, sender: "You" }]);
      setMessage("");
    }
  };

  // Handle adding reactions
  const handleReaction = (messageId, emoji) => {
    setReactions((prev) => ({
      ...prev,
      [messageId]: emoji,
    }));
  };

  // Handle reply
  const handleReply = (messageId) => {
    setReplyTo(messages.find((msg) => msg.messageId === messageId));
  };

  const handleTyping = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    if (inputValue.trim() && roomId) {
      socket.current.emit("typing", { senderId: loginUserId, roomId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit("stopTyping", {
          senderId: loginUserId,
          roomId,
        });
      }, 3000);
    } else {
      socket.current.emit("stopTyping", {
        senderId: loginUserId,
        roomId,
      });
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleRightBar = () => {
    if (isRightBarVisible) {
      setRightBar(null);
    } else {
      setRightBar(<RightBarSection pfp={avatarURL} name={title} />);
    }
    setRightBarVisible(!isRightBarVisible);
    setIsPickerVisible(false);
  };

  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setIsPickerVisible(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const imageData = {
        sender: +loginUserId,
        receiver: +user_id,
        message: reader.result, // Base64 image data
        created_at: new Date().toLocaleString(),
        type: "image",
      };

      socket.current.emit("sendMessage", imageData);

      setMessages((prev) => [...prev, { ...imageData, sender: "You" }]);
    };
  };

  const groupedMessages = Object.entries(
    messages.reduce((groups, msg) => {
      const date = new Date(msg.created_at).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {}),
  );

  const formatDate = (dateString) => {
    const today = new Date();
    const messageDate = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-background flex-1 flex justify-between flex-col rounded-2xl w-fit overflow-y-auto relative">
      {/* Header */}
      <div className="h-fit px-4 py-4 flex justify-between items-center w-full bg-default-100 rounded-tr-xl rounded-tl-xl sticky top-0 z-10">
        <div className="flex items-center justify-center gap-2">
          <Badge
            content=""
            color={badgeCol}
            size="sm"
            shape="circle"
            placement="bottom-right"
          >
            {avatar}
          </Badge>
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-sm text-default-800">{title}</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 text-default-600">
          <Icon
            icon="uil:video"
            width="1.9em"
            height="1.9em"
            className="cursor-pointer"
          />
          <Icon
            icon="mi:call"
            width="1.5em"
            height="1.5em"
            className="cursor-pointer"
          />
          <Icon
            icon={
              isRightBarVisible ? "ri:skip-right-line" : "ri:skip-left-line"
            }
            width="1.5em"
            height="1.5em"
            className="cursor-pointer"
            onClick={toggleRightBar}
          />
        </div>
      </div>

      {/* Chat Bubbles */}
      <div className="flex-1 py-2">
        <div className="flex flex-col justify-end h-full">
          {groupedMessages.map(([date, msgs], groupIndex) => (
            <div key={groupIndex}>
              <div className="flex justify-center py-2 pt-6">
                <span className="text-xs bg-primary-100 text-gray px-3 py-1 rounded-full">
                  {formatDate(date)}
                </span>
              </div>

              {msgs.map((msg, index) => (
                <div
                  key={index}
                  className={`relative px-4 flex items-center ${
                    msg.sender === "You" ? "justify-end" : "flex-row"
                  }`}
                >
                  {/* Message Box */}
                  <div className="flex flex-col gap-1 max-w-xs">
                    {msg.type === "image" ? (
                      <img
                        src={msg.message}
                        alt="Sent Image"
                        className="max-w-[200px] rounded-lg shadow-md"
                      />
                    ) : msg.type === "file" ? (
                      <a
                        href={msg.message}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Download File
                      </a>
                    ) : (
                      <span
                        className={`px-3 py-2 text-sm rounded-lg w-fit ${
                          msg.sender === "You"
                            ? "bg-success-100"
                            : "bg-primary-100"
                        }`}
                      >
                        {msg.message}
                      </span>
                    )}

                    {/* Timestamp and Read Receipts */}
                    <div className="text-[10px] text-default-400 flex items-center gap-1 self-center">
                      {new Date(msg.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                      {msg.sender === "You" &&
                        (msg.status === "read" ? (
                          <Icon
                            icon="mdi:check-all"
                            className="text-primary-500"
                            title="Read"
                          />
                        ) : (
                          <Icon
                            icon="mdi:check"
                            className="text-default-400"
                            title="Sent"
                          />
                        ))}
                    </div>
                  </div>

                  {/* Reaction and Message Actions - For Received Messages (Right Side) */}
                  {msg.sender !== "You" && (
                    <div className="flex-col items-center gap-1 ml-1">
                      {reactions[msg.messageId] && (
                        <span className="text-lg">
                          {reactions[msg.messageId]}
                        </span>
                      )}
                      <Icon
                        icon="mdi:emoji-happy-outline"
                        className="cursor-pointer"
                        onClick={() => handleReaction(msg.messageId, "👍")}
                      />
                      <Popover placement="bottom-end" showArrow>
                        <PopoverTrigger>
                          <button>
                            <Icon
                              icon="mdi:dots-vertical"
                              className="cursor-pointer text-lg"
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-white shadow-md rounded-lg p-1">
                          <p
                            className="cursor-pointer text-sm hover:bg-gray-100 px-3 py-1 rounded-md"
                            onClick={() => handleReply(msg.messageId)}
                          >
                            Reply
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Typing Indicator */}
          {otherUserTyping && (
            <div className="flex items-center gap-1 px-4">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-[400ms]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-[800ms]"></span>
            </div>
          )}

          {/* Auto-scroll to the latest message */}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Send Message */}
      <div className="flex justify-between items-center px-3 py-2 w-full sticky bottom-0 bg-content2">
        <div className="flex justify-center items-center flex-1 gap-1 relative">
          {/* Emoji Picker */}
          <Icon
            icon="fluent:emoji-16-regular"
            width="2em"
            height="2em"
            className="cursor-pointer"
            onClick={togglePicker}
          />
          {isPickerVisible && (
            <div
              ref={pickerRef}
              className="absolute bottom-full mb-2 left-0 z-10"
              style={{ transform: "translateY(-10px)" }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                // reactionsDefaultOpen={true}
              />
            </div>
          )}

          {/* Photo/Video Upload */}
          <input
            type="file"
            accept="image/*,video/*"
            id="imageUpload"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Icon
            icon="pajamas:media"
            width="1.7em"
            height="1.7em"
            className="cursor-pointer"
            onClick={() => document.getElementById("imageUpload").click()}
          />

          {/* Dropdown for File & Location */}
          <Dropdown size="sm">
            <DropdownTrigger>
              <Icon
                icon="ph:paperclip"
                width="1.7em"
                height="1.7em"
                className="cursor-pointer"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Attachment options">
              <DropdownItem
                startContent={
                  <Icon icon="pajamas:media" width="1.2em" height="1.2em" />
                }
                onPress={handleImageUpload}
              >
                Photo or Video
              </DropdownItem>
              <DropdownItem
                startContent={
                  <Icon icon="ph:file-bold" width="1.2em" height="1.2em" />
                }
                onPress={""}
              >
                File
              </DropdownItem>
              <DropdownItem
                startContent={
                  <Icon icon="mdi:location" width="1.2em" height="1.2em" />
                }
                onPress={""}
              >
                Location
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* File Upload Input (Hidden) */}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            id="fileUpload"
            className="hidden"
            onChange={""}
          />

          {/* Message Input */}
          <Input
            value={message}
            onChange={handleTyping}
            placeholder="Type your message here ..."
            className="w-full"
            color="none"
            radius="sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim() !== "") sendMessage();
            }}
            endContent={
              <Icon
                icon="tabler:send"
                width="1.5em"
                height="1.5em"
                className="cursor-pointer"
                onClick={sendMessage}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
