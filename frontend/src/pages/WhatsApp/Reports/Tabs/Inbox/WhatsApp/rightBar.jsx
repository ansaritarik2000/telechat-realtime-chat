import React, { useEffect, useState } from "react";
import {
  Image,
  Button,
  Chip,
  Modal,
  useDisclosure,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import AssignDetails from "./AssignDetails";
import AvatarIndex from "../../../../../../components/AvatarGen/Index";
import { useSendWhatsappStore } from "../../../../../../store/whatsapp/whatsappStore";
import { pinChatService } from "../../../../../../services/Whatsapp/chats/pinChatService";
import toast from "react-hot-toast";

const DetailsCard = ({ name, number, item }) => (
  <div className="flex justify-center flex-col  items-center gap-2">
    {/* <Image src={pfp} width={150} radius="full" isZoomed /> */}

    <AvatarIndex
      isEditable={false}
      avatarType={item?.avatar_type}
      value={item?.avatar_value || name}
      size={100}
    />
    <div className="flex flex-col justify-center items-center">
      <p className="font-semibold text-md">{name}</p>
      <p className=" text-sm text-default-500">
        <div className="flex justify-center text-xs items-center gap-1">
          <Icon
            icon="mi:call"
            width="1em"
            height="1em"
            className="cursor-pointer"
          />
          {number}
        </div>
      </p>
    </div>
  </div>
);

export default function RightBarSection(props) {
  const {
    pfp = "https://picsum.photos/id/57/200/200",
    name = "Nawaz Ali",
    number = "+917004893457",
    email = "user@telepie.com",
    item = {},
  } = props;
  const { isPinned, setIsPinned } = useSendWhatsappStore();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const handleDeleteChat = () => {
    // Replace this with actual delete logic
    toast.success("Chat deleted successfully");
    onClose();
  };
  const token = localStorage.getItem("token");
  // this function is used for pinned / unpinned chat
  const handlePinnedChat = async () => {
    // call unpin chat service
    try {
      const response = await pinChatService(token, {
        phone_number: number,
        is_pinned: !isPinned,
      });

      if (response.status === "SUCCESS") {
        setIsPinned(!isPinned);
        if (isPinned) {
          toast.success("Chat unpinned successfully");
        } else {
          toast.success("Chat pinned successfully");
        }
      } else {
        if (isPinned) {
          toast.error("Failed to unpin chat");
        } else {
          toast.error("Failed to pin chat");
        }
      }
    } catch (error) {
      if (isPinned) {
        toast.error("Failed to unpin chat");
      } else {
        toast.error("Failed to pin chat");
      }
    }
    setIsPinned(!isPinned);
  };

  return (
    <div className="w-[300px] h-full border flex flex-col rounded-2xl p-4 bg-white dark:bg-background border-transparent pt-3 gap-3">
      {/* Profile Pic Name, Number */}
      <DetailsCard pfp={pfp} name={name} number={number} />

      <div className="flex flex-col gap-2 w-full justify-between h-full">
        <div className="w-full flex flex-col gap-4">
          {/* Add to favs btn */}
          <Button
            size="sm"
            variant="flat"
            color="warning"
            onPress={handlePinnedChat}
            startContent={
              <Icon
                icon={
                  isPinned ? "fluent:pin-16-regular" : "fluent:pin-48-filled"
                }
                width="1.7em"
                height="1.7em"
              />
            }
          >
            {isPinned ? "Unpin Conversation" : "Pin Conversation"}
          </Button>

          {/* Assign Details */}
          <AssignDetails item={item} />
        </div>

        {/* Del chat btn */}
        <Button
          size="sm"
          variant="flat"
          onPress={onOpen}
          color="danger"
          startContent={<Icon icon="ph:trash" width="1.2em" height="1.2em" />}
        >
          Delete Chat
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-1">
                <Icon
                  icon="ph:warning-duotone"
                  width="30"
                  height="30"
                  className="mr-1 text-danger"
                />
                Confirmation
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete your conversation with{" "}
                  <span className="font-bold">{name}</span>? This action is
                  irreversible.
                </p>
              </ModalBody>

              <ModalFooter>
                <Button auto flat variant="light" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  auto
                  flat
                  color="danger"
                  variant="flat"
                  onClick={handleDeleteChat}
                >
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
