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
    Select,
    SelectItem,
    Alert,
    addToast,
} from "@heroui/react";
import NumberBox from "./NumberBox";
import { Icon } from "@iconify-icon/react";
import { SelectSearch } from "./SelectSearch";
import { useTranslation } from "react-i18next";
import CsvUpload from "./CSVUpload";
import SelectGroup from "../../../../RCS/SendRCS/Send/SelectGroup";
import ContactFilter from "../../../../RCS/SendRCS/Send/ContactFilter";
import EmailBox from "./EmailBox";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";

const filterItems = [
    { key: "name", label: "Name", icon: "iconamoon:profile-circle-light" },
    {
        key: "first_name",
        label: "First Name",
        icon: "solar:text-circle-outline",
    },
    { key: "last_name", label: "Last Name", icon: "solar:text-circle-outline" },
    { key: "email", label: "Email", icon: "mdi:email-outline" },
    { key: "phone", label: "Phone number", icon: "solar:phone-outline" },
    { key: "channel", label: "Channel", icon: "material-symbols:sms-outline" },
    { key: "created_at", label: "Created at", icon: "gridicons:time" },
    { key: "tags", label: "Tags", icon: "flowbite:tag-outline" },
];

const filterOptions = [
    { key: "contains", label: "contains" },
    { key: "not_contains", label: "not contains" },
    { key: "starts_with", label: "starts with" },
    { key: "ends_with", label: "ends with" },
    { key: "is", label: "is" },
    { key: "is_not", label: "is not" },
    { key: "empty", label: "empty" },
    { key: "not_empty", label: "not empty" },
];

export default function TargetAudience() {
    const [selectedRadio, setSelectedRadio] = useState("groups");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [filter, setFilter] = useState(null);
    const [filterValue, setFilterValue] = useState(null);
    const [audience, setAudience] = useState(0);
    const { emailCampaingnData, setEmailCampaingnData, select, onSelect } =
        emailCampaingnStore();
    const { t } = useTranslation();
    const [popup, setPopup] = useState("hidden");
    const { validEmails, phoneGroupEmails, targetEmails } = emailCampaingnData;
    // this function is used for modal open

    useEffect(() => {
        const targetMails = Array.isArray(emailCampaingnData.targetEmails)
            ? emailCampaingnData.targetEmails
            : Array.from(emailCampaingnData.targetEmails);
        setAudience(
            (emailCampaingnData?.validEmails?.length || 0) +
                (emailCampaingnData?.phoneGroupEmails?.length || 0) +
                (targetMails?.length || 0)
        );
    }, [emailCampaingnData]);

    const onOpenAudienceModal = () => {
        if (!select) {
            onSelect(true);
        }

        addToast({
            title: "Alert",
            description:
                "Please select one at a time (Upload CSV, Emails, or Phonebooks)!",
            icon: "⚠️",
            color: "warning",
        });

        onOpen(); // open modal
    };

    return (
        <>
            <div
                className="px-6 py-4 rounded-lg cursor-pointer justify-between flex gap-3 items-center bg-content2 hover:bg-content3 transition-all duration-200 w-full "
                onClick={onOpenAudienceModal}
            >
                <div className="flex items-center gap-3  ">
                    <Image src="target-audience-icon.png" width={70} />

                    <span className="text-lg w-full text-default-500">
                        {t("Select your target audience")}
                    </span>
                </div>
                <div className="flex items-center justify-end -mb-12 text-xs text-default-400 ">
                    <Icon icon="fluent:people-48-filled" />
                    <span>
                        {t("Targeted Audience")}:{audience}
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
                                            <CsvUpload />
                                        </Tab>
                                        {/* Copy paste Numbers */}
                                        <Tab
                                            key="numbers"
                                            title={t("Emails")}
                                            className="pl-2"
                                        >
                                            <EmailBox />
                                        </Tab>
                                        {/* Phonebook */}
                                        <Tab
                                            key="phonebook"
                                            title={t("Phonebook")}
                                            className="pl-2 h-full"
                                        >
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
                                                {selectedRadio === "groups" && (
                                                    <div>
                                                        {/* Select group search */}
                                                        <SelectGroup type="email" />
                                                    </div>
                                                )}

                                                {/* Body rendered when contacts radio is selected */}
                                                {selectedRadio ===
                                                    "contacts" && (
                                                    <ContactFilter type="email" />
                                                )}
                                            </div>
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
                                            {t("Total audience")}: {audience}
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
                                            onPress={onClose}
                                            isDisabled={select}
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
