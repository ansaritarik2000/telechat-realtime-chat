import React, { useContext } from "react";
import { Image } from "@heroui/react";
import { RCSChatContext } from "../RCSChatInbox";
import ChatSection from "./ChatSection";
import RightBarSection from "./RightBar";

import AvatarIndex from "../../../../../../components/AvatarGen/Index";

const chipColorMapping = {
    Active: "success",
    Closed: "primary",
    Pending: "warning",
};

export default function ChatCard(props) {
    const { setChatView, setRightBar, setRightBarVisible, isRightBarVisible } =
        useContext(RCSChatContext);

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

    const handleChatClick = () => {
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

        // Update the right bar

        {
            isRightBarVisible &&
                setRightBar(
                    <RightBarSection
                        name={title}
                        number={number}
                        rightbarStatus={true}
                        item={item}
                    />
                );
        }
    };

    return (
        <div
            className="flex gap-2 py-3 px-4 dark:bg-background hover:cursor-pointer border-t border-blue-100 dark:border-content3 w-full"
            onClick={handleChatClick}>
            <AvatarIndex
                isEditable={false}
                // avatarType={item?.avatar_type}
                avatarType="shape"
                value={item?.avatar_value || title}
                size={45}
            />

            <div className="flex justify-between w-full">
                <div className="flex flex-col gap-2 justify-center">
                    <p className="font-medium text-xs">{number}</p>
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
