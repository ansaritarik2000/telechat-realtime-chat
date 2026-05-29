import React, { useEffect, Suspense } from "react";
import { Icon } from "@iconify-icon/react";
import { Button, useDisclosure } from "@heroui/react";

import { useSendRcStore } from "../../../../store/sendRcsStore";
import { addToast } from "@heroui/toast";
import { CheckIcon } from "../../../../utils/ReusableIcons";

// Lazy load the Modal and AnimatedCheckModal components
const Modal = React.lazy(() =>
    import("@heroui/react").then((module) => ({ default: module.Modal }))
);
const ModalContent = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalContent,
    }))
);
const ModalHeader = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalHeader,
    }))
);
const ModalBody = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalBody,
    }))
);
const ModalFooter = React.lazy(() =>
    import("@heroui/react").then((module) => ({
        default: module.ModalFooter,
    }))
);
const AnimatedCheckModal = React.lazy(() => import("./AnimatedCheckModal"));

export default function Submit({ onSubmit }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Destructure the state from your store
    const { sendRcsAnimationModelOpen } = useSendRcStore();

    // Use useEffect to listen for changes in sendRcsAnimationModelOpen
    useEffect(() => {
        // If sendRcsAnimationModelOpen is true, close the confirmation modal
        if (sendRcsAnimationModelOpen) {
            onOpenChange(false); // Close the confirmation modal
        }
    }, [sendRcsAnimationModelOpen]);

    // zustand store
    const {
        template,
        selectedTemplateType,
        selectedBot,
        phoneNumbers,
        interval,
        batchSize,
        splitCampaign,
    } = useSendRcStore();

    function handleSubmitButtonAndOpenModel() {
        // Check for missing required fields
        if (
            phoneNumbers.length === 0 || // Check if phone numbers are missing
            !selectedBot?.id || // Check if bot is not selected
            !selectedTemplateType?.id || // Check if template type is not selected
            !template?.type || // Check if template is not selected
            (splitCampaign && (batchSize === 0 || interval.length === 0)) // Check split campaign fields
        ) {
            // Show a common toast message for validation error
            addToast({
                title: "Error",
                description:
                    "Please fill all required fields before launching campaign.",
                color: "danger",
            });
            return;
        }

        // If all validations pass, open the modal
        onOpen();
    }
    return (
        <div>
            <Button
                size="md"
                radius="sm"
                endContent={
                    <Icon
                        icon="mingcute:send-plane-line"
                        width="1.3em"
                        height="1.3em"
                    />
                }
                color="success"
                variant="shadow"
                onPress={handleSubmitButtonAndOpenModel}
                className="text-white"
            >
                Send
            </Button>
            <Suspense fallback={null}>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex gap-1 items-center">
                                    <CheckIcon customClass="text-success" />
                                    <p className="font-semibold">
                                        Confirmation
                                    </p>
                                </ModalHeader>
                                <ModalBody>
                                    <p>
                                        Are you sure you want to launch the{" "}
                                        <span className="font-semibold">
                                            {selectedTemplateType?.name}
                                        </span>{" "}
                                        campaign?
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onPress={onSubmit}
                                    >
                                        Yes
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </Suspense>
            {/* Modal after launching the campaign */}
            <Suspense fallback={<div>Loading...</div>}>
                <AnimatedCheckModal onOpenChange={onOpenChange} />
            </Suspense>
        </div>
    );
}
