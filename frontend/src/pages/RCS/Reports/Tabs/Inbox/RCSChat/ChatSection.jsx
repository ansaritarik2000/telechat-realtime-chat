import React, { useContext, useState, useRef, useEffect } from "react";
import { RCSChatContext } from "../RCSChatInbox";
import {
  Input,
  Image,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Tooltip,
  SelectItem,
  Select,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import RightBarSection from "./RightBar";
import { useThemeStore } from "../../../../../../store/themeStore";
import AvatarIndex from "../../../../../../components/AvatarGen/Index";
import SearchInput from "../../../../../../components/Buttons/Search";
import { t } from "i18next";
import { getRCSBots } from "../../../../../../services/Rcs/rcsBotService";
import toast from "react-hot-toast";
import {
  getTemplates,
  getTemplateTypes,
} from "../../../../../../services/Rcs/rcsTemplateService";
import { useRcsFlowStore } from "../../../../../../store/automationFlowStore/rcsFlowStore";
import RcsTemplateBody from "./RcsTemplateBody";
import { usePreviewTemplateStore } from "../../../../../../store/automationFlowStore/previewModal";
import { rcsInboxChatService } from "../../../../../../services/Rcs/inbox/rcsTemplateChatService";
import {
  getRcsTextChatService,
  rcsInboxTextChatService,
} from "../../../../../../services/Rcs/inbox/rcsTextChatService";
import RcsTemplateChatShow from "./RcsTemplateChatShow";
import { uploadFileToServer } from "../../../../../../services/s3FileServices/s3Services";
import { rcsInboxFileChatService } from "../../../../../../services/Rcs/inbox/rcsFileChatService";
import RcsFIleChatShow from "./RcsFIleChatShow";
import ShowSelectedFile from "./ShowSelectedFile";
import { rcsInboxFileTextChatService } from "../../../../../../services/Rcs/inbox/rcsFileTextChatService";
import RcsFileTextChatShow from "./RcsFileTextChatShow";
import RecievedFileTextChatShow from "./RecievedFIleTextChatShow";
import RecievedFileChatShow from "./RecievedFileChatShow";
import EmojiPicker from "emoji-picker-react";

export default function ChatSection(props) {
  // Prop Destructuring
  const {
    title = "Username",
    number = "+919981764876",
    avatarURL = "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    badgeCol = "success",
    avatar_type = "character",
    avatar_value = "",
  } = props;

  // States
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [status, setStatus] = useState("Active");
  const [bots, setBots] = useState([]);
  const [templateTypes, setTemplateTypes] = useState([]);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rcsTemplates, setRcsTemplates] = useState([]);
  const pickerRef = useRef(null);
  const { theme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { setRightBar, isRightBarVisible, setRightBarVisible } =
    useContext(RCSChatContext);
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const photovideoRef = useRef(null);
  const fileRef = useRef(null);
  const {
    selectedBot,
    setSelectedBot,
    selectedTemplateType,
    selectedFile,
    setSelectedFile,
    setSelectedTemplateType,
    selectedTemplate,
    setSelectedTemplate,
  } = useRcsFlowStore();

  const [rcsChats, setRcsChats] = useState([]);
  const filteredRcsTemplates = rcsTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const chatContainerRef = useRef(null); // Reference to the scrollable container
  const [showLoadMore, setShowLoadMore] = useState(false); // Controls "Load More" button visibility

  // Function to trigger photo/video selection
  const handlePhtotoVideoClick = () => {
    photovideoRef.current.click();
  };

  // Function to trigger file selection
  const handleFileClick = () => {
    fileRef.current.click();
  };

  // Handle photo/video selection
  const handlephotoVideoChange = async (event) => {
    const file = event.target.files[0];

    // Check file size (3MB limit)
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File size must be less than 3MB");
      return;
    } // file select
    if (file) {
      setSelectedFile({
        url: URL.createObjectURL(file),
        file: file,
        name: file.name,
        type: file.type.startsWith("image") ? "image" : "video",
      });
    }
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    // Check file size (3MB limit)
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File size must be less than 3MB");
      return;
    }
    // file select
    if (file) {
      setSelectedFile({
        url: URL.createObjectURL(file),
        name: file.name,
        type: "pdf",
        file: file,
      });
    }
  };

  // this function is used for get rcs text chats
  const getRcsTextChat = async (currentPage, reset = false) => {
    try {
      setIsLoading(true);
      const response = await getRcsTextChatService({
        contactNumber: number,
        token: token,
        page: currentPage,
        limit: 10,
      });
      if (response.status === "SUCCESS") {
        const currentTime = new Date().getTime();

        const formattedChats = response.data.map((chat) => {
          const createdTime = new Date(chat.created_at).getTime();
          const timeDiff = currentTime - createdTime;
          const timeAgo = getTimeAgo(timeDiff, chat.created_at);
          return { ...chat, time: timeAgo };
        });

        setRcsChats((prevChats) =>
          reset ? formattedChats : [...prevChats, ...formattedChats]
        );

        // If no more chats, hide Load More button
        if (response.data.length < 10) {
          setShowLoadMore(false);
        }
      }
    } catch (error) {
      console.error("Error retrieving RCS text chat:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (timeDiff, timestamp) => {
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    // Check if the time difference is more than 10 hours
    if (hours >= 10) {
      // Return the exact date and time
      const date = new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }); // 24-hour format
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (seconds > 0) {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Ensure chat starts scrolled to the bottom
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [rcsChats]);

  // this useeffect is used for get rcs text chats

  useEffect(() => {
    if (number) {
      getRcsTextChat(1, true);
    }
  }, [number]);

  // This function is used for rcs template chat
  const sendRcsTemplateChat = async () => {
    const rcsData = {
      contactNumber: number,
      templateId: selectedTemplate?.template_id,
      botId: selectedBot?.bot_id,
      templateTypeId: selectedTemplateType?.id,
    };

    try {
      const response = await rcsInboxChatService({
        rcsData,
        token,
      });

      if (response.status === "SUCCESS") {
        getRcsTextChat(1, true);
        onClose();
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error creating RCS template:", error.message);
    }
  };

  // send message handller
  const sendMessage = async () => {
    if (selectedFile && message && message?.length > 0) {
      // send file and text message
      const fileUrlResponse = await uploadFileToServer(selectedFile.file);
      if (fileUrlResponse.status === "SUCCESS") {
        const response = await rcsInboxFileTextChatService({
          rcsData: {
            botId: selectedBot?.bot_id,
            fileUrl: fileUrlResponse?.data?.Location,
            contactNumber: number,
            user_type: "sender",
            textMessage: message,
          },
          token: token,
        });
        if (response.status === "SUCCESS") {
          getRcsTextChat(1, true);
          setMessage("");
          setSelectedFile(null);
        }
      } else {
        toast.error("File upload failed");
      }
    }
    // uplaod file and send message
    else if (selectedFile) {
      const fileUrlResponse = await uploadFileToServer(selectedFile.file);
      if (fileUrlResponse.status === "SUCCESS") {
        const response = await rcsInboxFileChatService({
          rcsData: {
            botId: selectedBot?.bot_id,
            fileUrl: fileUrlResponse?.data?.Location,
            contactNumber: number,
            user_type: "sender",
          },
          token: token,
        });
        if (response.status === "SUCCESS") {
          getRcsTextChat(1, true);
          setSelectedFile(null);
        }
      } else {
        toast.error("File upload failed");
      }
    } else if (message) {
      // send text message
      const response = await rcsInboxTextChatService({
        rcsData: {
          botId: selectedBot?.bot_id,
          textMessage: message,
          contactNumber: number,
          user_type: "sender",
        },
        token: token,
      });

      if (response.status === "SUCCESS") {
        getRcsTextChat(1, true);
        setMessage("");
      }
    }
  };

  // Check if the user has scrolled near the top
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const { scrollTop } = container;
      setShowLoadMore(scrollTop <= 50); // Show button when near the top
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Cleanup listener
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Mock function to load older messages
  const loadMoreChats = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getRcsTextChat(nextPage);
  };

  // Handle selection change to store both id and name
  const handleTemplateTypeChange = (selectedValue) => {
    const selectedTemplateId = [...selectedValue][0];
    setSelectedTemplate({});
    const selectedTemplateType = templateTypes.find(
      (type) => type.id === parseInt(selectedTemplateId)
    );

    if (selectedTemplateType) {
      setSelectedTemplateType({
        id: selectedTemplateType.id,
        name: selectedTemplateType.name,
      });
    }
  };

  // Handle selection change to store both id and name
  const handleBotChange = (selectedValue) => {
    const selectedBotId = [...selectedValue][0];
    const selectedBot = bots.find((bot) => bot.id === parseInt(selectedBotId));

    if (selectedBot) {
      setSelectedBot({
        id: selectedBot.id,
        name: selectedBot.name,
      });
    }
  };

  // Fetch all bots and template types on component mount
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await getRCSBots();
        if (data.length > 0) {
          setBots(data);
          setSelectedBot({
            id: data[0].id,
            name: data[0].name,
            bot_id: data[0].bot_id,
          });
        }
      } catch (error) {
        toast.error(t("Error fetching bots"));
      }
    };
    const fetchTemplateTypes = async () => {
      try {
        const data = await getTemplateTypes();
        if (data.length > 0) {
          setTemplateTypes(data);
          setSelectedTemplateType({
            id: data[0].id,
            name: data[0].name,
          });
        }
      } catch (error) {
        toast.error(t("Error fetching template types"));
      }
    };

    fetchBots();
    fetchTemplateTypes();
  }, []);

  // this useffect is used for call get  template apis
  useEffect(() => {
    const selectedTemplateTypeId = selectedTemplateType?.id;
    const botId = selectedBot?.id;
    if (botId && selectedTemplateTypeId) {
      const fetchTemplates = async () => {
        try {
          const data = await getTemplates(botId, selectedTemplateTypeId);
          setRcsTemplates(data);
        } catch (error) {
          toast.error(t("Error fetching templates"));
        }
      };
      fetchTemplates();
    }
  }, [selectedTemplateType, selectedBot]);

  const toggleRightBar = () => {
    // Toggle the visibility state
    const newVisibility = !isRightBarVisible;

    // Update visibility state in context
    setRightBarVisible(newVisibility);

    // Update the rightBar content based on visibility
    if (newVisibility) {
      setRightBar(
        <RightBarSection
          pfp={avatarURL}
          name={title}
          number={number}
          rightbarStatus={newVisibility}
        />
      );
    } else {
      setRightBar(null);
    }

    // Ensure the picker is hidden when toggling the sidebar
    setIsPickerVisible(false);
  };

  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  // const handleEmojiSelect = (emoji) => {
  //   setMessage((prev) => prev + emoji.native);
  //   setIsPickerVisible(false);
  // };

  const handleEmojiSelect = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const openSelectTemplateHandller = () => {
    onOpen();
    setSelectedTemplate({});
  };

  // useEffect(() => {
  //     const timerId = setInterval(() => {
  //         setTimeLeft((prev) => {
  //             if (prev <= 0) {
  //                 clearInterval(timerId);
  //                 return 0;
  //             }
  //             return prev - 1;
  //         });
  //     }, 1000);
  //     // Cleanup on unmount
  //     return () => clearInterval(timerId);
  // }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setStatus("Expired");
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours} hrs ${minutes} mins`;
  };

  return (
    <div className="bg-white dark:bg-background flex-1 flex justify-between flex-col  rounded-2xl w-full">
      {/* Header */}
      <div className="h-fit px-5 py-4 flex justify-between items-center w-full bg-primary-100/80 rounded-tr-2xl rounded-tl-2xl relative">
        {/*  Name & Cell no */}
        <div className="flex items-center justify-center gap-2">
          <AvatarIndex
            isEditable={false}
            // avatarType={avatar_type}
            avatarType="shape"
            value={avatar_value}
            size={45}
          />

          <div className="flex flex-col justify-center">
            <p className="font-medium text-sm text-default-800">{number}</p>
          </div>
        </div>

        {/* Chip, Call, Toggler */}
        <div className="flex justify-center items-center gap-4 text-default-600">
          {/* Reply window timer */}
          <Tooltip content="Reply window open until">
            <Chip
              variant="light"
              size="sm"
              color="default"
              className="text-xs text-center self-center px-2"
            >
              <span className="text-default-500"> {formatTime(timeLeft)}</span>
            </Chip>
          </Tooltip>

          {/* Active / expired Status */}
          <Chip
            color={status === "Active" ? "primary" : "danger"}
            size="sm"
            radius="full"
            variant="flat"
            className="-ml-3"
          >
            {status}
          </Chip>

          {/* Right bar toggler */}
          <Button
            isIconOnly
            variant="light"
            color="primary"
            size="sm"
            radius="full"
            onPress={toggleRightBar}
          >
            <Icon
              icon={
                isRightBarVisible
                  ? "ri:arrow-right-double-line"
                  : "ri:arrow-left-double-line"
              }
              width="1.5em"
              height="1.5em"
              className="cursor-pointer"
            />
          </Button>
        </div>
      </div>

      {/* Chat Bubbles */}
      <div
        className={cn(
          "relative overflow-y-auto flex-1 h-full py-4 rounded-bl-2xl rounded-br-2xl"
        )}
        ref={chatContainerRef}
        style={{
          backgroundImage: `url(${
            theme === "dark"
              ? "/rcs-chat-doodle-dark.png"
              : "/rcs-chat-doodle-light.png"
          })`,
          backgroundSize: "cover", // Adjust size based on the design.
          backgroundPosition: "center", // Center the background image
          backgroundRepeat: "no-repeat", // Prevent the background from repeating
          backgroundAttachment: "fixed", // Keep the background fixed during scroll
        }}
      >
        {/* Overlay for Expired State */}
        {status === "Expired" && (
          <div className="absolute inset-0 z-20   flex items-center justify-center bg-primary-50/70 dark:bg-black/90">
            <div className="text-center">
              <Icon icon="fluent-color:warning-48" width="48" height="48" />
              <p className="text-lg font-semibold text-default-600 dark:text-default-300 mb-2">
                Oops! Looks like your chat window has expired.
              </p>
              <p className="text-sm text-default-500 dark:text-default-400 mb-4">
                Please select a template to continue your conversation.
              </p>
              <Button
                onPress={openSelectTemplateHandller}
                size="md"
                radius="sm"
                variant="flat"
                color="primary"
              >
                Select RCS Template
              </Button>
            </div>
          </div>
        )}

        {/* Chat Content */}

        {status !== "Expired" && (
          <div className={`flex flex-col h-full justify-between`}>
            {/* Chat Bubbles */}

            <div className="relative z-10  flex flex-col-reverse justify-end ">
              {showLoadMore && (
                <Button
                  isLoading={isLoading}
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={loadMoreChats}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  Load more
                </Button>
              )}

              {/* Group Chats by Date */}
              {Object.entries(
                rcsChats.reduce((groups, chat) => {
                  const date = new Date(
                    chat?.submitted_at
                  ).toLocaleDateString();
                  if (!groups[date]) groups[date] = [];
                  groups[date].push(chat);
                  return groups;
                }, {})
              ).map(([date, chats], groupIndex) => {
                // Format the date dynamically
                const formattedDate = (() => {
                  const today = new Date();
                  const chatDate = new Date(date);
                  const tomorrow = new Date();
                  tomorrow.setDate(today.getDate() + 1);

                  if (chatDate.toDateString() === today.toDateString()) {
                    return "Today";
                  } else if (
                    chatDate.toDateString() === tomorrow.toDateString()
                  ) {
                    return "Tomorrow";
                  } else {
                    return chatDate.toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }
                })();
                return (
                  <div key={groupIndex}>
                    {/* Date Separator */}
                    <div className="flex justify-center py-2 pt-6">
                      <span className="text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-full">
                        {formattedDate}
                      </span>
                    </div>
                    {/* Chat Bubbles */}
                    {chats.reverse().map((chat, index) =>
                      chat?.user_type === "user" ? (
                        chat.file_url && chat.message ? (
                          <RecievedFileTextChatShow chat={chat} key={index} />
                        ) : chat.file_url ? (
                          <RecievedFileChatShow chat={chat} key={index} />
                        ) : (
                          <div key={index} className="px-4 flex flex-col w-fit">
                            <span className="bg-primary-50 py-2   rounded-xl px-3 py-2 text-sm rounded-full w-fit break-words max-w-xs">
                              {chat.message}
                            </span>
                            <span className="text-[10px] pl-2  py-[1px]  text-default-400 dark:text-foreground">
                              {chat.time}
                            </span>
                          </div>
                        )
                      ) : chat.rcs_template_types ? (
                        <RcsTemplateChatShow chat={chat} key={index} />
                      ) : chat.file_url && chat.message ? (
                        <RcsFileTextChatShow chat={chat} key={index} />
                      ) : chat.file_url ? (
                        <RcsFIleChatShow chat={chat} key={index} />
                      ) : (
                        <div
                          key={index}
                          className="px-4 flex justify-end flex-col items-end"
                        >
                          <div className="flex py-[3px] items-end flex-col">
                            <span className="bg-primary-100 items-end px-3 py-2 text-sm rounded-xl w-fit break-words max-w-xs">
                              {chat.message}
                            </span>
                            <div className="text-[10px] py-[1px] text-end text-default-400 dark:text-foreground gap-1 flex justify-end items-center">
                              <span>{chat.time}</span>
                              <Icon
                                icon="quill:checkmark-double"
                                width="15"
                                height="15"
                                className="text-primary"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
              {/* {rcsChats.map((chat, index) => {
                            return chat.type === "user" ? (
                                <div
                                    key={index}
                                    className="px-4 flex flex-col w-fit">
                                    <span className="bg-primary-50 px-3 py-2 text-sm rounded-full w-fit break-words max-w-xs">
                                        {chat.message}
                                    </span>
                                    <span className="text-[10px] text-end text-default-400 dark:text-foreground">
                                        {chat.time}
                                    </span>
                                </div>
                            ) : chat.rcs_template_types ? (
                                <RcsTemplateChatShow chat={chat} key={index} />
                            ) : (
                                <div
                                    key={index}
                                    className="px-4 flex justify-end flex-col items-end">
                                    <div className="flex items-end flex-col">
                                        <span className="bg-primary-100 items-end px-3 py-2 text-sm rounded-xl w-fit break-words max-w-xs">
                                            {chat.message}
                                        </span>
                                        <div className="text-[10px] text-end text-default-400 dark:text-foreground gap-1 flex justify-end items-center">
                                            <span>{chat.time}</span>
                                            <Icon
                                                icon="quill:checkmark-double"
                                                width="15"
                                                height="15"
                                                className="text-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })} */}
            </div>
          </div>
        )}
      </div>

      {/* Send Input Fields */}
      {status === "Active" && (
        <div className="flex justify-between  items-center px-3 py-2 w-full">
          <div className="flex flex-col w-full">
            {selectedFile && (
              <ShowSelectedFile
                selectedFile={selectedFile}
                removePreview={() => setSelectedFile(null)}
              />
            )}
            <div className="flex justify-center items-center flex-1 gap-1 relative">
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
                  <EmojiPicker onEmojiClick={handleEmojiSelect} />
                </div>
              )}

              {/* Template Icon */}
              <Icon
                icon="uil:file-alt"
                width="1.7em"
                height="1.7em"
                className="cursor-pointer"
                onClick={onOpen}
              />

              {/* Upload Media / Attachment Icon */}
              <Dropdown size="sm">
                <DropdownTrigger>
                  <Icon
                    icon="ph:paperclip"
                    width="1.7em"
                    height="1.7em"
                    className="cursor-pointer"
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Action event on selected key"
                  // onAction={(key) => alert(key)}
                >
                  <DropdownItem
                    // key="new"
                    startContent={
                      <Icon icon="pajamas:media" width="1.2em" height="1.2em" />
                    }
                    onPress={handlePhtotoVideoClick}
                  >
                    Photo or Video
                  </DropdownItem>
                  <DropdownItem
                    key="copy"
                    startContent={
                      <Icon icon="ph:file-bold" width="1.2em" height="1.2em" />
                    }
                    onPress={handleFileClick}
                  >
                    File
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={
                      <Icon icon="mdi:location" width="1.2em" height="1.2em" />
                    }
                  >
                    Location
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              {/* Hidden File Input */}
              <input
                ref={photovideoRef}
                type="file"
                accept="image/*,video/*" // Accept only photos and videos
                style={{ display: "none" }} // Hide the input
                onChange={handlephotoVideoChange} // Handle file selection
              />
              {/* Hidden File Input */}
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf" // Accept only PDF files
                style={{ display: "none" }} // Hide the input
                onChange={handleFileChange} // Handle file selection
              />

              {/* Message Input Field */}

              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here ..."
                className="w-full"
                color="none"
                radius="sm"
                endContent={
                  <Icon
                    onClick={sendMessage}
                    icon="tabler:send"
                    width="1.5em"
                    height="1.5em"
                    className="cursor-pointer text-blue-500"
                  />
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="4xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                RCS Templates
                <div className="flex flex-row justify-between items-center">
                  <div className="mt-1">
                    <SearchInput
                      Placeholder={t("Search...")}
                      onSearch={(value) => setSearchTerm(value)}
                    />
                  </div>

                  <div className="flex flex-row gap-2">
                    <Select
                      isRequired
                      label={t("Select RCS Bot")}
                      className="w-[200px]"
                      onSelectionChange={handleBotChange}
                      value={selectedBot?.id || ""}
                      selectedKeys={[`${selectedBot?.id}`]}
                      // className="w-full"
                      variant="flat"
                      color="default"
                      radius="sm"
                      size="md"
                    >
                      {bots.map((bot) => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {bot.name}
                        </SelectItem>
                      ))}
                    </Select>
                    {/* Select Template Type */}
                    <Select
                      isRequired
                      className={"w-[200px]"}
                      label={t("Select Template Type")}
                      selectedKeys={[`${selectedTemplateType?.id}`]}
                      onSelectionChange={handleTemplateTypeChange}
                      value={selectedTemplateType?.id || ""}
                      // className="w-full"
                      variant="flat"
                      color="default"
                      radius="sm"
                      size="md"
                    >
                      {templateTypes.map((templateType) => (
                        <SelectItem
                          value={templateType.id}
                          key={templateType.id}
                        >
                          {t(templateType.name)}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <RcsTemplateBody
                  phoneNumber={number}
                  filteredRcsTemplates={filteredRcsTemplates}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="flat"
                  radius="sm"
                  onClick={() => sendRcsTemplateChat()}
                  isDisabled={!selectedTemplate?.template_id}
                >
                  Use Template
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}