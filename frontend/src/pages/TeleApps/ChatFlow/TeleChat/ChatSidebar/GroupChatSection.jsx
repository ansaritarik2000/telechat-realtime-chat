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

export default function GroupChatSection(props) {
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
  const { title, number, avatarURL, badgeCol, user_id, avatar, groupId } =
    props;
  const loginUserId = localStorage.getItem("loginUser_id");
  const [input, setInput] = useState("");
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // console.log("groupId:", groupId);
    // console.log("loginUserId:", loginUserId);

    if (!groupId || !loginUserId) return;

    if (!socket.current) {
      socket.current = io("http://localhost:3008");
    }

    socket.current.emit("joinGroup", { groupId, userId: loginUserId });

    socket.current.on("groupMessages", (msgs) => {
      // console.log("Received messages:", msgs); // Debug log
      setMessages(msgs);
    });

    socket.current.on("newGroupMessage", (message) => {
      // console.log("New message received:", message);// Debug log
      setMessages((prev) => [...prev, message]);
    });

    // Typing indicators
    socket.current.on("userTyping", ({ senderId }) => {
      if (senderId !== loginUserId) {
        setOtherUserTyping(true);
      }
    });

    socket.current.on("userStoppedTyping", ({ senderId }) => {
      if (senderId !== loginUserId) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      socket.current.off("groupMessages");
      socket.current.off("newGroupMessage");
      socket.current.off("userTyping");
      socket.current.off("userStoppedTyping");
    };
  }, [groupId, loginUserId]);

  const sendMessage = () => {
    if (!socket.current) return;
    if (message.trim() === "") return;

    const messageData = {
      groupId,
      senderId: loginUserId,
      content: message,
      mediaUrl: null,
      timestamp: new Date().toISOString()
    };

    // Add message immediately to UI for better UX
    // const tempMessage = {
    //   id: Date.now(),
    //   sender_id: loginUserId,
    //   senderId: loginUserId,
    //   sender: "You",
    //   message: message,
    //   content: message,
    //   created_at: new Date().toISOString(),
    //   status: 'sending'
    // };
    
    // setMessages((prev) => [...prev, tempMessage]);
    
    socket.current.emit("sendGroupMessage", messageData);
    setMessage(""); // Clear input
  };

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

  const handleTyping = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    if (!socket.current) return;

    if (inputValue.trim() && groupId) {
      socket.current.emit("typing", { senderId: loginUserId, groupId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.current.emit("stopTyping", {
          senderId: loginUserId,
          groupId,
        });
      }, 3000);
    } else {
      socket.current.emit("stopTyping", {
        senderId: loginUserId,
        groupId,
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, msg) => {
      const date = new Date(msg.created_at).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (date.toDateString() === today) return "Today";
    if (date.toDateString() === yesterday) return "Yesterday";

    return date.toLocaleDateString();
  };

  // Function to determine if message is from current user
  const isMyMessage = (msg) => {
    // Check multiple possible fields for sender identification
    return (
      msg.sender_id === loginUserId || 
      msg.senderId === loginUserId ||
      msg.sender === "You" ||
      String(msg.sender_id) === String(loginUserId) ||
      String(msg.senderId) === String(loginUserId)
    );
  };

  return (
    <div className="bg-white dark:bg-background flex-1 flex justify-between flex-col rounded-2xl w-fit overflow-hidden relative">
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

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="flex flex-col gap-2 min-h-full">
          {/* Show loading if no messages */}
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-default-400 text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            /* Loop through each message grouped by date */
            Object.entries(groupMessagesByDate(messages)).map(
              ([date, msgs], groupIndex) => (
                <div key={groupIndex}>
                  {/* Date Separator */}
                  <div className="flex justify-center py-2 pt-6">
                    <span className="text-xs bg-primary-100 text-gray-600 px-3 py-1 rounded-full">
                      {formatDate(date)}
                    </span>
                  </div>

                  {/* Messages for this date */}
                  {msgs.map((msg, index) => {
                    const isMine = isMyMessage(msg);
                    
                    // Debug log to check message ownership
                    // console.log('Message:', msg, 'isMine:', isMine, 'loginUserId:', loginUserId);
                    
                    return (
                      <div
                        key={msg.id || index}
                        className={`px-4 py-1 flex ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Message Container */}
                        <div className={`flex flex-col gap-1 max-w-xs lg:max-w-md ${
                          isMine ? "items-end" : "items-start"
                        }`}>
                          {/* Sender Name (only for group messages from others) */}
                          {!isMine && (
                            <span className="text-xs text-default-500 px-2">
                              {msg.sender_name || msg.sender || "Unknown"}
                            </span>
                          )}
                          
                          {/* Message Content */}
                          {msg.type === "image" ? (
                            <img
                              src={msg.message || msg.content}
                              alt="Sent Image"
                              className="max-w-[200px] rounded-lg shadow-md"
                            />
                          ) : msg.type === "file" ? (
                            <a
                              href={msg.message || msg.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline p-3 bg-default-100 rounded-lg"
                            >
                              📎 Download File
                            </a>
                          ) : (
                            <div
                              className={`px-3 py-2 text-sm rounded-lg w-fit break-words ${
                                isMine
                                  ? "bg-primary-500 text-white rounded-br-sm"
                                  : "bg-default-200 text-default-800 rounded-bl-sm"
                              }`}
                            >
                              {msg.message || msg.content}
                            </div>
                          )}

                          {/* Timestamp and Status */}
                          <div className={`text-[10px] text-default-400 flex items-center gap-1 ${
                            isMine ? "flex-row-reverse" : "flex-row"
                          }`}>
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                            {isMine && (
                              <>
                                {msg.status === "read" ? (
                                  <Icon
                                    icon="mdi:check-all"
                                    className="text-primary-500"
                                    title="Read"
                                  />
                                ) : msg.status === "delivered" ? (
                                  <Icon
                                    icon="mdi:check-all"
                                    className="text-default-400"
                                    title="Delivered"
                                  />
                                ) : (
                                  <Icon
                                    icon="mdi:check"
                                    className="text-default-400"
                                    title="Sent"
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )
          )}

          {/* Typing Indicator */}
          {otherUserTyping && (
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
              <span className="text-xs text-default-400">Someone is typing...</span>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Message Input Section */}
      <div className="flex justify-between items-center px-3 py-3 w-full bg-content2 border-t border-default-200">
        <div className="flex justify-center items-center flex-1 gap-2 relative">
          {/* Emoji Picker */}
          <Icon
            icon="fluent:emoji-16-regular"
            width="2em"
            height="2em"
            className="cursor-pointer text-default-500 hover:text-default-700"
            onClick={togglePicker}
          />
          {isPickerVisible && (
            <div
              ref={pickerRef}
              className="absolute bottom-full mb-2 left-0 z-20"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                width={300}
                height={400}
              />
            </div>
          )}

          {/* Photo/Video Upload */}
          <input
            type="file"
            accept="image/*,video/*"
            id="imageUpload"
            className="hidden"
            // onChange={handleImageUpload}
          />
          <Icon
            icon="pajamas:media"
            width="1.7em"
            height="1.7em"
            className="cursor-pointer text-default-500 hover:text-default-700"
            onClick={() => document.getElementById("imageUpload").click()}
          />

          {/* Dropdown for File & Location */}
          <Dropdown size="sm">
            <DropdownTrigger>
              <Icon
                icon="ph:paperclip"
                width="1.7em"
                height="1.7em"
                className="cursor-pointer text-default-500 hover:text-default-700"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Attachment options">
              <DropdownItem
                startContent={
                  <Icon icon="pajamas:media" width="1.2em" height="1.2em" />
                }
              >
                Photo or Video
              </DropdownItem>
              <DropdownItem
                startContent={
                  <Icon icon="ph:file-bold" width="1.2em" height="1.2em" />
                }
              >
                File
              </DropdownItem>
              <DropdownItem
                startContent={
                  <Icon icon="mdi:location" width="1.2em" height="1.2em" />
                }
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
          />

          {/* Message Input */}
          <Input
            value={message}
            onChange={handleTyping}
            placeholder="Type your message here..."
            className="flex-1"
            color="default"
            radius="lg"
            size="md"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            endContent={
              message.trim() ? (
                <Icon
                  icon="tabler:send"
                  width="1.5em"
                  height="1.5em"
                  className="cursor-pointer text-primary-500"
                  onClick={sendMessage}
                />
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
}