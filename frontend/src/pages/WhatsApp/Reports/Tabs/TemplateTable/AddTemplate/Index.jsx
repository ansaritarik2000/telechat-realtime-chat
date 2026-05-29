import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";

export default function AddTemplateIndex({ open, onClose }) {
  const [meetingTitle, setMeetingTitle] = useState("");

  const handleCreateMeeting = () => {
    // Handle meeting creation logic here
    console.log("Meeting Created:", meetingTitle);
  };

  return (
    <Modal open={open} onClose={onClose} placement="top-center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">New Meeting</ModalHeader>
        <ModalBody>
          <Input
            autoFocus
            label="Meeting Title"
            placeholder="Enter meeting title"
            variant="flat"
            radius="sm"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
          />
          <Input
            disabled
            label="Meeting Invite"
            placeholder="Meeting invite link"
            variant="bordered"
            radius="sm"
            value={`https://meet.telepie.com/id?v=${meetingTitle}`}
            endContent={
              <Icon
                icon="ic:outline-copy-all"
                width="1.2em"
                height="1.2em"
                className="cursor-pointer"
              />
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose} radius="sm">
            Cancel
          </Button>
          <Button
            color="success"
            onPress={() => {
              handleCreateMeeting();
              onClose();
            }}
            radius="sm"
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
