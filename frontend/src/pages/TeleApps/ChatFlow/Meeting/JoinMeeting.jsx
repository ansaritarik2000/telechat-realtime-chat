import React, { useContext, lazy, Suspense } from "react";
import { Icon } from "@iconify-icon/react";
import { useDisclosure, Input, Button } from "@heroui/react";

// Lazy load the Modal components
const Modal = lazy(() =>
  import("@heroui/react").then((module) => ({ default: module.Modal }))
);
const ModalContent = lazy(() =>
  import("@heroui/react").then((module) => ({
    default: module.ModalContent,
  }))
);
const ModalHeader = lazy(() =>
  import("@heroui/react").then((module) => ({
    default: module.ModalHeader,
  }))
);
const ModalBody = lazy(() =>
  import("@heroui/react").then((module) => ({
    default: module.ModalBody,
  }))
);
const ModalFooter = lazy(() =>
  import("@heroui/react").then((module) => ({
    default: module.ModalFooter,
  }))
);

export default function JoinMeeting() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="w-1/3">
      <div
        onClick={onOpen}
        className="rounded-lg py-10 px-8 flex flex-col bg-success-50 gap-20 justify-start items-start cursor-pointer hover:border-2 hover:shadow-sm  active:border active:border-success transition-all"
      >
        <Icon icon="bi:person-plus" width="3em" height="3em" />
        <div>
          <h1 className="text-2xl font-semibold text-defualt-500">
            Join Meeting
          </h1>
          <h2 className="text-defualt-500">Via invitation link</h2>
        </div>
      </div>

      {/* Use Suspense with a fallback to handle lazy-loaded components */}
      <Suspense fallback={null}>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col text-lg gap-1">
                  Join Meeting
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Meeting URL"
                    placeholder="Enter meeting URL"
                    variant="flat"
                    radius="sm"
                  />
                </ModalBody>

                <ModalFooter>
                  <Button
                    color="default"
                    variant="flat"
                    onPress={onClose}
                    radius="sm"
                  >
                    Cancel
                  </Button>
                  <Button color="success" onPress={onClose} radius="sm">
                    Join
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </Suspense>
    </div>
  );
}
