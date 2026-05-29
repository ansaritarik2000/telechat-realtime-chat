import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
} from "@heroui/react";

export default function TestModal({ openModal, closeModal }) {
  return (
    <div>
      <Modal isOpen={openModal} onOpenChange={closeModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmation
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to proceed with test?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="light"
                  variant="flat"
                  onPress={() => closeModal()}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  variant="flat"
                  onPress={() => closeModal()}
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
