import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function ConfirmationModal({
  isOpen, // Controls modal visibility
  onClose, // Callback to close the modal
  title, // Title of the modal
  titleIcon, // Optional icon for the title
  bodyContent, // Content inside the modal body
  cancelLabel = "Cancel", // Label for the cancel button
  cancelColor = "default",
  confirmLabel = "Confirm", // Label for the confirm button
  confirmColor = "danger",
  onConfirm, // Optional callback for the confirm button
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="flex gap-1 items-center justify-center">
                {titleIcon && <span className="mt-2">{titleIcon}</span>}
                {title}
              </div>
            </ModalHeader>
            <ModalBody>{bodyContent}</ModalBody>
            <ModalFooter>
              <Button
                color={cancelColor}
                size="sm"
                variant="light"
                onPress={onClose}
              >
                {cancelLabel}
              </Button>
              <Button
                color={confirmColor}
                size="sm"
                variant="flat"
                onPress={() => {
                  onConfirm?.(); // Trigger confirm action if provided
                  onClose(); // Close modal after action
                }}
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
