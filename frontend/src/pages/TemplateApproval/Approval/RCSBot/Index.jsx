import React, { useState } from "react";
import {
    RadioGroup,
    Radio,
    Select,
    SelectItem,
    Input,
    Button,
    Checkbox,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";
import InputField from "./InputField";
import TextField from "./TextField";
import FileUpload from "./FileUpload";
import RadioInfoContent from "./RadioInfoContent";
import FooterButtons from "./Buttons/Index";
import ColorPicker from "./ColorPresets";
import { Icon } from "@iconify-icon/react";
import { useRcsBotStore } from "../../../../store/templateApprovalStore";

import "react-phone-input-2/lib/style.css";
import { useTranslation } from "react-i18next";
import { set } from "lodash";
import { createBotService } from "../../../../services/Rcs/rcsBotService";
import toast from "react-hot-toast";
import { uploadFileToServer } from "../../../../services/s3FileServices/s3Services";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "../../../../components/phone-input";

const botype = [
    { key: "domestic", label: "Domestic" },
    { key: "international", label: "International" },
];

const domesticType = [{ key: "domestic", label: "Domestic" }];

const operators = [
    { key: "vi", label: "VI" },
    { key: "jio", label: "Jio" },
];

const botMsgType = [
    { key: "Transactional", label: "Transactional" },
    { key: "Promotional", label: "Promotional" },
    { key: "OTP", label: "OTP" },
    // { key: "Multi-Use", label: "Both" },
];

export default function RCSBotIndex() {
    const [selectedBot, setSelectedBot] = useState("domestic");
    const [selectedOperator, setSelectedOperator] = useState("vi");
    const navigate = useNavigate();
    const [selectedBotMsgType, setSelectedBotMsgType] = useState("OTP");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalType, setModalType] = useState(null); // State to track the modal type
    const [color, setColor] = useState("#ffffff"); // Default color
    const { t } = useTranslation();

    const {
        rcsCountryCodeInfo,
        setRcsCountryCodeInfo,
        rcsBrandName,
        rcsShortDescription,
        rcsPhoneInfo,
        rcsWebsiteInfo,
        rcsEmailInfo,
        rcsBrandColor,
        rcsBotName,
        rcsBrandIcon,
        rcsBrandBanner,
        rcsTermsUrl,
        rcsPrivacyUrl,
        rcsWebhookUrl,
        rcsChatBotLanguage,
        setRcsBrandName,
        setRcsBotName,
        setRcsShortDescription,
        setRcsPhoneInfo,
        setRcsWebsiteInfo,
        setRcsEmailInfo,
        setRcsTermsUrl,
        setRcsPrivacyUrl,
        setRcsWebhookUrl,
        setRcsChatBotLanguage,
        setRcsBrandColor,
    } = useRcsBotStore();
    const token = localStorage.getItem("token");
    const handleColorChange = (event) => {
        setRcsBrandColor(event.target.value);
    };

    const openModal = (type) => {
        setModalType(type);
        onOpen();
    };

    // Submit Handler
    const onSubmitHandller = async () => {
        // this function is used for brand logo to s3 server
        const brandIconResponse = await uploadFileToServer(rcsBrandIcon.file);
        if (brandIconResponse.status === "SUCCESS") {
            const preview = brandIconResponse.data.Location;
            rcsBrandIcon.preview = preview;
        } else {
            toast.error("Brand Icon upload failed.");
            return;
        }
        // this function is used for brand banner to s3 server
        const brandBannerResponse = await uploadFileToServer(
            rcsBrandBanner.file
        );
        if (brandBannerResponse.status === "SUCCESS") {
            const preview = brandBannerResponse.data.Location;
            rcsBrandBanner.preview = preview;
        } else {
            toast.error("Brand Banner upload failed.");
            return;
        }

        const botData = {
            selectedBot,
            selectedBotMsgType,
            rcsBotName,
            rcsBrandName,
            rcsShortDescription,
            rcsPhoneInfo,
            rcsWebsiteInfo,
            rcsEmailInfo,
            rcsBrandColor,
            rcsBrandIcon,
            rcsBrandBanner,
            rcsTermsUrl,
            rcsPrivacyUrl,
            rcsWebhookUrl,
            rcsChatBotLanguage,
        };
        const response = await createBotService(token, botData);
        if (response.status === "SUCCESS") {
            navigate(
                `/tempapproval?botId=${response.data[0].bot_id}&brandId=${response.data[0].brand_id}`
            );
            // toast.success("Bot created successfully.");
        } else {
            toast.error("Failed to create bot.");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center ">
                <div className="flex flex-col gap-6 ">
                    <div className="flex justify-between gap-12">
                        <div>
                            <label className="text-gray-500 mt-[1px]">
                                Select an operator
                            </label>
                            <div className="flex gap-4 mt-2">
                                {operators.map((operator) => (
                                    <div
                                        key={operator.key}
                                        className={`cursor-pointer p-2 rounded-lg border-2 flex flex-col items-center ${
                                            selectedOperator === operator.key
                                                ? "border-blue-500"
                                                : "border-transparent"
                                        }`}
                                        onClick={() =>
                                            setSelectedOperator(operator.key)
                                        }>
                                        {operator.key === "vi" ? (
                                            <Icon
                                                icon="simple-icons:vodafone"
                                                width={40}
                                                height={40}
                                                style={{ color: "#E60000" }}
                                            />
                                        ) : (
                                            <Icon
                                                icon="simple-icons:jio"
                                                width={40}
                                                height={40}
                                                style={{ color: "#0A2885" }}
                                            />
                                        )}
                                        <span className="mt-1 text-sm text-gray-700 font-medium">
                                            {operator.key === "vi"
                                                ? "Vi"
                                                : "Jio"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Select bot message type */}
                        <RadioGroup
                            label={t("Select bot message type")}
                            orientation="horizontal"
                            value={selectedBotMsgType}
                            onValueChange={setSelectedBotMsgType}>
                            {botMsgType.map((msgType) => (
                                <Radio key={msgType.key} value={msgType.key}>
                                    {t(msgType.label)}
                                </Radio>
                            ))}
                        </RadioGroup>

                        {/* RadioGroup for bot type */}
                        {/* <RadioGroup
                            label={t("Select your bot type")}
                            orientation="horizontal"
                            value={selectedBot}
                            onValueChange={setSelectedBot}>
                            {selectedOperator === "vi"
                                ? botype.map((bot) => (
                                      <Radio key={bot.key} value={bot.key}>
                                          {t(bot.label)}
                                      </Radio>
                                  ))
                                : domesticType.map((bot) => (
                                      <Radio key={bot.key} value={bot.key}>
                                          {t(bot.label)}
                                      </Radio>
                                  ))}
                        </RadioGroup> */}
                    </div>
                </div>

                {/* Color Picker */}
                <ColorPicker
                    rcsBrandColor={rcsBrandColor}
                    handleColorChange={handleColorChange}
                />
            </div>

            {/* Bot Name */}
            <InputField
                label={t("Bot Name")}
                description={t(
                    "This is the name of chatbot the user will see at the top of the message thread."
                )}
                charsAllowed={40}
                value={rcsBotName}
                onChange={(value) => setRcsBotName(value)}
            />

            {/* Brand Name */}
            <InputField
                label={t("Brand Name")}
                description={t(
                    "Enter the brand name with which your chatbot will be associated"
                )}
                charsAllowed={100}
                value={rcsBrandName}
                onChange={(value) => setRcsBrandName(value)}
            />

            {/* Short Description */}
            <TextField
                label={t("Short Description")}
                isRequired={true}
                charsAllowed={100}
                value={rcsShortDescription}
                onChange={(value) => setRcsShortDescription(value)}
            />

            {/* File Upload */}
            <FileUpload
                label={t("Upload File")}
                onChange={(files) => console.log(files)}
            />

            <div className="flex gap-2 w-full">
                {/* Button for Contact Info */}
                <Button
                    radius="sm"
                    variant="flat"
                    color="success"
                    size="md"
                    onPress={() => openModal("contact")}
                    className="w-1/2 "
                    startContent={<Icon icon="ic:sharp-plus" width={20} />}>
                    {t("Add Brand Info")}
                </Button>

                {/* Button for Website Info */}
                <Button
                    radius="sm"
                    variant="flat"
                    color="success"
                    size="md"
                    onPress={() => openModal("website")}
                    className="w-1/2 "
                    startContent={<Icon icon="ic:sharp-plus" width={20} />}>
                    {t("Add Brand Website Info")}
                </Button>
            </div>

            {/* Modal for both Contact Info and Website Info */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {modalType === "contact"
                                    ? t("Brand Contact Info")
                                    : t("Brand Website Info")}
                            </ModalHeader>
                            <ModalBody>
                                {modalType === "contact" ? (
                                    <>
                                        {/* Phone Number */}
                                        <div className="flex gap-2  w-full">
                                            <InputField
                                                label={t("Label for phone no")}
                                                charsAllowed={25}
                                                info="false"
                                                value={rcsPhoneInfo.label}
                                                onChange={(value) =>
                                                    setRcsPhoneInfo({
                                                        ...rcsPhoneInfo,
                                                        label: value,
                                                    })
                                                }
                                                className="!w-1/2"
                                            />

                                            <div className="w-1/2">
                                                <PhoneInput
                                                    value={rcsPhoneInfo.value}
                                                    countryDialCode={
                                                        rcsCountryCodeInfo
                                                    }
                                                    onChange={(value) =>
                                                        setRcsPhoneInfo({
                                                            ...rcsPhoneInfo,
                                                            value,
                                                        })
                                                    }
                                                    onCountryChange={(
                                                        country
                                                    ) =>
                                                        setRcsCountryCodeInfo(
                                                            country?.dial_code
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Website */}
                                        <div className="flex gap-2 z-0">
                                            <InputField
                                                label={t("Label for website")}
                                                charsAllowed={25}
                                                info="false"
                                                value={rcsWebsiteInfo.label}
                                                onChange={(value) =>
                                                    setRcsWebsiteInfo({
                                                        ...rcsWebsiteInfo,
                                                        label: value,
                                                    })
                                                }
                                            />
                                            <Input
                                                isRequired
                                                variant="flat"
                                                label={t("Website URL")}
                                                radius="sm"
                                                type="url"
                                                size="sm"
                                                value={rcsWebsiteInfo.value}
                                                onChange={(e) =>
                                                    setRcsWebsiteInfo({
                                                        ...rcsWebsiteInfo,
                                                        value: e.target.value,
                                                    })
                                                }
                                                className="z-0"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="flex gap-2 z-0">
                                            <InputField
                                                label={t("Label for email")}
                                                charsAllowed={25}
                                                info="false"
                                                value={rcsEmailInfo.label}
                                                onChange={(value) =>
                                                    setRcsEmailInfo({
                                                        ...rcsEmailInfo,
                                                        label: value,
                                                    })
                                                }
                                            />
                                            <Input
                                                isRequired
                                                variant="flat"
                                                label={t("Email")}
                                                radius="sm"
                                                type="email"
                                                size="sm"
                                                value={rcsEmailInfo.value}
                                                onChange={(e) =>
                                                    setRcsEmailInfo({
                                                        ...rcsEmailInfo,
                                                        value: e.target.value,
                                                    })
                                                }
                                                className="z-0"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Terms of use URL */}
                                        <Input
                                            isRequired
                                            label={t(
                                                "Website Terms of use URL"
                                            )}
                                            placeholder=" "
                                            onChange={(e) =>
                                                setRcsTermsUrl(e.target.value)
                                            }
                                            variant="flat"
                                            radius="sm"
                                            size="md"
                                        />

                                        {/* Privacy Policy URL */}
                                        <Input
                                            isRequired
                                            label={t(
                                                "Website Privacy Policy URL"
                                            )}
                                            placeholder=" "
                                            onChange={(e) =>
                                                setRcsPrivacyUrl(e.target.value)
                                            }
                                            variant="flat"
                                            radius="sm"
                                            size="md"
                                        />

                                        {/* Webhook URL */}
                                        <Input
                                            isRequired
                                            label={t("Chatbot webhook")}
                                            variant="flat"
                                            radius="sm"
                                            size="md"
                                            onChange={(e) =>
                                                setRcsWebhookUrl(e.target.value)
                                            }
                                            placeholder={t(
                                                "Enter the webhook URL to receive enagagement status from Google RCS"
                                            )}
                                            description={t(
                                                "The webhook needs to be active and be able to respond with a 200 OK to POST requests"
                                            )}
                                        />

                                        {/* Language */}
                                        <Input
                                            onChange={(e) =>
                                                setRcsChatBotLanguage(
                                                    e.target.value
                                                )
                                            }
                                            isRequired
                                            label={t("Chatbot Languages")}
                                            variant="flat"
                                            radius="sm"
                                            size="md"
                                            placeholder={t(
                                                "Languages to be supported by bot (english, hindi etc...)"
                                            )}
                                        />
                                    </>
                                )}
                            </ModalBody>

                            {/* Modal Footer */}
                            <ModalFooter>
                                <Button
                                    className="text-danger hover:bg-danger-100"
                                    variant="none"
                                    onPress={onClose}
                                    radius="sm">
                                    {t("Cancel")}
                                </Button>
                                <Button
                                    color="success"
                                    variant="flat"
                                    onPress={onClose}
                                    radius="sm">
                                    {t("Save")}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Checkbox */}
            <Checkbox size="sm" color="success">
                {t("I agree to launch the bot on all Indian carriers")}
            </Checkbox>

            {/* Footer Buttons */}
            <FooterButtons onSubmitHandller={onSubmitHandller} />
        </div>
    );
}
