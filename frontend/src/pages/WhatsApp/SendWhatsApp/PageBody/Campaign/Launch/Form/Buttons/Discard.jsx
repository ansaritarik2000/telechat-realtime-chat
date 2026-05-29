import React from "react";
import { Icon } from "@iconify-icon/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function Discard({ discardHandller }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button
        size="md"
        radius="sm"
        startContent={
          <Icon icon="iconamoon:trash-bold" width="1.3em" height="1.3em" />
        }
        color="danger"
        variant="bordered"
        onPress={onOpen}
      >
        Discard
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
                <p>Are you sure you want to discard the campaign?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={onClose}
                  onClick={discardHandller}
                  variant="flat"
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
