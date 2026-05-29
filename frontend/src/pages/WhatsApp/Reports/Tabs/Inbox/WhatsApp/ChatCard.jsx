import React, { useContext } from "react";
import { Image } from "@heroui/react";
import { TeleChatContext } from "../WhatsAppIndex";
import ChatSection from "./ChatSection";
import RightBarSection from "./rightBar";
import AvatarIndex from "../../../../../../components/AvatarGen/Index";
import { initiateChatService } from "../../../../../../services/Whatsapp/chats/iniateChatService";
import toast from "react-hot-toast";

const chipColorMapping = {
    Active: "success",
    Closed: "primary",
    Pending: "warning",
};

export default function ChatCard(props) {
    const { setChatView, setRightBar, setRightBarVisible } =
        useContext(TeleChatContext);
    const token = localStorage.getItem("token");

    const {
        title = "Client Name",
        chipStatus = "Active",
        recent = "Last message sent",
        time = "14 August, 11:30 AM",
        number,
        avatarURL,
        day = "23 Aug",
        badgeCol,
        status = "Active",
        isPinned = false,
        item,
    } = props;

    const chipColor = chipColorMapping[chipStatus] || "default";

    console.log("item", item);

    // this function is used for call initate chat service
    const initiateChat = async () => {
        const resposne = await initiateChatService(token, {
            phone_number: number,
            contact_id: item?.id,
            is_pinned: isPinned,
        });

        if (resposne.status === "ERROR") {
            toast.error(resposne.message);
        }
    };

    const handleChatClick = () => {
        // call initiate chat service
        initiateChat();

        // set chat view
        setChatView(
            <ChatSection
                title={title}
                number={number}
                avatarURL={avatarURL}
                badgeCol={badgeCol}
                status={status}
                avatar_type={item?.avatar_type}
                avatar_value={item?.avatar_value || title}
            />
        );

        setRightBar(
            <RightBarSection
                pfp={avatarURL}
                name={title}
                number={number}
                email={item?.email}
                item={item}
                isPinned={isPinned}
            />
        );
        setRightBarVisible(true);
    };

    return (
        <div
            className="flex gap-2 py-3 px-4 bg-white dark:bg-background hover:cursor-pointer border-t border-success-100 w-full"
            onClick={handleChatClick}>
            <AvatarIndex
                isEditable={false}
                avatarType={item?.avatar_type}
                value={item?.avatar_value || title}
                size={40}
            />
            <div className="flex justify-between w-full">
                <div className="flex flex-col gap-2 justify-center">
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs font-large text-default-500">
                        {recent}
                    </p>
                </div>

                <div className="flex flex-col gap-2 justify-center items-end">
                    <p className="text-xs text-default-500">{time}</p>
                    <p className="text-xs text-default-500">{day}</p>
                </div>
            </div>
        </div>
    );
}
