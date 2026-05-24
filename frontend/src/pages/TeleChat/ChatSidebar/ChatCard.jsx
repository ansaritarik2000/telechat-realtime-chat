import React, { useContext, useCallback } from "react";
import { Image } from "@heroui/react";
import { TeleChatContext } from "../ChatBody";
import ChatSection from "./ChatSection";
import RightBarSection from "./RightBar";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import GroupChatSection from "./GroupChatSection";
import RightBarGroupSection from "./RightBarGroup";

const chipColorMapping = {
  active: "success",
  closed: "primary",
  pending: "warning",
};

export default function ChatCard(props) {
  const { setChatView, setRightBar, setRightBarVisible } =
    useContext(TeleChatContext);

  const {
    user_id,
    group_id,
    title = "Client Name",
    chipStatus = "active",
    recent = "Last message sent",
    time = "14 August, 11:30 AM",
    number,
    is_favourite,
    avatarURL,
    avtarValue,
    avatarType,
    day = "23, Aug",
    badgeCol,
    chatType,
  } = props;
  const chipColor = chipColorMapping[chipStatus] || "default";
  const loginUserId = localStorage.getItem("loginUser_id");


  const handleClick = useCallback(() => {
    if (chatType === "private") {
      setChatView(
        <ChatSection
          title={title}
          number={number}
          avatarURL={avatarURL}
          badgeCol={badgeCol}
          user_id={user_id}
          avatar={
            <AvatarIndex
              isEditable={false}
              avatarType={avatarType}
              value={avtarValue || title}
              size={45}
            />
          }
        />
      );
  
      setRightBar(
        <RightBarSection
          user_id={user_id}
          pfp={
            <AvatarIndex
              isEditable={false}
              avatarType={avatarType}
              value={avtarValue || title}
              size={100}
            />
          }
          name={title}
          number={number}
        />
      );
    }
  
    if (chatType === "group") {
      setChatView(
        <GroupChatSection
          key={group_id}
          groupId={group_id}
          title={title}
          badgeCol={badgeCol}
          avatarURL={avatarURL}
          avatar={
            <AvatarIndex
              isEditable={false}
              avatarType={avatarType}
              value={avtarValue || title}
              size={45}
            />
          }
        />
      );
  
      setRightBar(
        <RightBarGroupSection
          groupId={group_id}
          pfp={
            <AvatarIndex
              isEditable={false}
              avatarType={avatarType}
              value={avtarValue || title}
              size={100}
            />
          }
          name={title}
          avatarType={avatarType}
          avtarValue={avtarValue}
        />
      );
    }
  
    setRightBarVisible(true);
  });
  

  return (
    <div
      className="flex gap-2 py-3 px-4 bg-white dark:bg-background hover:cursor-pointer border-t border-default-200 w-full"
      onClick={handleClick}
    >
      {/* <Image src={avatarURL} width={60} radius="full" /> */}
      <AvatarIndex
        isEditable={false}
        avatarType={avatarType}
        value={avtarValue || title}
        size={40}
      />
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2 justify-center">
          {/* <p>{chatType}</p> */}
          <p className="font-semibold text-sm">{title}</p>
          {/* <p className="text-xs font-large text-default-500">{recent}</p> */}
        </div>

        <div className="flex flex-col gap-2 justify-center items-end">
          <p className="text-xs text-default-500">{time}</p>
          {/* <p className="text-xs text-default-500">{day}</p> */}
        </div>
      </div>
    </div>
  );
}
