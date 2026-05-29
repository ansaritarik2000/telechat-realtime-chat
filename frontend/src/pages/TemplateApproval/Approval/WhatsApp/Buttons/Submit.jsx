import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import TimerModal from "./TimerModal"; // Import TimerModal
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";

export default function Submit({ onsubmit, redirectPath = "/wareports" }) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose,  } = useDisclosure();
  const [displayTimer, setDisplayTimer] = useState(false);

  // Handle submit action
  const onSubmitHandler = () => {
    onsubmit(); // Call the passed-in submit function
    onClose(); // Close the confirmation modal
    setDisplayTimer(true); // Show the Timer Modal after submission
  };

  // Handle closing Timer Modal manually
  const handleCloseTimerModal = () => {
    setDisplayTimer(false); // Hide the Timer Modal
    // setDisplayMessage()
  };
 const {
     templateName,
   } = useWhatsappTemplateStore();
  return (
    <div>
      {/* Apply Button */}
      <Button
        size="md"
        radius="sm"
        endContent={
          <Icon icon="iconoir:submit-document" width="1.2em" height="1.2em" />
        }
        color="success"
        variant="shadow"
        onPress={onOpen}
        className="text-white"
      >
        {t("Apply")}
      </Button>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex justify-start items-center gap-1">
            <Icon
              icon="si:check-circle-duotone"
              width="24"
              height="24"
              className="text-success"
            />
            {t("Confirmation")}
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to send{" "}
              <span className="font-semibold">{templateName}</span> template
              for approval?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              {t("Cancel")}
            </Button>
            <Button color="success" variant="flat" onPress={onSubmitHandler}>
              {t("Yes")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Timer Modal */}
      {displayTimer && (
        <TimerModal onClose={handleCloseTimerModal} path={redirectPath} />
      )}
    </div>
  );
}
