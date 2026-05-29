import React, {
    useState,
    createContext,
    lazy,
    Suspense,
    useEffect,
} from "react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import Crumb from "../../../components/Breadcrumb/Crumb";
import {
    useTemplateStore,
    useWhatsappTemplateStore,
} from "../../../store/templateApprovalStore";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RcsBotVerify from "./RcsbotVerify";
import AddTabSwitcher from "../../SubAccounts/Add/TabsSwitcher";
import RcsBotVerifyTabSwitcher from "./RCSBotVerifyTabSwitcher";
// Lazy loading for templates and mockups
const SMSTemplate = lazy(() => import("./SMS"));
const RCSBody = lazy(() => import("./RCSBody/Index"));
const RCSBotIndex = lazy(() => import("./RCSBot/Index"));
const RCSMockupIndex = lazy(() => import("../../RCS/SendRCS/Mockups/Index"));
const RCSBOTMockupIndex = lazy(() => import("./RCSBot/Mockups/Index"));
const SMSMockupIndex = lazy(() => import("../../SMS/SendSMS/Mockups/Index"));
const WhatsAppIndex = lazy(() => import("./WhatsApp/Index"));
const WhatsAppMockup = lazy(() => import("../../../components/WAMockup/Index"));

const templates = [
    { key: "sms", label: "SMS" },
    { key: "rcs", label: "RCS" },
    { key: "rcsbot", label: "RCS Bot" },
    { key: "whatsapp", label: "WhatsApp" },
];

export const RtdContext = createContext(null);

export default function Index() {
    const location = useLocation(); // Get the current location object
    const botId = new URLSearchParams(location.search).get("botId");
    const brandId = new URLSearchParams(location.search).get("brandId");
    const { t } = useTranslation();
    const {
        // template
        selectedTemplate,
        setSelectedTemplate,

        // template type
        selectedTemplateType,
        setSelectedTemplateType,

        // text content
        textMessageContent,
        setTextMessageContent,

        // single image content
        singleImageContent,
        setSingleImageContent,

        // carousel image content
        carouselItems,
        setCarouselItems,

        // bot
        selectedBot,
        setSelectedBot,

        // sms header
        smsHeader,

        // video
        videoContent,
        setVideoContent,

        // fall back text
        setFallbackText,
        setFallbackTextVariables,
    } = useTemplateStore();
    const {
        selectedWabaid,
        selectedCategory,
        // selectedTemplateType,
        updateField,
    } = useWhatsappTemplateStore();

    // console.log("suggestions", textMessageContent.buttons);
    useEffect(() => {
        // Parse query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const selectedParam = queryParams.get("selected");

        if (selectedParam === "rcsbots") {
            setSelectedTemplate("rcsbot");
        } else if (selectedParam === "smsheader") {
            setSelectedTemplate("sms");
        }
    }, [location.search]);

    const [displayText, setDisplayText] = useState(
        "This is the live preview of your message"
    );

    // sms message Data
    const smsMessageData = [
        {
            type: "text_message",
            content:
                textMessageContent.textMessage || "Preview your sms message...",
        },
    ];

    // rcs message data
    const rcsMessageData = [
        {
            type: selectedTemplateType,
            content:
                selectedTemplateType === "text_message"
                    ? `${
                          textMessageContent?.textMessage ||
                          "Preview your rcs message..."
                      }`
                    : selectedTemplateType === "video"
                    ? videoContent
                    : singleImageContent,
            messageActions: textMessageContent?.buttons,

            carouselItems,
        },
    ];

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case "sms":
                return (
                    <Suspense fallback={<div>Loading SMS Template...</div>}>
                        <SMSTemplate />
                    </Suspense>
                );
            case "rcs":
                return (
                    <Suspense fallback={<div>Loading RCS Template...</div>}>
                        <RCSBody />
                    </Suspense>
                );
            case "rcsbot":
                return (
                    <Suspense fallback={<div>Loading RCS Bot Template...</div>}>
                        <RCSBotIndex />
                    </Suspense>
                );
            case "whatsapp":
                return (
                    <Suspense
                        fallback={<div>Loading WhatsApp Template...</div>}
                    >
                        <WhatsAppIndex />
                    </Suspense>
                );
            default:
                return null;
        }
    };

    const onSelectedTemplateChange = (e) => {
        const value = e.target.value;
        setSelectedTemplate(value);
        setFallbackText("");
        setFallbackTextVariables([]);
        // Reset Whatsapp template related values
        if (value === "whatsapp") {
            ["selectedTemplateType", selectedWabaid, selectedCategory].map(
                (whatsAppField) => updateField(whatsAppField, "")
            );
        }
        // reset rcs template type related value
        if (value === "rcs") {
            setSelectedTemplateType("text");
            setSelectedBot({
                key: "telepie",
                label: "Telepie Technologies",
            });
            setTextMessageContent({
                textMessage: "",
                variables: [],
                buttons: [
                    {
                        id: 1,
                        suggestionType: "reply",
                        displayText: "Stop",
                        postback: "Stop",
                    },
                ],
            });

            setSingleImageContent({
                title: "",
                description: "",
                titleVariables: [],
                descriptionVariables: [],
                imageUrl: "",
                buttons: [
                    {
                        id: 1,
                        suggestionType: "reply",
                        displayText: "Stop",
                        postback: "Stop",
                    },
                ],
            });

            setVideoContent({
                title: "",
                description: "",
                videoFile: "",
                thumbnailUrl: "",
                titleVariables: [],
                descriptionVariables: [],
                buttons: [
                    {
                        id: 1,
                        suggestionType: "reply",
                        displayText: "Stop",
                        postback: "Stop",
                    },
                ],
            });

            setCarouselItems([
                {
                    id: 1,
                    title: "",
                    titleVariables: [],
                    descriptionVariables: [],
                    description: "",
                    imageUrl: "",
                    buttons: [
                        {
                            id: 1,
                            suggestionType: "reply",
                            displayText: "Stop",
                            postback: "Stop",
                        },
                    ],
                },
            ]);
        }
    };

    return (
        <RtdContext.Provider value={{ displayText, setDisplayText }}>
            <div className="h-full">
                {botId && brandId ? (
                    <>
                        {/* <RcsBotVerify /> */}
                        <RcsBotVerifyTabSwitcher />
                    </>
                ) : (
                    <div className="grid gap-3 grid-cols-3 ">
                        {/* Left Col */}
                        <Card className="col-span-3 md:col-span-2 w-full dark:border border-default">
                            <CardHeader className="bg-gradient-to-r from-success-100  to-success-50/60 p-5 ">
                                {/* BreadCrumb */}
                                <Crumb secondSib={t("Template Approval")} />
                            </CardHeader>

                            <CardBody className="p-5">
                                <div className="flex flex-col gap-8 py-4">
                                    <>
                                        <div className="flex flex-col md:flex-row ">
                                            {/* Template Selector */}
                                            <Select
                                                isRequired
                                                label={t("Select a template")}
                                                placeholder={t(
                                                    "Select a template"
                                                )}
                                                defaultSelectedKeys={[
                                                    selectedTemplate,
                                                ]}
                                                selectedKeys={[
                                                    selectedTemplate,
                                                ]}
                                                value={selectedTemplate}
                                                onChange={
                                                    onSelectedTemplateChange
                                                }
                                                className="w-full"
                                                radius="sm"
                                            >
                                                {templates.map((template) => (
                                                    <SelectItem
                                                        key={template.key}
                                                        value={template.key}
                                                    >
                                                        {t(template.label)}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>

                                        {/* Render Selected Template */}
                                        <div className="h-full">
                                            {renderTemplate()}
                                        </div>
                                    </>
                                </div>
                            </CardBody>

                            <CardFooter />
                        </Card>
                        {/* Right Col */}

                        <Card className="dark:border border-default">
                            <CardHeader className="p-3 bg-content2 flex-column">
                                <p className="font-semibold text-md text-success-700">
                                    Template Preview
                                </p>
                                <p className="text-xs text-default-500">
                                    Real time preview of template
                                </p>
                            </CardHeader>
                            <CardBody>
                                <Suspense
                                    fallback={<div>Loading Mockup...</div>}
                                >
                                    {selectedTemplate === "rcs" ? (
                                        <RCSMockupIndex
                                            contactName={selectedBot?.label}
                                            messageData={rcsMessageData}
                                        />
                                    ) : selectedTemplate === "rcsbot" ? (
                                        <RCSBOTMockupIndex />
                                    ) : selectedTemplate === "whatsapp" ? (
                                        <div className="px-4 w-full gap-4 flex flex-col  items-center">
                                            <WhatsAppMockup />
                                        </div>
                                    ) : (
                                        <SMSMockupIndex
                                            contactName={`VM-${smsHeader}`}
                                            messageData={smsMessageData}
                                        />
                                    )}
                                </Suspense>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </RtdContext.Provider>
    );
}
