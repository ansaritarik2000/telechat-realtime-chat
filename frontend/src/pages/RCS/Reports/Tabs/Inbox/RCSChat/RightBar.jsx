import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import AssignDetails from "./AssignDetails";
import AvatarIndex from "../../../../../../components/AvatarGen/Index";

const DetailsCard = ({ name, number, item }) => (
  <div className="flex justify-between flex-col items-center gap-4 mt-3">
    <AvatarIndex
      isEditable={false}
      // avatarType={item?.avatar_type}
      avatarType="shape"
      value={item?.avatar_value || name}
      size={130}
    />
    <div className="flex flex-col items-end">
      {/* <p className="font-semibold text-md">{name}</p> */}
      <p className=" text-sm text-default-500">
        <div className="flex justify-center text-sm font-semibold items-center gap-1">
          <Icon icon="mi:call" width="1.5em" height="1.5em" />
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
    isPinned = false,
    item = {},
    rightbarStatus,
  } = props;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-[300px] h-full border  flex flex-col gap-4 rounded-2xl p-4 bg-white dark:bg-background border-transparent pt-3 ">
      {/* Details Card */}
      <DetailsCard pfp={pfp} name={name} number={number} />

      <div className="flex flex-col gap-2 w-full justify-between h-full ">
        {/* Assign Details */}
        <AssignDetails item={item} />

        {/* Del chat btn */}
        <Button
          size="sm"
          variant="flat"
          color="danger"
          startContent={<Icon icon="ph:trash" width="1.2em" height="1.2em" />}
          onPress={onOpen}
        >
          Delete Chat
        </Button>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <Icon
                    icon="ph:warning-duotone"
                    width="30"
                    height="30"
                    className="mr-1"
                    style={{ color: "#d51e1e" }}
                  />
                  Confirmation
                </ModalHeader>
                <ModalBody>
                  <p>Are you sure, you want to delete the chat?</p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="danger" onPress={onClose} variant="flat">
                    Yes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
