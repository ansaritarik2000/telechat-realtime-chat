import { Tooltip } from "@heroui/react";
import React from "react";
import { Icon } from "@iconify-icon/react";
import { usePhoneBookStore } from "../../../../store/phonebook/phonebookStore";
import { useTranslation } from "react-i18next";

const ChannelsOption = ({ onChannelSelected }) => {
    const { t } = useTranslation();
    //zustand store
    const { selectedChannels, setSelectedChannels } = usePhoneBookStore();
    // Toggle channel
    const toggleChannel = (channelName) => {
        const newSelectedChannels = selectedChannels.includes(channelName)
            ? selectedChannels.filter((name) => name !== channelName)
            : [...selectedChannels, channelName];
        setSelectedChannels(newSelectedChannels);
        onChannelSelected(newSelectedChannels);
    };

    // Channel Icons
    const channelIcons = [
        {
            name: "SMS",
            icon: (
                <Icon
                    icon="fluent:chat-12-filled"
                    className="!text-[#fdc842]"
                    width={"1.4em"}
                />
            ),
        },
        {
            name: "RCS",
            icon: (
                <Icon
                    icon="pajamas:image-comment-dark"
                    className="text-[#699df8]"
                    width={"1.4em"}
                />
            ),
        },
        {
            name: "WhatsApp",
            icon: <Icon icon="logos:whatsapp-icon" width={"1.4em"} />,
        },
        {
            name: "Email",
            icon: <Icon icon="skill-icons:gmail-light" width={"1.4em"} />,
        },
    ];
    return (
        <div className="relative flex flex-col  gap-0 px-6 rounded-md ">
            <div className="flex gap-1">
                {channelIcons.map((channel) => (
                    <div
                        key={channel.name}
                        className="flex cursor-pointer relative ">
                        <Tooltip content={t(channel.name)}>
                            <div onClick={() => toggleChannel(channel.name)}>
                                {channel.icon}
                                {/* Show tick icon above the selected icon */}
                                {selectedChannels?.includes(channel.name) && (
                                    <Icon
                                        icon="mdi:check-circle"
                                        className="absolute -top-3 right-0 text-green-500"
                                        width={"0.9em"}
                                    />
                                )}
                            </div>
                        </Tooltip>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChannelsOption;
