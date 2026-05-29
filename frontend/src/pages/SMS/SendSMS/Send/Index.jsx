import React, { useEffect, useState } from "react";
import {
    Button,
    RadioGroup,
    Radio,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tabs,
    Tab,
    Divider,
    Image,
    addToast,
    Alert,
} from "@heroui/react";
import CsvUpload from "./CsvUpload";
import NumberBox from "./NumBox";
import { Icon } from "@iconify-icon/react";
import { SelectSearch } from "./SelectSearch";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { useTranslation } from "react-i18next";
import SelectGroup from "../../../RCS/SendRCS/Send/SelectGroup";
import ContactFilter from "../../../RCS/SendRCS/Send/ContactFilter";
import SmsAudienceAlert from "../../../../components/smsAudienceAlert";

export default function SendIndex() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useTranslation();
    const [uploadCsvError, setUploadCsvError] = useState(null);

    // Close error message after 3 seconds
    useEffect(() => {
        if (uploadCsvError) {
            const timer = setTimeout(() => {
                setUploadCsvError(null);
            }, 3000); // Close after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [uploadCsvError]);

    // zustand store
    const {
        contactUploadedFrom,
        phoneNumbers,
        selectedRadio,
        setSelectedRadio,
    } = useSendSmsStore();

    return (
        <>
            <div
                className="px-6 py-4 rounded-lg cursor-pointer justify-between flex gap-3 items-center bg-content2 hover:bg-content3 transition-all duration-200 w-full "
                onClick={onOpen}
            >
                <div className="flex items-center gap-3 ">
                    <Image src="target-audience-icon.png" width={70} />

                    <span className="text-lg w-full text-default-500">
                        {t("Select your target audience")}
                    </span>
                </div>

                <div className="flex items-center justify-end -mb-12 text-xs text-default-400 ">
                    <Icon icon="fluent:people-48-filled" />
                    <span>
                        {t("Targeted Audience")}: {phoneNumbers?.length}
                    </span>
                </div>
            </div>
            {isOpen && (
                <Modal
                    size="2xl"
                    isOpen={isOpen}
                    onClose={onClose}
                    scrollBehavior="inside"
                    backdrop="blur"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalBody className="flex flex-col h-full">
                                    <ModalHeader className="flex flex-col gap-1">
                                        {/* Select your target audience */}
                                    </ModalHeader>
                                    {/* Tabs */}
                                    <Tabs
                                        color="success"
                                        variant="underlined"
                                        size="lg"
                                        aria-label="Send via options"
                                        className="-pl-4"
                                    >
                                        {/* CSv Uplaod Tab */}
                                        <Tab
                                            key="csv"
                                            title={t("Upload CSV")}
                                            className="pl-2"
                                        >
                                            {contactUploadedFrom &&
                                                contactUploadedFrom !==
                                                    "csv" && (
                                                    <SmsAudienceAlert />
                                                )}
                                            {/* Alert for errors */}
                                            {uploadCsvError && (
                                                <Alert
                                                    title="Error!"
                                                    description={uploadCsvError}
                                                    color="danger"
                                                    variant="flat"
                                                    isClosable
                                                    onClose={() =>
                                                        setUploadCsvError(null)
                                                    } // Clear error on close
                                                />
                                            )}
                                            {(!contactUploadedFrom ||
                                                contactUploadedFrom ===
                                                    "csv") && (
                                                <CsvUpload
                                                    setError={setUploadCsvError}
                                                />
                                            )}
                                        </Tab>
                                        {/* Copy paste Numbers */}
                                        <Tab
                                            key="numbers"
                                            title={t("Numbers")}
                                            className="pl-2"
                                        >
                                            {contactUploadedFrom &&
                                                contactUploadedFrom !==
                                                    "number" && (
                                                    <SmsAudienceAlert />
                                                )}

                                            {(!contactUploadedFrom ||
                                                contactUploadedFrom ===
                                                    "number") && <NumberBox />}
                                        </Tab>

                                        {/* Phonebook */}
                                        <Tab
                                            key="phonebook"
                                            title={t("Phonebook")}
                                            className="pl-2 h-full"
                                        >
                                            {contactUploadedFrom &&
                                                contactUploadedFrom !==
                                                    "phonebook" && (
                                                    <SmsAudienceAlert />
                                                )}
                                            {(!contactUploadedFrom ||
                                                contactUploadedFrom ===
                                                    "phonebook") && (
                                                <div className="rounded-md  h-full">
                                                    {/* Radio Options */}
                                                    <RadioGroup
                                                        orientation="horizontal"
                                                        label={t(
                                                            "Select Target Audience"
                                                        )}
                                                        color="success"
                                                        className="mb-4"
                                                        value={selectedRadio}
                                                        onValueChange={
                                                            setSelectedRadio
                                                        }
                                                    >
                                                        <Radio value="groups">
                                                            {t("Groups")}
                                                        </Radio>
                                                        <Radio value="contacts">
                                                            {t("Contacts")}
                                                        </Radio>
                                                    </RadioGroup>

                                                    {/* Body rendered when groups radio is selected */}
                                                    {selectedRadio ===
                                                        "groups" && (
                                                        <div>
                                                            {/* Select group search */}
                                                            <SelectGroup type="sms" />
                                                        </div>
                                                    )}

                                                    {/* Body rendered when contacts radio is selected */}
                                                    {selectedRadio ===
                                                        "contacts" && (
                                                        <ContactFilter type="sms" />
                                                    )}
                                                </div>
                                            )}
                                        </Tab>
                                    </Tabs>
                                </ModalBody>
                                <ModalFooter className="flex flex-col gap-4">
                                    {/* Total audience */}
                                    <div className="text-sm text-default-600 flex flex-col gap-2">
                                        <Divider />
                                        <span className="flex items-center text-success">
                                            <Icon
                                                icon="fluent:people-48-filled"
                                                width={"1.3em"}
                                            />
                                            {t("Total audience")}:{" "}
                                            {phoneNumbers?.length}
                                        </span>
                                    </div>
                                    {/* Btns */}
                                    <div className="self-end flex gap-2">
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            {t("Cancel")}
                                        </Button>
                                        <Button
                                            color="success"
                                            variant="flat"
                                            onPress={() => {
                                                // Check is any phone number is avail to send campaign ⚠️
                                                if (phoneNumbers.length === 0) {
                                                    addToast({
                                                        title: "Alert",
                                                        description:
                                                            "Please upload file or enter a valid phone number to proceed",
                                                        color: "warning",
                                                    });

                                                    return;
                                                }

                                                onClose();
                                            }}
                                        >
                                            {t("Select")}
                                        </Button>
                                    </div>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}
