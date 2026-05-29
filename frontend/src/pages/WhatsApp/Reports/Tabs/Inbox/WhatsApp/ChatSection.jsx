import React, { useContext, useState, useRef, useEffect } from "react";
import { TeleChatContext } from "../WhatsAppIndex";
import {
    Avatar,
    Input,
    Badge,
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
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import RightBarSection from "./rightBar";
import { useThemeStore } from "../../../../../../store/themeStore";
import AvatarIndex from "../../../../../../components/AvatarGen/Index";
import { set } from "lodash";
import { t } from "i18next";
import toast from "react-hot-toast";
import { getChatByPhoneNumberService } from "../../../../../../services/Whatsapp/chats/getChatByPhoneService";
import { useSendWhatsappStore } from "../../../../../../store/whatsapp/whatsappStore";
import WhatsappTemplate from "./WhatsappTemplate";
import EmojiPicker from "emoji-picker-react";

export default function ChatSection(props) {
    // Prop Destructuring
    const {
        title = "Username",
        number,
        avatarURL = "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        badgeCol = "success",
        avatar_type = "character",
        avatar_value = "",
    } = props;

    // States
    const [status, setStatus] = useState("Active");
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const [message, setMessage] = useState("");
    const pickerRef = useRef(null);
    const { theme } = useThemeStore();
    const { setRightBar, isRightBarVisible, setRightBarVisible } =
        useContext(TeleChatContext);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { selectedSendTemplate, setIsPinned } = useSendWhatsappStore();
    const token = localStorage.getItem("token");

    console.log("timeLeft", timeLeft);
    // get chat by phone number
    useEffect(() => {
        const getChatByPhoneNumber = async () => {
            const response = await getChatByPhoneNumberService(token, number);
            if (response.status === "SUCCESS") {
                const { initiated_at, expires_at, is_pinned } = response.data;

                // Calculate time left in seconds
                const timeLeftInSeconds = Math.floor(
                    (new Date(expires_at).getTime() - new Date().getTime()) /
                        1000
                );

                setTimeLeft(timeLeftInSeconds);
                setIsPinned(is_pinned);
                // Set status based on time left
                if (timeLeftInSeconds <= 0) {
                    setTimeLeft(0);
                    setStatus("Expired");
                } else {
                    setStatus("Active");
                }
            } else {
                toast.error("Failed to get chat by phone number");
            }
        };
        getChatByPhoneNumber();
    }, [number]);

    // Sidebar Toggle Handler
    const toggleRightBar = () => {
        if (isRightBarVisible) {
            setRightBar(null);
        } else {
            setRightBar(
                <RightBarSection pfp={avatarURL} name={title} number={number} />
            );
        }
        setRightBarVisible(!isRightBarVisible);
        setIsPickerVisible(false);
    };

    const togglePicker = () => {
        setIsPickerVisible(!isPickerVisible);
    };

    const handleEmojiSelect = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timerId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        // Cleanup on unmount
        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            setStatus("Expired");
        }
    }, [timeLeft]);

    console.log;
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours} hrs ${minutes} mins`;
    };

    return (
        <div className="bg-white dark:bg-background flex-1 flex justify-between flex-col  rounded-2xl w-full">
            {/* Header */}
            <div className="h-fit px-4 py-4 flex justify-between items-center w-full bg-success-100 rounded-tr-xl rounded-tl-xl relative">
                {/* DP, Cell no, Online Status */}
                <div className="flex items-center justify-center gap-2">
                    <Badge
                        content=""
                        color={badgeCol}
                        size="sm"
                        shape="circle"
                        placement="bottom-right"
                    >
                        <AvatarIndex
                            isEditable={false}
                            avatarType={avatar_type}
                            value={avatar_value}
                            size={45}
                        />
                        {/* <Avatar src={avatarURL} size="md" /> */}
                    </Badge>

                    <div className="flex flex-col justify-center">
                        <p className="font-semibold text-sm text-default-800">
                            {title}
                        </p>
                        <p className="font-light text-xs text-default-800">
                            {number}
                        </p>
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
                            <span className="text-default-500">
                                {" "}
                                {formatTime(timeLeft)}
                            </span>
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
                    {/* Call Icon */}
                    <Icon
                        icon="tdesign:call"
                        width="1.5em"
                        height="1.5em"
                        className="cursor-pointer"
                    />
                    {/* Right bar toggler */}
                    <Button
                        isIconOnly
                        variant="light"
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
                className={`relative flex-1 h-full py-4 overflow-hidden rounded-br-2xl rounded-bl-2xl  `}
            >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={
                            theme === "dark"
                                ? "whatsapp-doodle-dark.png"
                                : "whatsapp-doodle-light.png"
                        }
                        alt="Background Image"
                        className="!object-cover h-[1000px]  w-[1500px] lg:w-[3000px] !opacity-10 !dark:opacity-20 rounded-none"
                    />
                </div>

                {/* Expired Overlay */}
                {status === "Expired" && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-success-50/70 dark:bg-black/70">
                        <div className="text-center">
                            <Icon
                                icon="fluent-color:warning-48"
                                width="48"
                                height="48"
                            />
                            <p className="text-lg font-semibold text-default-600 dark:text-default-300 mb-2">
                                Oops! Looks like your chat window has expired.
                            </p>
                            <p className="text-sm text-default-500 dark:text-default-400 mb-4">
                                Please select a template to continue your
                                conversation.
                            </p>
                            <Button
                                onPress={onOpen}
                                size="md"
                                radius="sm"
                                variant="flat"
                                color="success"
                            >
                                Select WhatsApp Template
                            </Button>
                        </div>
                    </div>
                )}

                <div
                    className={`flex flex-col h-full justify-between ${
                        status === "Expired" ? "blur-sm" : ""
                    }`}
                >
                    {/* Encryption Note */}
                    <div className="flex justify-center">
                        <div className="relative text-xs text-default-600 w-fit border-1 border-warning-200 bg-warning-100 z-10 flex -gap-4 mx-10 py-2 px-4 rounded-md text-center justify-center dark:bg-warning-50">
                            <Icon icon="ri:lock-2-fill" className=" -mr-0" />
                            <span className="inline-block ">
                                Messages are end-to-end encrypted. No one
                                outside of this chat, not even WhatsApp or
                                Telepie can read or listen to them.
                            </span>
                        </div>
                    </div>

                    {/* Bubble Chat */}
                    <div className="relative z-10 flex flex-col justify-end h-full">
                        <div className="px-4 flex flex-col w-fit">
                            <span className="bg-primary-100 px-3 py-2 text-sm rounded-lg w-fit">
                                Hey buddy, What's up!
                            </span>
                            <span className="text-[10px] text-end text-default-400 ">
                                2 seconds ago, Today
                            </span>
                        </div>

                        <div className="px-4 flex justify-end flex-col items-end">
                            <div className="flex justify-start flex-col">
                                <span className="bg-success-100 px-3 py-2 text-sm rounded-lg w-fit">
                                    Hi {title}. I think sky, no 😄
                                </span>
                                <span className="text-[10px] text-start text-default-400">
                                    Just now, Today
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Send Message */}
            {status === "Active" && (
                <div className="flex justify-between items-center px-3 py-2 w-full">
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
                                <EmojiPicker
                                    onEmojiSelect={handleEmojiSelect}
                                    reactionsDefaultOpen={false}
                                />
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
                                onAction={(key) => alert(key)}
                            >
                                <DropdownItem
                                    key="new"
                                    startContent={
                                        <Icon
                                            icon="pajamas:media"
                                            width="1.2em"
                                            height="1.2em"
                                        />
                                    }
                                >
                                    Photo or Video
                                </DropdownItem>
                                <DropdownItem
                                    key="copy"
                                    startContent={
                                        <Icon
                                            icon="ph:file-bold"
                                            width="1.2em"
                                            height="1.2em"
                                        />
                                    }
                                >
                                    File
                                </DropdownItem>
                                <DropdownItem
                                    key="edit"
                                    startContent={
                                        <Icon
                                            icon="mdi:location"
                                            width="1.2em"
                                            height="1.2em"
                                        />
                                    }
                                >
                                    Location
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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
                                    icon="tabler:send"
                                    width="1.5em"
                                    height="1.5em"
                                    className="cursor-pointer dark:text-success-300"
                                />
                            }
                        />
                        <Icon
                            icon="lets-icons:mic"
                            width="1.8em"
                            height="1.8em"
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {t("Select Templates")}
                            </ModalHeader>
                            <ModalBody>
                                <WhatsappTemplate />
                                <Divider />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color={
                                        selectedSendTemplate?.template_id
                                            ? "success"
                                            : "default"
                                    }
                                    isDisabled={
                                        !selectedSendTemplate?.template_id
                                    }
                                    // @Sunil Feel Free to remove
                                    onPress={
                                        selectedSendTemplate?.template_id
                                            ? onClose
                                            : null
                                    }
                                    variant="flat"
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
