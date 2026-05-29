import React, { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import { getPinnedChatService } from "../../../../../../services/Whatsapp/chats/getPinnedChatService";

const PinnedChats = () => {
    const [pinnedChats, setPinnedChats] = useState([]);
    const token = localStorage.getItem("token");

    // this function is used for get pinned chats
    const getPinnedChats = async () => {
        const response = await getPinnedChatService(token);
        if (response.status === "SUCCESS") {
            setPinnedChats(response.data);
        } else {
            toast.error("Failed to get pinned chats");
        }
    };

    useEffect(() => {
        if (token) {
            getPinnedChats();
        }
    }, [token]);

    return (
        <>
            {pinnedChats.map((pinnedChat) => {
                const item = pinnedChat?.phonebook_contacts || {};
                return (
                    <ChatCard
                        title={item?.contact_name}
                        chipStatus="Active"
                        recent="Check your mail 💌"
                        time="11:30 AM"
                        number={`${item?.country_code}-${item?.phone_no}`}
                        avatarURL="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        badgeCol="success"
                        status="Active"
                        item={item}
                    />
                );
            })}
        </>
    );
};

export default PinnedChats;
