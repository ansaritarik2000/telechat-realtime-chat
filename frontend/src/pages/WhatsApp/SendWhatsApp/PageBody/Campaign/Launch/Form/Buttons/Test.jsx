import React, { useEffect, useState } from "react";
import { Rocket } from "../../../../../../../../utils/ReusableIcons";
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
    addToast,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { sendTestWhatsappMessageService } from "../../../../../../../../services/Whatsapp/campaign/sendWhatsAppService";
import { useSendWhatsappStore } from "../../../../../../../../store/whatsapp/whatsappStore";
import toast from "react-hot-toast";
import { processAndSendCampaign, sendTestCampaign } from "../Utils/utils";

export default function TestBtn() {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [error, setError] = useState("");
    const [inputValue, setInputValue] = useState("");
    const { t } = useTranslation();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const {
        phoneNumbers,
        campaignId,
        wabaID,
        campaignName,
        selectedTemplateTypeSend,
        selectedTemplate,
        setTestPhoneNumbers,
        testPhoneNumbers,
        setPhoneNumbers,
        selectedTemplateName,
        selectedDate,
        singleTemplateData,
        MediaId,
        mediaUrl,
        csvFileContent,
        selectedExpirationDate,
        batchSize,
        interval,
    } = useSendWhatsappStore();

    useEffect(() => {
        setTestPhoneNumbers([]);
    }, []);

    const handleNumberChange = (e) => {
        const value = e.target.value;

        // Split by commas and clean up
        let numbersArray = value
            .split(",")
            .map((num) => num.trim())
            .filter((num) => num !== "");

        // Check if user is trying to enter more than 5 numbers
        if (numbersArray.length > 5) {
            // Keep only first 5 numbers
            numbersArray = numbersArray.slice(0, 5);
            const limitedValue = numbersArray.join(", ");
            setInputValue(limitedValue);
            setError("Maximum 5 phone numbers allowed");
            return;
        }

        // Format numbers to +91XXXXXXXXXX format
        const formattedNumbers = numbersArray.map((num) => {
            // Remove all non-digit characters
            const digitsOnly = num.replace(/\D/g, "");

            // If starts with 91 and has 10 more digits -> +91...
            if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
                return `+${digitsOnly}`;
            }
            // If starts with 0 and has 10 digits -> +91...
            else if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
                return `+91${digitsOnly.substring(1)}`;
            }
            // If 10 digits -> +91...
            else if (digitsOnly.length === 10) {
                return `+91${digitsOnly}`;
            }
            // Otherwise return as-is (assuming it's already in correct format)
            return num;
        });

        // Update states
        setInputValue(value);
        setTestPhoneNumbers(formattedNumbers);
        setPhoneNumbers(formattedNumbers);
        console.log(phoneNumbers);
        setError("");
    };
    // This fuction send the test campaign and also save the data in sever
    const handleSubmit = async () => {
        if (testPhoneNumbers.length === 0) {
            toast.error("Please enter at least one valid phone number");
            return;
        }
        try {
            // Prepare campaign data
            const campaignPayload = {
                campaignId,
                wabaID,
                campaignName,
                phoneNumbers,
                userId,
                status: "pending",
            };
            // Step 1: Create campaign in backend
            const response = await sendTestCampaign(campaignPayload);
            if (!response?.data.status) {
                addToast({
                    title: "Alert!",
                    description:
                        response.message || "Duplicate campaign not allowed.",
                    color: "success",
                });
                return;
            }
            addToast({
                title: "Test Campaign Launched!",
                description: "Your WhatsApp campaign has started successfully.",
                color: "success",
            });
            // If immediate campaign (no selectedDate), start processing
            if (!selectedDate) {
                const backendData = singleTemplateData[0];
                const campaignData = {
                    MediaId,
                    mediaUrl,
                    csvFileContent,
                    selectedExpirationDate,
                };
                const useCsvData = !!csvFileContent?.allData?.length;
                // Process with either provided or default batch settings
                const proccessResponse = await processAndSendCampaign(
                    phoneNumbers,
                    campaignData,
                    backendData,
                    batchSize ? batchSize : 0,
                    interval ? Array.from(interval)[0] : 0,
                    useCsvData ? variableMappings : null, // Only pass mappings if using CSV
                    useCsvData // Pass CSV usage flag
                );
                console.log(proccessResponse, 1);
                if (proccessResponse?.success) {
                    addToast({
                        title: "Test Campaign Launched!",
                        description:
                            "Your WhatsApp campaign Launched successfully.",
                        color: "success",
                    });
                    return;
                } else {
                    addToast({
                        title: "Campaign Failed!",
                        description: "This Error Releted to Meta Json Formate.",
                        color: "danger",
                    });
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            addToast({
                title: "Campaign Failed!",
                description: "This Error Releted to Meta Json Formate.",
                color: "danger",
            });
            return;
        }
    };

    const handleTestCampaign = () => {
        const isValidationFailed =
            !selectedTemplateTypeSend ||
            !selectedTemplate ||
            !selectedTemplateName;

        if (isValidationFailed) {
            addToast({
                title: "Error!",
                description:
                    "Please fill all required fields before proceeding.",
                color: "danger",
            });
            return;
        }
        onOpen();
    };

    return (
        <div>
            <Button
                isDisabled={!selectedTemplateName}
                size="sm"
                radius="sm"
                color="default"
                variant="flat"
                startContent={<Rocket size="1.4em" />}
                onPress={handleTestCampaign}
            >
                Test Campaign
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-1">
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
                                    label="Phone Numbers"
                                    size="md"
                                    radius="sm"
                                    variant="flat"
                                    value={inputValue}
                                    onChange={handleNumberChange}
                                    placeholder="e.g. 9876543210, +919876543210, 09876543210"
                                    className={error ? "border-red-500" : ""}
                                    description="Enter up to 5 numbers separated by commas"
                                />

                                {error && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {error}
                                    </p>
                                )}
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
                                    isDisabled={testPhoneNumbers.length === 0}
                                    onPress={() => {
                                        handleSubmit();
                                        onClose();
                                    }}
                                    variant="flat"
                                >
                                    {t("Run")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
