import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify-icon/react";
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
    Input,
    Image,
    Select,
    SelectItem,
    SelectSection,
    Checkbox,
    addToast,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@heroui/react";
import NumberBox from "./NumBox";
import { SelectSearch } from "./SelectSearch";
import CsvUpload from "./FileUpload";
import Textbox from "./Textbox";
import FooterButtons from "./Buttons/Index";
import SchedulerIndex from "./Scheduler/Index";
import ContactFilter from "../../../../../../RCS/SendRCS/Send/ContactFilter";
import { useSendWhatsappStore } from "../../../../../../../store/whatsapp/whatsappStore";
import { generateWhatsappCampaignName } from "../../../../../../../functions/whatsapp/generateWhatsappCampaignName";
import {
    getTemplatesService,
    getTemplateTypesService,
    getWabaIdsService,
    getWhatsappTemplateWithDetails,
} from "../../../../../../../services/Whatsapp/template/templateServices";
import { t } from "i18next";
import { sendWhatsappMessageService } from "../../../../../../../services/Whatsapp/campaign/sendWhatsAppService";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ExpirationTime from "../../../../../../../components/DatePicker/ExpirationTime";
import {
    createCampaignInBackend,
    getContentType,
    processAndSendCampaign,
} from "./Utils/utils.js";
import { backend_base_url } from "../../../../../../../services/common";
import SelectAudienceAlert from "./Buttons/SelectAudienceAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SelectGroup from "./SelectGroup";
import Crumb from "../../../../../../../components/Breadcrumb/Crumb";
import PromptInputIndex from "./MessagePreviews/PromptIndex.jsx";

const wabaids = [{ key: "+918368615329", label: "+91-8368615329" }];

const templates = [
    { key: "document", label: "Document" },
    { key: "image", label: "Image" },
    { key: "video", label: "Video" },
    { key: "text", label: "Text" },
    { key: "location", label: "Location" },
    { key: "carousel", label: "Carousel" },
    // { key: "WithExpiration", label: "With Expiration Time" },
    // { key: "WithoutExpiration", label: "Without Expiration Time" },
];

const Ltos = [
    { key: "WithExpiration", label: "W/ Expiration Time" },
    { key: "WithoutExpiration", label: "W/O Expiration Time" },
];

export default function CampaignForm() {
    const [message, setMessage] = useState("");
    const [campaignerror, setCampaignError] = useState("");
    const [selectedRadio, setSelectedRadio] = useState("groups");
    const headingClasses =
        "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const token = localStorage.getItem("token");
    const timeoutRef = useRef(null); // Gyan: Setting the time interval
    const queryClinet = useQueryClient();
    const navigate = useNavigate();
    const {
        phoneNumbers,
        campaignId,
        wabaID,
        campaignName,
        selectedTemplateTypeSend,
        selectedTemplate,
        batchSize,
        interval,
        selectedDate,
        setCampaignId,
        setCampaignName,
        setPhoneNumbers,
        setSelectedTemplateTypeSend,
        setTemplateContentData,
        setWabaID,
        selectedTemplateName,
        setSelectedTemplateName,
        setSingleTemplateData,
        singleTemplateData,
        testPhoneNumbers,
        MediaId,
        mediaUrl,
        selectedExpirationDate,
        csvFileContent,
        contactUploadedFrom,
        sendWhatsappAnimationModelOpen,
        resetSendWhatsappStore,
        setWhatsappAnimationModel,
        variableMappings,
        setNumdisable,
        numDisable,
    } = useSendWhatsappStore();

    // formated date
    useEffect(() => {
        const { campaignName, campaignId } = generateWhatsappCampaignName();
        if (campaignName) {
            setCampaignName(campaignName);
        }
        if (campaignId) {
            setCampaignId(campaignId);
        }
    }, []);

    // // this is used for set message
    useEffect(() => {
        if ([...selectedTemplate].length > 0) {
            const selectedTemplateId = [...selectedTemplate][0];
            const selectedTemplates = templates.filter(
                (template) => template.template_id === selectedTemplateId
            );
            setTemplateContentData({});
            // get template with content
            const getTemplateWithContent = async () => {
                const templateWithContent =
                    await getWhatsappTemplateWithDetails({
                        token,
                        template_id: selectedTemplateId,
                    });
                if (templateWithContent.status === "SUCCESS") {
                    setTemplateContentData(templateWithContent?.data);
                } else {
                    addToast({
                        title: "Template Error",
                        description:
                            templateWithContent?.message ||
                            "Something went wrong",
                        color: "Warning".toLowerCase(),
                    });
                }
            };
            getTemplateWithContent();
        }
    }, [selectedTemplate]);

    // this is used for resetting phone numbers when radio selection changes
    useEffect(() => {
        setPhoneNumbers([]);
        setMessage;
    }, [selectedRadio]);

    useEffect(() => {
        setMessage("");
    }, [selectedTemplateTypeSend]);
    // this function is used for modal open
    const onOpenAudienceModal = () => {
        const contentType = getContentType(selectedTemplateTypeSend);
        setNumdisable(
            singleTemplateData[0]?.[contentType]?.variables?.length > 0
        );
        onOpen(); // open modal
    };

    //  Gyan: This fuction used for the send campaign as well as store the data in backend
    const { mutateAsync: launchCampaign } = useMutation({
        mutationFn: async () => {
            try {
                const campaignPayload = {
                    phoneNumbers,
                    campaignId,
                    wabaID,
                    campaignName,
                    selectedTemplateTypeSend,
                    selectedTemplateName,
                    batchSize: batchSize || 0,
                    interval: interval ? Array.from(interval)[0] : 0,
                    selectedDate,
                    testPhoneNumbers,
                    mediaUrl,
                    MediaId,
                    singleTemplateData,
                    status: selectedDate ? "scheduled" : "pending",
                };
    
                if (!selectedDate) {
                    const campaignData = {
                        MediaId,
                        mediaUrl,
                        csvFileContent,
                        selectedExpirationDate,
                    };
                    const useCsvData = !!csvFileContent?.allData?.length;

                    const proccessResponse = await processAndSendCampaign(
                        phoneNumbers,
                        campaignData,
                        singleTemplateData[0],
                        campaignPayload.batchSize,
                        campaignPayload.interval,
                        useCsvData ? variableMappings : null,
                        useCsvData
                    );

                    if (!proccessResponse?.success) {
                        throw {
                            type: "meta",
                            message:
                                proccessResponse.error?.message ||
                                "Failed to send campaign",
                            details: proccessResponse.error?.details,
                        };
                    }
                }

               
    
                const response = await createCampaignInBackend(campaignPayload);
 
                if (!response.success) {
                    throw {
                        type: 'backend',
                        message: response.message || 'Duplicate campaign not allowed'
                    };
                }

               
    
                const response = await createCampaignInBackend(campaignPayload);
 
                if (!response.success) {
                    throw {
                        type: 'backend',
                        message: response.message || 'Duplicate campaign not allowed'
                    };
                }
                setWhatsappAnimationModel(true);
                return response;
            } catch (error) {
                if (!error.type) error.type = "unknown";
                throw error;
            }
        },
        onSuccess: () => {
            queryClinet.invalidateQueries(["whatsapp-campaign"]);

            addToast({
                title: "Campaign Launched!",
                description: "Your WhatsApp campaign has started successfully.",
                color: "success",
            });

            setTimeout(() => {
                setWhatsappAnimationModel(false);
                resetSendWhatsappStore();
                navigate("/wareports");
            }, 7500);
        },
        onError: (error) => {
            let errorTitle = "Error";
            let userMessage = error.message || "Failed to send campaign";

            if (error.type === "backend") {
                errorTitle = "Backend Error";
            } else if (error.type === "meta") {
                errorTitle = "WhatsApp API Error";
                if (error.details?.error?.code === 131053) {
                    userMessage =
                        "Media upload error: Unsupported file type. Please use PNG or JPEG images.";
                }
            } else if (error.response?.status === 429) {
                errorTitle = "Rate Limit Exceeded";
                userMessage = "Too many requests. Please try again later.";
            } else if (error.response?.status >= 500) {
                errorTitle = "Server Error";
                userMessage =
                    "Our servers are experiencing issues. Please try again later.";
            }

            addToast({
                title: errorTitle,
                description: userMessage,
                color: "danger",
                timeout: 10000,
                action:
                    error.type !== "meta"
                        ? {
                              label: "Retry",
                              handler: () => launchCampaign(),
                          }
                        : null,
            });
        },
    });
    const [alltemplate, setAllTemplate] = useState([]);
    const [templateName, setTemplateName] = useState([]);
    useEffect(() => {
        const allTemplates = async () => {
            try {
                const response = await axios.get(
                    `${backend_base_url}/whatsapp/template/approval`
                );
                const res = response.data;
                setAllTemplate(res.templates);
            } catch (error) {
                t;
                console.error(error);
            }
        };
        allTemplates();
    }, [wabaID, campaignName]);

    function filterTemplates(data, format, name) {
        return data.filter((template) => {
            // Check if the template has a HEADER component with the specified format
            const hasFormat = template.selectedTemplateType === format;
            // console.log(hasFormat);
            // If a name is provided, also check if the template name matches
            if (name) {
                return hasFormat && template.templateName === name;
            }

            return hasFormat;
        });
    }
    const handleChangeTemplate = (e) => {
        setSelectedTemplateTypeSend(e.target.value);
        const TemplatesTypeData = filterTemplates(alltemplate, e.target.value);
        setTemplateName(TemplatesTypeData);
    };
    // Gyan: Handle the data according to name change of specific template types
    const handleChangeName = (e) => {
        setSelectedTemplateName(e.target.value);
        const finalData = filterTemplates(
            alltemplate,
            selectedTemplateTypeSend,
            e.target.value
        );
        setSingleTemplateData(finalData);
        let contentType = getContentType(selectedTemplateTypeSend);
        const bodyComponent = finalData[0]?.[contentType];
        if (bodyComponent) {
            setMessage(bodyComponent.textMessage);
        } else {
            return {
                message: "BODY component not found",
            };
        }
    };
    // Handle the wabaId chanage
    const handleChangeWaba = (e) => {
        setWabaID(e.target.value);
    };
    const handleCampaignName = (e) => {
        const value = e.target.value;
        setCampaignName(value);

        // Validate length and set error
        if (value.length === 60) {
            setCampaignError("Maximum 60 characters allowed!");
        } else {
            setCampaignError("");
        }
    };
    return (
        <div className="h-fit w-full">
            <Card
                shadow="sm"
                fullWidth="true"
                radius="lg"
                className="dark:border border-default h-full"
            >
                <CardHeader className="bg-gradient-to-r from-success-100  to-success-50/60 p-5 ">
                    {/* BreadCrumb */}
                    <Crumb secondSib={t("Send WhatsApp")} />
                </CardHeader>

                <CardBody className="p-6">
                    <div className="w-full flex flex-col gap-8">
                        <div className="flex justify-between gap-4">
                            {/* Camapaign Name */}
                            <Input
                                isClearable
                                isRequired
                                type="text"
                                radius="sm"
                                size="md"
                                maxLength={60}
                                value={campaignName}
                                onChange={handleCampaignName}
                                label="Campaign Name"
                                variant="flat"
                                className="flex-1"
                                errorMessage={campaignerror} // Show error if length > 60
                                isInvalid={!!campaignerror} // Highlight input in red when error exists
                                onClear={() => {
                                    setCampaignName("");
                                    setCampaignError("");
                                }}
                            />

                            {/* Campaign ID */}
                            <Input
                                isReadOnly
                                disableAnimation
                                value={campaignId}
                                color="success"
                                radius="sm"
                                label="Campaign ID"
                                className="max-w-[150px] w-full !cursor-default"
                            />

                            {/* Altenate Field */}
                            {/* <div className="px-4 py-2 bg-success-100 flex flex-col  gap-1 items-start min-w-[150px] rounded-lg">
                          <p className="text-success-600 text-xs">
                              Campaign ID
                          </p>
                          <p className="text-success-600 text-sm">
                              {campaignId}
                          </p>
                      </div> */}
                        </div>

                        {/* Drop Down Input */}
                        <div className="flex justify-between gap-6 w-full">
                            {/* WABA ID */}
                            <Select
                                isRequired
                                label="WABA Number"
                                size="md"
                                radius="sm"
                                name="wabanumber"
                                onChange={handleChangeWaba}
                                value={wabaID ?? ""}
                            >
                                {wabaids.map((waba) => (
                                    <SelectItem key={waba.key}>
                                        {waba.label}
                                    </SelectItem>
                                ))}
                            </Select>
                            {/* Template Type */}
                            <Select
                                isRequired
                                label="Template Type"
                                size="md"
                                radius="sm"
                                name="templatetype"
                                isDisabled={!wabaID}
                                onChange={handleChangeTemplate}
                                value={selectedTemplateTypeSend ?? ""}
                            >
                                <SelectSection
                                    classNames={{
                                        heading: headingClasses,
                                    }}
                                    title="Marketing"
                                >
                                    {templates.map((temp) => (
                                        <SelectItem key={temp.key}>
                                            {temp.label}
                                        </SelectItem>
                                    ))}
                                </SelectSection>
                                <SelectSection
                                    classNames={{
                                        heading: headingClasses,
                                    }}
                                    title="LTO"
                                >
                                    {Ltos?.map((lto) => (
                                        <SelectItem key={lto.key}>
                                            {lto.label}
                                        </SelectItem>
                                    ))}
                                </SelectSection>
                            </Select>

                            {/* Template Name */}

                            <Select
                                isRequired
                                label="Template Name"
                                size="md"
                                radius="sm"
                                name="templatetype"
                                isDisabled={selectedTemplateTypeSend === ""}
                                onChange={handleChangeName}
                                value={selectedTemplateName ?? ""}
                            >
                                {templateName.map((temp) => (
                                    <SelectItem key={temp.templateName}>
                                        {temp.templateName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Select your target audience */}
                        <TargetAudienceComponent
                            phoneNumbers={phoneNumbers}
                            onOpenAudienceModal={onOpenAudienceModal}
                        />

                        {/* Modal */}
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
                                                                <SelectAudienceAlert />
                                                            )}

                                                        {(!contactUploadedFrom ||
                                                            contactUploadedFrom ===
                                                                "csv") && (
                                                            <CsvUpload />
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
                                                                <SelectAudienceAlert />
                                                            )}

                                                        {(!contactUploadedFrom ||
                                                            contactUploadedFrom ===
                                                                "number") && (
                                                            <NumberBox />
                                                        )}
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
                                                                <SelectAudienceAlert />
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
                                                                    value={
                                                                        selectedRadio
                                                                    }
                                                                    onValueChange={
                                                                        setSelectedRadio
                                                                    }
                                                                >
                                                                    <Radio value="groups">
                                                                        {t(
                                                                            "Groups"
                                                                        )}
                                                                    </Radio>
                                                                    <Radio value="contacts">
                                                                        {t(
                                                                            "Contacts"
                                                                        )}
                                                                    </Radio>
                                                                </RadioGroup>

                                                                {/* Body rendered when groups radio is selected */}
                                                                {selectedRadio ===
                                                                    "groups" && (
                                                                    <div>
                                                                        {/* Select group search */}
                                                                        <SelectGroup type="whatsapp" />
                                                                    </div>
                                                                )}

                                                                {/* Body rendered when contacts radio is selected */}
                                                                {selectedRadio ===
                                                                    "contacts" && (
                                                                    <ContactFilter type="whatsapp" />
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
                                                        Total audience:{" "}
                                                        {phoneNumbers &&
                                                            phoneNumbers.length}
                                                    </span>
                                                </div>
                                                {/* Btns */}
                                                <div className="self-end flex gap-2">
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
                                                        onPress={() => {
                                                            if (
                                                                phoneNumbers.length ===
                                                                0
                                                            ) {
                                                                // Show toast if no phone numbers selected
                                                                addToast({
                                                                    title: "Alert!",
                                                                    description:
                                                                        "Please select at least one phone number to send the campaign.",
                                                                    color: "warning",
                                                                });
                                                            } else {
                                                                onClose();
                                                            }
                                                        }}
                                                    >
                                                        Select
                                                    </Button>
                                                </div>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        )}

                        {/* Textbox */}
                        <Textbox message={message} data={singleTemplateData} />
                        {selectedTemplateTypeSend === "WithExpiration" ? (
                            <ExpirationTime />
                        ) : null}

                        {/* Divider */}
                        <Divider />

                        {/* Scheduler */}
                        <SchedulerIndex />
                    </div>
                </CardBody>

                <CardFooter className="w-full p-5 border-t border-default">
                    <FooterButtons onSubmitHandller={launchCampaign} />
                </CardFooter>
            </Card>
        </div>
    );
}

const TargetAudienceComponent = ({ onOpenAudienceModal, phoneNumbers }) => {
    return (
        <div
            className="px-6 py-4 rounded-lg cursor-pointer justify-between flex gap-3 items-center bg-content2 hover:bg-content3 transition-all duration-200 w-full "
            onClick={onOpenAudienceModal}
        >
            <div className="flex items-center gap-3 ">
                <Image src="target-audience-icon.png" width={70} />

                <span className="text-lg w-full text-default-500">
                    Select your target audience
                </span>
            </div>

            <div className="flex items-center justify-end -mb-12 text-xs text-default-400 ">
                <Icon icon="fluent:people-48-filled" />
                <span>
                    Targeted Audience: {phoneNumbers && phoneNumbers.length}
                </span>
            </div>
        </div>
    );
};
