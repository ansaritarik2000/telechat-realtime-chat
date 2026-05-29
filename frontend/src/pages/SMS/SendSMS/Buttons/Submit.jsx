import React, { Suspense, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    addToast,
} from "@heroui/react";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import { useTranslation } from "react-i18next";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { CheckIcon } from "../../../../utils/ReusableIcons";
const AnimatedCheckModal = React.lazy(() =>
    import("../../../RCS/SendRCS/Buttons/AnimatedCheckModal")
);

export default function Submit({ onSubmit }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { sendRcsAnimationModelOpen } = useSendRcStore();
    const { t } = useTranslation();

    // Use useEffect for close launch campaign confirmation modal
    useEffect(() => {
        // If sendRcsAnimationModelOpen is true, close the confirmation modal
        if (sendRcsAnimationModelOpen) {
            onOpenChange(false); // Close the confirmation modal
        }
    }, [sendRcsAnimationModelOpen]);

    // zustand store
    const {
        selectedHeader,
        selectedTemplateType,
        selectedTemplate,
        phoneNumbers,
        interval,
        batchSize,
        splitCampaign,
    } = useSendSmsStore();

    function handleSubmitButtonAndOpenModel() {
        // Consolidate validation logic
        const isValidationFailed =
            phoneNumbers.length === 0 || // Check if phone numbers are missing
            !selectedTemplateType?.id || // Check if template type is not selected
            !selectedTemplate?.id || // Check if template is not selected
            !selectedHeader?.id || // Check if header is not selected
            (splitCampaign && (batchSize === 0 || interval.length === 0)); // Check split campaign fields

        // If validation fails, show a common toast message
        if (isValidationFailed) {
            addToast({
                title: "Error",
                description:
                    "Please fill all required fields before launching campaign.",
                color: "danger",
            });
            return;
        }

        // Open modal after validation is complete
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
                        width="1.2em"
                        height="1.2em"
                    />
                }
                color="success"
                variant="shadow"
                onPress={handleSubmitButtonAndOpenModel}
                className="text-white">
                {t("Send")}
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1 items-center">
                                <CheckIcon customClass="text-success" />
                                <p className="font-semibold">Confirmation</p>
                            </ModalHeader>
                            <ModalBody className="">
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
                                    onPress={onClose}>
                                    {t("Cancel")}
                                </Button>
                                <Button
                                    color="success"
                                    variant="flat"
                                    onPress={onSubmit}>
                                    {t("Yes")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal after launching the campaign */}
            <Suspense fallback={<div>Loading...</div>}>
                <AnimatedCheckModal onOpenChange={onOpenChange} delay={1500} />
            </Suspense>
        </div>
    );
}
