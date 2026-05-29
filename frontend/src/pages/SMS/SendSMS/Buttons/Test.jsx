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
    Input,
    Textarea,
    Image,
    addToast,
} from "@heroui/react";

import { LoaderIcon, Rocket } from "../../../../utils/ReusableIcons";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { t } from "i18next";
import { sendTestSMSservice } from "../../../../services/Sms/sendSmsService";
import { useMutation } from "@tanstack/react-query";

export default function TestBtn() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [numbers, setNumbers] = useState("");
    const [error, setError] = useState(""); // To track error message

    // Function to handle number input change and validate
    const handleNumberChange = (e) => {
        const value = e.target.value;
        setNumbers(value);

        // Convert the string to an array of comma-separated values
        const numbersArray = value.split(",").map((num) => num.trim());

        // Check if more than 5 numbers are entered
        if (numbersArray.length > 5) {
            setError("You can enter a maximum of 5 numbers.");
        } else {
            setError(""); // Clear error if valid
        }
    };

    // zustand store
    const {
        selectedHeader,
        selectedTemplateType,
        batchSize,
        interval,
        campaignName,
        selectedDate,
        userId,
        selectedTemplate,
    } = useSendSmsStore();

    function handleSubmitButtonAndOpenModel() {
        // Consolidate validation logic
        const isValidationFailed =
            !selectedTemplateType?.id || // Check if template type is not selected
            !selectedTemplate?.id || // Check if template is not selected
            !selectedHeader?.id; // Check if header is not selected

        // If validation fails, show a common toast message
        if (isValidationFailed) {
            addToast({
                title: "Validation Error",
                description:
                    "Please fill all required fields before proceeding.",
                color: "danger",
            });
            return;
        }

        // Open modal after validation is complete
        onOpen();
    }

    // Function to handle form submission
    const { mutateAsync: handleSubmit, isPending: isSMSInTesting } =
        useMutation({
            mutationFn: async () => {
                const numbersArray = numbers
                    .split(",")
                    .map((num) => num.trim());

                if (!numbers) {
                    throw new Error(
                        "Please enter at least one phone number to proceed."
                    );
                }

                if (numbersArray.length > 5) {
                    setError("You can enter a maximum of 5 numbers.");
                    throw new Error("You can enter a maximum of 5 numbers.");
                }

                // formated date
                const formattedDate = selectedDate
                    ? new Date(selectedDate).toISOString()
                    : null;

                const arrayInterval = [...interval];
                // Prepare the SMS data to send
                const smsData = {
                    campaign_name: campaignName,
                    phone_numbers: numbersArray,
                    template_id: selectedTemplate?.id,
                    template_type_id: selectedTemplateType?.id,
                    header_id: selectedHeader?.id,
                    campaign_date: formattedDate,
                    batch_size: parseInt(batchSize),
                    user_id: userId,
                    interval:
                        interval && arrayInterval.length > 0
                            ? parseInt(arrayInterval[0])
                            : null,
                    // is_flash_sms: sendAsFlashSMS,
                };
                // Call the service function to send SMS data
                const res = await sendTestSMSservice(smsData);

                return res;
            },

            onSuccess: () => {
                // Close the modal or perform other actions
                onOpenChange(false);

                addToast({
                    title: "Test Campaign Launched",
                    description:
                        "SMS Test Campaign has been successfully launched.",
                    color: "success",
                });
            },

            onError: (e) => {
                addToast({
                    title: e.name,
                    description: e.message,
                    color: "warning",
                });
            },
        });

    return (
        <div>
            <Button
                size="sm"
                radius="sm"
                color="default"
                variant="flat"
                isDisabled={
                    !selectedTemplateType?.id ||
                    !selectedTemplate?.id ||
                    !selectedHeader?.id ||
                    !campaignName ||
                    !userId
                }
                onPress={handleSubmitButtonAndOpenModel}
            >
                <Rocket size="1.2em" />
                {t("Test Campaign")}
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1 items-center">
                                <Rocket size="1.2em" />
                                Test Campaign
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex justify-center">
                                    <Image
                                        src="/Gifs/sendFly.gif"
                                        alt="fly icon"
                                        width={120}
                                    />
                                </div>

                                <Input
                                    isRequired
                                    label={t("Numbers")}
                                    size="md"
                                    radius="sm"
                                    variant="flat"
                                    placeholder="+916004893457,+919399030661"
                                    value={numbers}
                                    onChange={handleNumberChange}
                                    className={`${
                                        error ? "border-red-500" : ""
                                    }`}
                                />
                                <span className="flex items-center text-gray-500 text-xs ml-1">
                                    <span className="text-red-500">*</span>{" "}
                                    <span>
                                        {t(
                                            "Please enter phone numbers separated by commas"
                                        )}
                                        " , ".
                                    </span>
                                </span>
                                {error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {error}
                                    </p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    isDisabled={isSMSInTesting}
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    {t("Cancel")}
                                </Button>
                                <Button
                                    color="success"
                                    isDisabled={!!error}
                                    onPress={() => handleSubmit()}
                                    variant="solid"
                                >
                                    {isSMSInTesting ? (
                                        <LoaderIcon customClass="text-white" />
                                    ) : (
                                        t("Run")
                                    )}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
