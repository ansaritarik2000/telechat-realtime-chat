import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalContent,
    useDisclosure,
    Input,
    ModalFooter,
    Divider,
    Chip,
    Code,
    Snippet,
    DatePicker,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useSendSmsStore } from "../../../store/sendSmsStore";
import { LinkIcon } from "../../../utils/ReusableIcons";
import PulsatingDot from "../../../components/Common/PulsatingDot";
import { I18nProvider } from "@react-aria/i18n";
export default function InsertURL() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    // Local state for Target URL and Expiration Date
    const [targetUrl, setTargetUrl] = useState("");
    const [expirationDate, setExpirationDate] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState("https://1tp.in");

    // zustand store
    const {
        phoneNumbers,
        selectedHeader,
        selectedTemplateType,
        shortUrlMainDomain,
        triggerUrl,
        shortUrl,
        batchSize,
        interval,
        campaignName,
        selectedDate,
        userId,
        selectedTemplate,
        setTriggerUrl,
        setShortUrl,
        shortURL,
    } = useSendSmsStore();

    const { t } = useTranslation();

    // on shortner handller
    const onShortnerHandller = () => {
        setShortUrl("https://1tp.in/telepie/asdbiqwn");
        onClose();
    };

    // Example: handle Target URL change
    const handleTargetUrlChange = (e) => {
        setTargetUrl(e.target.value);
    };

    // Example: handle Expiration Date change (adjust as per your DatePicker implementation)
    const handleExpirationDateChange = (date) => {
        setExpirationDate(date);
    };

    // Handler for select change
    const handleDomainChange = (e) => {
        setSelectedDomain(e.target.value);
    };

    // on open modal
    const onOpenModal = () => {
        setShortUrl("");
        onOpen();
    };

    return (
        <div>
            <Button
                size="sm"
                radius="sm"
                color="default"
                variant="flat"
                onPress={onOpenModal}
                isDisabled={
                    !phoneNumbers.length ||
                    !selectedHeader?.id ||
                    !selectedTemplateType?.id ||
                    !selectedTemplate?.id ||
                    !campaignName ||
                    !userId ||
                    !selectedTemplate?.message_vars
                }
                startContent={<LinkIcon size="1.4em" />}>
                {t("Insert Short URL")}
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                placement="top-center"
                size="md"
                className="h-[30rem]">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-1">
                                <LinkIcon />
                                Insert Short URL
                            </ModalHeader>

                            <ModalBody>
                                <div className="flex flex-col gap-4 h-full">
                                    <div className="flex items-center justify-between gap-1 p-3 rounded-md bg-content2">
                                        <p className=" text-sm">
                                            Your Shortener Domain
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {/* Pulsating Dot */}
                                            <PulsatingDot color="success" />

                                            <select
                                                value={selectedDomain}
                                                onChange={handleDomainChange}
                                                className="bg-content2">
                                                <option value="https://1tp.in">
                                                    <p className="text-foreground font-medium">
                                                        1tp.in
                                                    </p>
                                                </option>
                                                <option value="https://2tp.in">
                                                    <p className="text-foreground font-medium">
                                                        2tp.in
                                                    </p>
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Input
                                            isRequired
                                            label="Target URL"
                                            placeholder="Enter URL to shorten"
                                            variant="bordered"
                                            radius="sm"
                                            size="md"
                                        />

                                        {/* Expiration Date Picker (Optional) */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground-600 mb-1">
                                                Expiration Date{" "}
                                                <span className="text-xs text-foreground-500">
                                                    (Optional)
                                                </span>
                                            </label>
                                            <I18nProvider locale="en-GB">
                                                <DatePicker
                                                    value={expirationDate}
                                                    onChange={
                                                        handleExpirationDateChange
                                                    }
                                                    placeholder="Select expiration date"
                                                    size="md"
                                                    radius="sm"
                                                    // Add any additional props as per your DatePicker
                                                />
                                            </I18nProvider>
                                        </div>

                                        <Button
                                            color="success"
                                            variant="flat"
                                            radius="sm"
                                            size="md">
                                            Shorten URL
                                        </Button>
                                    </div>

                                    {/* Shortened URL */}
                                    <div className="">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <p className="text-foreground-600 text-sm font-medium">
                                                Shortened URL
                                            </p>
                                            <div className="px-1.5 py-0.5 bg-success/10 rounded-sm">
                                                <p className="text-success text-xs font-medium">
                                                    Ready to use
                                                </p>
                                            </div>
                                        </div>

                                        <Snippet
                                            symbol=""
                                            variant="bordered"
                                            className="w-full">
                                            {shortURL || "https://1tp.in/{UID}"}
                                        </Snippet>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="flex flex-col gap-1">
                                <Divider />
                                <div className="flex gap-4 justify-end items-center my-2">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                        radius="sm">
                                        Cancel
                                    </Button>
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onPress={onShortnerHandller}
                                        radius="sm">
                                        Insert
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
