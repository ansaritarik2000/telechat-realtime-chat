import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

// Timer Component to handle the countdown and redirect
const TimerComponent = ({ path }) => {
  const [time, setTime] = useState(5);
  const navigate = useNavigate();

  // Start the countdown when the component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, []);

  // Handle redirect when timer reaches zero
  useEffect(() => {
    if (time === 0) {
      navigate(path); // Redirect to the passed path
    }
  }, [time, navigate, path]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-default-500">
        Redirecting you to the next page in <strong>{time}</strong> seconds...
      </p>
    </div>
  );
};

export default function Submit({
  onSubmit = () => {},
  redirectPath = "/rcsreports",
}) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [displayTimer, setDisplayTimer] = useState(true);
  const [launchCampaign, setLaunchCampaign] = useState(false);
  const { t } = useTranslation();

  // onSubmit handler
  const onSubmitHandler = () => {
    onSubmit();
    onClose();
  };

  return (
    <div>
      <Button
        size="md"
        radius="sm"
        endContent={
          <Icon icon="iconoir:submit-document" width="1.2em" height="1.2em" />
        }
        color="success"
        variant="shadow"
        className="text-white rounded-lg"
        onPress={onOpen}
      >
        {t("Apply")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalHeader className="flex justify-start items-center gap-1">
              <Icon
                icon="bx:check-circle"
                width="24"
                height="24"
                //   className="text-sucess"
              />
              {t("Confirmation")}
            </ModalHeader>
            <ModalBody>
              {displayTimer ? (
                <TimerComponent path={redirectPath} />
              ) : (
                <p className="text-sm text-default-500">
                  Are you sure you want to apply the template?
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="success" variant="flat" onPress={onSubmitHandler}>
                Yes
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
