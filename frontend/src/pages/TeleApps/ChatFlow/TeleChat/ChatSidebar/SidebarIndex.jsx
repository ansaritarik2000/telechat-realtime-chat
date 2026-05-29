import React, { useEffect, useState } from "react";
import {
  Input,
  Tooltip,
  Tabs,
  Tab,
  ScrollShadow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import ChatCard from "./ChatCard";
import { useFavouriteChatStore } from "../../../../../store/Telechat/telechatStore";
import FavouritesChat from "./FavouritesChat";
import ActiveChats from "./ActiveChat";
import { getMembersService } from "../../../../../services/members/memberService";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import { createGroupService } from "../../../../../services/Telechat/groupChatService/creategroupService";
import { getUserGroupsService } from "../../../../../services/Telechat/groupChatService/getUserGroupsService";

export default function SidebarIndex() {
  const [selectedTab, setSelectedTab] = useState("groups");
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const token = localStorage.getItem("token");
  const loginUserId = localStorage.getItem("loginUser_id");
  const { favouriteChats } = useFavouriteChatStore();
  const [users, setUsers] = useState([]); // All users list
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected users list
  const [groups, setGroups] = useState([]);


  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const response = await getMembersService(
        undefined,
        undefined,
        "active",
        searchTerm,
        token,
        loginUserId
      );
      if (response.status === "SUCCESS") {
        setChats(response.data);
      } else {
        console.log("API Response", response.data);
        setError(response.message);
      }
      setLoading(false);
    };
    fetchChats();
  }, [searchTerm, token]);

  useEffect(() => {
    if (showCreateGroupModal) {
      fetchUsers();
    }
  }, [showCreateGroupModal]);

  const fetchUsers = async () => {
    const response = await getMembersService(
      undefined,
      undefined,
      "active",
      "",
      token,
      loginUserId
    );
    if (response.status === "SUCCESS") {
      setUsers(response.data);
    }
  };

  const handleColorChange = (key) => {
    setSelectedTab(key);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }

    if (selectedUsers.length < 2) {
      alert("A group must have at least 2 members.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await createGroupService({
        groupName,
        members: selectedUsers,
        isPrivate: false,
        token,
      });

      console.log("Create Group API Response:", response);

      if (response.status === "SUCCESS") {
        alert("Group Created Successfully!");

        // 🔥 New code to fetch updated groups list
        const updatedGroups = await getUserGroupsService(token);
        if (updatedGroups.status === "SUCCESS") {
          setGroups(updatedGroups.groups); // Update groups immediately
        }

        setShowCreateGroupModal(false);
      } else {
        console.error("Group Creation Failed:", response.message);
        alert("Failed to create group: " + response.message);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    if (selectedTab === "groups") {
      const fetchGroups = async () => {
        try {
          const response = await getUserGroupsService(token);
          if (response.status === "SUCCESS") {
            const safeGroups = Array.isArray(response.groups)
              ? response.groups
              : [];
            setGroups(safeGroups);
          } else {
            console.error("Failed to fetch groups:", response.message);
            setGroups([]);
          }
        } catch (err) {
          console.error("Error during group fetch:", err);
          setGroups([]);
        }
      };

      fetchGroups();
    }
  }, [selectedTab, token]);

  

  return (
    <div className="flex flex-col gap-3 border border-transparent rounded-2xl h-full py-4 bg-white dark:bg-background">
      <Input
        className="px-2"
        variant="bordered"
        color="success"
        size="md"
        radius="sm"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        endContent={
          <Icon
            icon="majesticons:search-line"
            width="1.2em"
            height="1.2em"
            className="justify-center"
          />
        }
      />

      <div className="flex flex-col">
        <ActiveChats />
      </div>

      <Tabs
        aria-label="Tabs"
        variant="light"
        size="md"
        radius="sm"
        className="flex justify-center -mb-3"
        selectedKey={selectedTab}
        onSelectionChange={handleColorChange}
      >
        <Tab
          key="chat"
          title={
            <Tooltip content="Chats">
              <Icon
                icon="fluent:chat-16-regular"
                width="1.7em"
                height="1.7em"
                className={
                  selectedTab === "chat" ? "text-success" : "text-default-500"
                }
              />
            </Tooltip>
          }
        />
        <Tab
          key="groups"
          title={
            <Tooltip content="Groups">
              <Icon
                icon="lets-icons:group"
                width="1.7em"
                height="1.7em"
                className={
                  selectedTab === "groups" ? "text-success" : "text-default-500"
                }
              />
            </Tooltip>
          }
        />
        <Tab
          key="favorites"
          title={
            <Tooltip content="Favorites">
              <Icon
                icon="akar-icons:star"
                width="1.7em"
                height="1.7em"
                className={
                  favouriteChats.length > 0
                    ? "text-success"
                    : "text-default-500"
                }
              />
            </Tooltip>
          }
        />
        <Tab
          key="calls"
          title={
            <Tooltip content="Calls">
              <Icon
                icon="mi:call"
                width="1.7em"
                height="1.7em"
                className={
                  selectedTab === "calls" ? "text-success" : "text-default-500"
                }
              />
            </Tooltip>
          }
        />

        <Tab
          key="favorites"
          title={
            <Tooltip content="Favorites">
              <Icon
                icon="akar-icons:star"
                width="1.7em"
                height="1.7em"
                className={
                  favouriteChats.length > 0
                    ? "text-success"
                    : "text-default-500"
                }
              />
            </Tooltip>
          }
        />
      </Tabs>

      <ScrollShadow
        hideScrollBar
        className="flex-1"
        // offset={100}
        // orientation="horizontal"
      >
        <div>
          {selectedTab === "chat" &&
            (loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error}</div>
            ) : chats.length === 0 ? (
              <div>No chats available.</div>
            ) : (
              chats.map((chat) => (
                <ChatCard
                  key={chat.user_id}
                  user_id={chat.user_id}
                  title={chat.name}
                  chipStatus={chat.status}
                  recent={chat.created_at}
                  time={chat.created_at}
                  number={chat.phone_no}
                  isFavourite={chat.is_favourite}
                  avtarValue={chat.avatar_value}
                  avatarType={chat.avatar_type}
                  chatType="private"
                  badgeCol={
                    chat.status.toLowerCase() === "active"
                      ? "success"
                      : "danger"
                  }
                />
              ))
            ))}
          {selectedTab === "groups" && (
            <div className="relative h-full">
              {/* <div>Group-specific logic here</div> */}
              <div className="flex flex-col items-center justify-center h-40 dark:bg-gray-800 bg-gray-200">
                <div className="flex flex-col items-center">
                  <Icon
                    icon="lets-icons:group"
                    width="2em"
                    height="2em"
                    className="text-gray-500"
                  />
                  <p className="text-md font-semibold text-gray-700 dark:text-white">
                    No groups yet
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    Add your first TeleChat group
                  </p>
                </div>
                <Button
                  onPress={() => setShowCreateGroupModal(true)}
                  className="mt-1 px-2 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
                >
                  + Add New Group
                </Button>
              </div>
              {/* Groups List */}
              {Array.isArray(groups) && groups.length > 0 && (
                <ul className="space-y-2">
                  {groups.map((group) => (
                    <ChatCard
                      key={group.id}
                      group_id={group.group_id}
                      title={group.group_name}
                      recent={group.created_at}
                      number={`${group.members?.length || 0} Members`}
                      avtarValue={group.avatar_value}
                      avatarType={group.avatar_type}
                      badgeCol="success"
                      chatType="group"
                    />
                  ))}
                </ul>
              )}
              
              {/* NextUI Modal */}
              <Modal
                isOpen={showCreateGroupModal}
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    setTimeout(() => {
                      setUsers([]);
                      setSelectedUsers([]);
                      setGroupName("");
                    }, 100); // Small delay to ensure modal transition completes
                  }
                  setShowCreateGroupModal(isOpen);
                }}
              >
                <ModalContent>
                  <ModalHeader className="text-lg font-semibold text-gray-600">
                    Create a New Group
                  </ModalHeader>
                  <AvatarIndex
                    isEditable={true}
                    avatarType={users.avatar_Type}
                    value={users.avatar_Value}
                    size={80}
                  />
                  <ModalBody className="mt-2">
                    <Input
                      type="text"
                      placeholder="Group Name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                    <p className="text-md text-gray-500 font-semibold mt-3">
                      Select Members
                    </p>

                    {/* Users List with Checkboxes */}
                    <ScrollShadow
                      hideScrollBar
                      className="max-h-64 overflow-auto flex-1"
                      // offset={100}
                      // orientation="vertical"
                    >
                      <div className="flex flex-col gap-2">
                        {users.map((user) => (
                          <div
                            key={user.user_id}
                            className="flex items-center gap-2 p-2 border-b"
                          >
                            <Checkbox
                              isSelected={selectedUsers.includes(user.user_id)}
                              onChange={() => handleUserSelect(user.user_id)}
                            />
                            <span>{user.name}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollShadow>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      color="default"
                      variant="flat"
                      onPress={() => setShowCreateGroupModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="flat"
                      color="success"
                      onPress={handleCreateGroup}
                    >
                      Create
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          )}
          {selectedTab === "favorites" && (
            <FavouritesChat chats={chats} favouriteChats={favouriteChats} />
          )}
          {selectedTab === "calls" && <div>Call-specific logic here</div>}
        </div>
      </ScrollShadow>
    </div>
  );
}
