import React, { useEffect, useMemo, useState } from "react";
import {
    Input,
    Tooltip,
    Tabs,
    Tab,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
    Select,
    SelectItem,
    Chip,
    RadioGroup,
    Radio,
    Divider,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import ChatCard from "./ChatCard";
import RangeCal from "./RangeCal";

import { getWhatsAppContactsService } from "../../../../../../services/phonebook/whatsappContactService";
import toast from "react-hot-toast";

import TagsDropDown from "../../../../../RCS/SendRCS/Send/TagsDropDown";
import PinnedChats from "./PinnedChats";
import { useSendWhatsappStore } from "../../../../../../store/whatsapp/whatsappStore";
import { getInitiatedChatService } from "../../../../../../services/Whatsapp/chats/getInitatedChatService";
import { set } from "lodash";
import { today, getLocalTimeZone } from "@internationalized/date";
import { PhoneInput } from "../../../../../../components/phone-input";

export default function SidebarIndex() {
    const [selectedTab, setSelectedTab] = useState("chat");
    const [selectedTags, setSelectedTags] = useState([]);
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [selected, setSelected] = useState("");
    const { whatsAppChats, setWhatsaAppChats } = useSendWhatsappStore();
    const [filteredChats, setFilteredChats] = useState([]);
    let defaultDate = {
        start: today(getLocalTimeZone()).subtract({ years: 1 }),
        end: today(getLocalTimeZone()).add({ days: 1 }), // Set the end date to one day after today
    };

    const [chatsModalFilter, setChatsModalFilter] = useState({
        status: "",
        phone_no: "",
        country_dial_code: "+91",
        selectedTags: [],
        searcedDateRange: defaultDate,
    });

    console.log("chatsModalFilter", chatsModalFilter);

    const token = localStorage.getItem("token");

    const handleColorChange = (key) => {
        setSelectedTab(key);
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag.name)) {
            setSelectedTags((prev) => [...prev, tag.name]);
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    // handle search text change
    const handleSearchTextChange = (e) => {
        const searchText = e.target.value;
        if (searchText && searchText.length > 0) {
            const searchedChats = whatsAppChats.filter((chat) => {
                return (
                    chat.contact_name
                        .toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                    chat.phone_no
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                );
            });
            setFilteredChats(searchedChats);
        } else {
            setFilteredChats(whatsAppChats);
        }

        // set selected tab to chat
        setSelectedTab("chat");
    };

    // this function is used for get whatsapp contacts with pagination search and status filter
    useEffect(() => {
        const getWhatsAppContacts = async () => {
            // this is used for all chats
            const chatsResponse = await getWhatsAppContactsService(token);
            if (chatsResponse.status === "SUCCESS") {
                // whatsapp chats contacts
                const whatsAppChats = chatsResponse.data || [];
                setWhatsaAppChats(whatsAppChats);
                setFilteredChats(whatsAppChats);

                // this is used for get initiated chats
                const initiatedChatsresponse = await getInitiatedChatService(
                    token
                );

                if (initiatedChatsresponse?.status === "SUCCESS") {
                    // initiated chats
                    const initiatedChats = initiatedChatsresponse?.data;

                    // update chats with initiated chats
                    if (initiatedChats?.length > 0) {
                        // chats with initiated chats
                        const updatedChatsWithInitiated = whatsAppChats?.map(
                            (chat) => {
                                const initiatedChat = initiatedChats.find(
                                    (initiatedChat) =>
                                        initiatedChat.contact_id === chat.id
                                );

                                if (initiatedChat) {
                                    const currentTime = new Date();
                                    let status = ""; // Default to blank
                                    if (
                                        new Date(initiatedChat.expires_at) >
                                        currentTime
                                    ) {
                                        status = "active";
                                    } else if (
                                        new Date(initiatedChat.expires_at) <
                                        currentTime
                                    ) {
                                        status = "expired";
                                    }

                                    return {
                                        ...chat,
                                        initiated_at:
                                            initiatedChat.initiated_at,
                                        expires_at: initiatedChat.expires_at,
                                        status: status,
                                    };
                                }

                                return chat;
                            }
                        );

                        setWhatsaAppChats(updatedChatsWithInitiated);
                        setFilteredChats(updatedChatsWithInitiated);
                    }
                }
            } else {
                toast.error("Failed to get WhatsApp contacts");
            }
        };
        getWhatsAppContacts();
    }, [token]);

    // onclose handller
    const onCloseHandller = () => {
        setFilteredChats(whatsAppChats);
        onClose();
    };

    // filter handller
    const onSearchHandller = () => {
        const { status, phone_no, selectedTags, searcedDateRange } =
            chatsModalFilter;

        const filteredChats = whatsAppChats.filter((chat) => {
            // Initialize to true; only modify for active filters
            let matches = true;

            // Apply status filter only if it's specified
            if (status) {
                matches = matches && chat.status === status;
            }

            // Apply phone number filter only if it's specified
            if (phone_no) {
                matches =
                    matches &&
                    `${chat.country_code.slice(1)}${chat.phone_no}`.includes(
                        phone_no
                    );
            }

            // Apply tags filter only if tags are specified
            if (selectedTags.length > 0) {
                matches =
                    matches &&
                    selectedTags.some((tag) =>
                        chat.tags_only_string?.includes(tag)
                    );
            }

            // Apply date range filter only if a range is specified
            if (searcedDateRange?.start && searcedDateRange?.end) {
                matches =
                    matches &&
                    new Date(chat.created_at) >=
                        new Date(searcedDateRange.start) &&
                    new Date(chat.created_at) <= new Date(searcedDateRange.end);
            }

            return matches;
        });

        setFilteredChats(filteredChats);
        onClose();
    };

    console.log("whatsappchats", whatsAppChats);

    return (
        <div className="flex flex-col gap-3 border border-transparent rounded-2xl h-full py-4 bg-white dark:bg-background">
            {/* Search */}
            <div className="flex justify-around  px-1 items-center">
                <Input
                    className="px-2"
                    variant="bordered"
                    color="success"
                    size="md"
                    radius="sm"
                    placeholder="Search"
                    onChange={handleSearchTextChange}
                    endContent={
                        <Icon
                            icon="fluent:search-20-regular"
                            width="1.4em"
                            height="1.4em"
                            className="justify-center"
                        />
                    }
                />

                {/* Filter Modal Icon */}
                <Icon
                    icon="ph:sliders-duotone"
                    width="1.5em"
                    height="1.5em"
                    className="cursor-pointer pr-1 text-gray-500 dark:text-gray-400 hover:text-success"
                    onClick={onOpen}
                />

                {/* Modal Content */}
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onClose={onCloseHandller}
                    placement="top-center"
                    size="md"
                    // className="h-1/2"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Filter Chat
                                </ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-4 mb-1">
                                        {/* Search by status */}
                                        <RadioGroup
                                            label={
                                                <span className="text-sm">
                                                    Filter by status
                                                </span>
                                            }
                                            orientation="horizontal"
                                            size="md"
                                            color="default"
                                            onValueChange={(value) =>
                                                setChatsModalFilter({
                                                    ...chatsModalFilter,
                                                    status: value,
                                                })
                                            }
                                            disableAnimation={true}>
                                            <Radio value="active">
                                                <Chip
                                                    color="primary"
                                                    variant="flat">
                                                    Active
                                                </Chip>
                                            </Radio>
                                            <Radio value="expired">
                                                <Chip
                                                    color="danger"
                                                    variant="flat">
                                                    Expired
                                                </Chip>
                                            </Radio>
                                        </RadioGroup>

                                        {/* Search by phone no */}
                                        <div>
                                            <p className="text-default-500 text-sm pb-2">
                                                Filter by contact
                                            </p>
                                            <PhoneInput
                                                countryDialCode={
                                                    chatsModalFilter.country_dial_code
                                                }
                                                onChange={(value) =>
                                                    setChatsModalFilter({
                                                        ...chatsModalFilter,
                                                        phone_no: value,
                                                    })
                                                }
                                                onCountryChange={(country) =>
                                                    setChatsModalFilter({
                                                        ...chatsModalFilter,
                                                        country_dial_code:
                                                            country?.dial_code,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div>
                                            <p className="text-default-500 text-sm pb-2">
                                                Filter by tags
                                            </p>
                                            <TagsDropDown
                                                onSelectionTagChange={(tags) =>
                                                    setChatsModalFilter({
                                                        ...chatsModalFilter,
                                                        selectedTags: tags,
                                                    })
                                                }
                                                isWhatsappTags={true}
                                            />
                                        </div>

                                        {/* Search by calender range */}
                                        <div>
                                            <p className="text-default-500 text-sm pb-2">
                                                Filter by date range
                                            </p>
                                            <RangeCal
                                                onDateRangeChange={(date) =>
                                                    setChatsModalFilter({
                                                        ...chatsModalFilter,
                                                        searcedDateRange: date,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Divider />
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        className="text-danger hover:bg-danger-100"
                                        variant="none"
                                        onPress={onClose}
                                        radius="sm">
                                        Cancel
                                    </Button>
                                    <Button
                                        color="success"
                                        onPress={onSearchHandller}
                                        variant="flat">
                                        Search
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>

            {/* Chats, Favorite, Calls Tabs */}
            <Tabs
                aria-label="Tabs"
                variant="light"
                size="md"
                radius="sm"
                className="flex justify-center -mb-3 "
                selectedKey={selectedTab}
                onSelectionChange={handleColorChange}>
                {/* Chats Tab */}
                <Tab
                    key="chat"
                    title={
                        <Tooltip
                            showArrow={true}
                            placement="top"
                            content="Chats">
                            <Icon
                                icon="fluent:chat-16-regular"
                                width="1.7em"
                                height="1.7em"
                                className={
                                    selectedTab === "chat"
                                        ? "text-success"
                                        : "text-default-500"
                                }
                            />
                        </Tooltip>
                    }>
                    {filteredChats?.map((item) => (
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
                    ))}
                    {/* <ChatCard
                        title="Nawaz Ali"
                        chipStatus="Active"
                        recent="Check your mail 💌"
                        time="11:30 AM"
                        number="+917004893457"
                        avatarURL="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        badgeCol="success"
                        status="Active"
                        isPinned={true}
                    />
                    <ChatCard
                        title="Venecca"
                        chipStatus="Pending"
                        recent="Working on charts 📈"
                        time="04:35 PM"
                        number="+916004568734"
                        avatarURL="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        badgeCol="danger"
                        status="Expired"
                    />
                    <ChatCard
                        title="Michael"
                        chipStatus="Closed"
                        recent="Done. Thank you ❤️"
                        time="02:30 PM"
                        number="+919596874534"
                        avatarURL="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                        badgeCol="danger"
                        status="Active"
                    /> */}
                </Tab>

                {/* Favorites Tab */}
                <Tab
                    key="favorites"
                    title={
                        <Tooltip
                            showArrow={true}
                            placement="top"
                            content="Pinned Chats">
                            <Icon
                                icon="fluent:pin-16-regular"
                                width="1.7em"
                                height="1.7em"
                                className={
                                    selectedTab === "favorites"
                                        ? "text-success"
                                        : "text-default-500"
                                }
                            />
                        </Tooltip>
                    }>
                    <PinnedChats />
                </Tab>

                {/* Calls Tab */}
                <Tab
                    key="calls"
                    title={
                        <Tooltip
                            showArrow={true}
                            placement="top"
                            content="Calls">
                            <Icon
                                icon="tdesign:call"
                                width="1.7em"
                                height="1.7em"
                                className={
                                    selectedTab === "calls"
                                        ? "text-success"
                                        : "text-default-500"
                                }
                            />
                        </Tooltip>
                    }>
                    <ChatCard
                        title="Venecca"
                        chipStatus="Pending"
                        recent="Working on charts"
                        time="04:35 PM"
                        number="+916004568734"
                        avatarURL="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        badgeCol="danger"
                    />
                </Tab>
            </Tabs>
        </div>
    );
}
