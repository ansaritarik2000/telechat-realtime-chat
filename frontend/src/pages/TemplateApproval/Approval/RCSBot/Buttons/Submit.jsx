import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";
import TimerModal from "./TimerModal"; // Import TimerModal
import { CheckIcon } from "../../../../../utils/ReusableIcons";

export default function Submit({ onsubmit, redirectPath = "/rcsreports" }) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [displayTimer, setDisplayTimer] = useState(false);

  // Handle submit action
  const onSubmitHandler = () => {
    onsubmit(); // Call the passed-in submit function
    onClose(); // Close the confirmation modal
    // setDisplayTimer(true); // Show the Timer Modal after submission
  };

  // Handle closing Timer Modal manually
  const handleCloseTimerModal = () => {
    setDisplayTimer(false); // Hide the Timer Modal
  };

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
        {t("Create Bot")}
      </Button>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex justify-start items-center gap-1">
            <CheckIcon customClass="text-success" size="1.4em" />
            {t("Confirmation")}
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to send{" "}
              <span className="font-semibold">`templateName`</span> bot template
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
