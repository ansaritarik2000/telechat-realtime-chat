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
    Image,
} from "@heroui/react";
import { sendTestRCSservice } from "../../../../services/Rcs/sendRcsService";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import { useTranslation } from "react-i18next";
import { LoaderIcon, Rocket } from "../../../../utils/ReusableIcons";
import { addToast } from "@heroui/toast";
import { useMutation } from "@tanstack/react-query";

export default function TestBtn() {
    // zustand store
    const {
        template,
        selectedTemplateType,
        selectedBot,
        batchSize,
        interval,
        campaignName,
        selectedDate,
        userId,
    } = useSendRcStore();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { t } = useTranslation();
    const user_id = localStorage.getItem("user_id");
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

    // Function to handle form submission
    const { mutateAsync: handleSubmit, isPending: isRcsInTesting } =
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
                // Prepare the RCS data to send
                const rcsData = {
                    campaign_name: campaignName,
                    phone_numbers: numbersArray,
                    template_id: template?.id,
                    template_type_id: selectedTemplateType?.id,
                    bot_id: selectedBot?.id,
                    campaign_date: formattedDate,
                    batch_size: parseInt(batchSize),
                    user_id,
                    unique_id: userId, // this is campaign id
                    interval:
                        interval && arrayInterval.length > 0
                            ? parseInt(arrayInterval[0])
                            : null,
                };
                // Call the service function to send RCS data
                const res = await sendTestRCSservice(rcsData);

                return res;
            },

            onSuccess: () => {
                // Close the modal or perform other actions
                onOpenChange(false);

                addToast({
                    title: "Success",
                    description:
                        "RCS Test Campaign has been successfully launched.",
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
                    !template?.id ||
                    !selectedTemplateType?.id ||
                    !selectedBot?.id
                }
                onPress={() => {
                    // Consolidate validation logic
                    const isValidationFailed =
                        !selectedBot?.id || // Check if bot is not selected
                        !selectedTemplateType?.id || // Check if template type is not selected
                        !template?.type; // Check if template is not selected

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
                }}
                startContent={
                    <Icon
                        icon="heroicons:rocket-launch"
                        width="1.4em"
                        height="1.4em"
                    />
                }
            >
                {t("Test Campaign")}
            </Button>

            {/* Modal Content */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1 items-center">
                                <Rocket size="1.2em" />
                                {t("Test Campaign")}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex items-center justify-center">
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

                                {/* <Textarea
                                    readOnly
                                    label="Message Preview"
                                    labelPlacement="outside"
                                    radius="sm"
                                    value="Hi {user}, Your OTP to verify your account is {otp}."
                                /> */}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    isDisabled={isRcsInTesting}
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
                                    {isRcsInTesting ? (
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
