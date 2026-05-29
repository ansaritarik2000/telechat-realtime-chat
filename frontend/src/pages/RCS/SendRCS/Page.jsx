import React, { lazy, Suspense, useEffect, useRef } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
} from "@heroui/react";
import MessageBox from "./MessageBox";
import DropDownInput from "./Options";
import Crumb from "../../../components/Breadcrumb/Crumb";
import FooterButtons from "./Buttons/Index";
import generateRCSCampaignID from "../../../functions/rcs/generateCampaignName";
import { sendRCSservice } from "../../../services/Rcs/sendRcsService";
import { getTemplateWithDetails } from "../../../services/Rcs/rcsTemplateService";
import { useSendRcStore } from "../../../store/sendRcsStore";
import Slider from "../../TemplateApproval/Approval/RCSBody/Slider";
import { useNavigate } from "react-router-dom";
import {
    replaceHeaderAndSubHeader,
    replaceMessageVars,
} from "./utils/variableReplace";
import SelectAudienceComp from "./Send/rcs-select-audience";
import { useTranslation } from "react-i18next";
import FallbackTextBox from "./FallbackTextBox";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "../../../utils/ReusableIcons";
import ToggleSwitch from "./Mockups/Toggle";

const MockupIndex = lazy(() => import("./Mockups/Index"));
const Campaigns = lazy(() => import("./Campaigns/Index"));

export default function SendRCSPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // zustand store
    const {
        template,
        setTemplate,
        selectedTemplateType,
        selectedBot,
        selectedTemplate,
        batchSize,
        interval,
        selectedDate,
        campaignName, // Validation need here
        setCampaignName,
        userId,
        setUserId,
        setRcsAnimationModel,
        phoneNumbers,
        csvFileContent,
        message,
        setMessage,
        resetSendRcsStore,
    } = useSendRcStore();

    // formated date
    const formattedDate = selectedDate
        ? new Date(selectedDate).toISOString()
        : null;

    const timeoutRef = useRef(null); // Md Faizan: Store timeout reference

    const user_id = localStorage.getItem("user_id");
    // this is variable for show preview rcs on
    const messageData = [
        {
            type: template?.type,
            content:
                template?.type === "text_message"
                    ? `${message || "Preview your rcs message..."}`
                    : template?.type === "video" ||
                      template?.type === "singleimg"
                    ? template?.template_contents &&
                      template?.template_contents[0]
                    : {},
            messageActions:
                template?.template_contents &&
                template?.template_contents[0]?.action_buttons,

            carouselItems:
                template?.type === "imgcarousel"
                    ? template?.template_contents
                    : [],
        },
    ];

    // this useEffect is used for set campaign name and userId
    useEffect(() => {
        const { campaingName, campaignId } = generateRCSCampaignID();
        setCampaignName(campaingName);
        setUserId(campaignId);
    }, []);

    // this is fetch template names when template name id changes (for set message according to template name)
    // Md Faizan: I added react-query to perfectaly get fetch status like, error, isError, isLoading
    const { error, isError, isLoading } = useQuery({
        queryKey: ["template", selectedTemplate?.id],
        queryFn: async () => {
            const templateId = selectedTemplate?.id;
            // if (!!templateId) {
            setMessage("");
            const data = await getTemplateWithDetails(templateId);
            if (data) {
                setTemplate(data);
                if (data.type === "text_message") {
                    setMessage(
                        data.template_contents &&
                            data.template_contents.length &&
                            data.template_contents[0].message
                    );
                }
                if (data.type === "video" || data.type === "singleimg") {
                    setMessage(
                        `${
                            data.template_contents &&
                            data.template_contents.length &&
                            data.template_contents[0].card_heading
                        }\n${
                            data.template_contents &&
                            data.template_contents.length &&
                            data.template_contents[0].card_subheading
                        } `
                    );
                }
            }
            // }

            return data;
        },
        enabled: !!selectedTemplate?.id,
    });

    // Md Faizan: Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Function to launch the RCS campaign
    const { mutateAsync: handleCampaignLaunch } = useMutation({
        mutationFn: async () => {
            let customVars = null;

            // Md Faizan: Clear previous timeout (if any)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // for message variables
            const isHaveMessageVars =
                template?.template_contents &&
                template?.template_contents.length > 0 &&
                template?.template_contents[0].message_vars &&
                template?.template_contents[0].message_vars.length > 0;

            // for heading variables
            const isHaveHeadingVars =
                template?.template_contents &&
                template?.template_contents.length > 0 &&
                template?.template_contents[0].card_heading_vars &&
                template?.template_contents[0].card_heading_vars.length > 0;

            // for subheading variables
            const isHaveSubHeadingVars =
                template?.template_contents &&
                template?.template_contents.length > 0 &&
                template?.template_contents[0].card_subheading_vars &&
                template?.template_contents[0].card_subheading_vars.length > 0;

            // for carousel variables (headings or subheadings)
            const isHaveCarouselVars =
                template?.template_contents &&
                template?.template_contents.length > 0 &&
                template?.template_contents.some(
                    (content) =>
                        (content.card_heading_vars &&
                            content.card_heading_vars.length > 0) ||
                        (content.card_subheading_vars &&
                            content.card_subheading_vars.length > 0)
                );

            if (template.type === "text_message" && isHaveMessageVars) {
                const updatedRowsWithMessages = replaceMessageVars(
                    template,
                    csvFileContent.validRows
                );
                customVars = updatedRowsWithMessages;
            } else if (
                (template.type === "singleimg" || template.type === "video") &&
                (isHaveHeadingVars || isHaveSubHeadingVars)
            ) {
                const updatedCardHeadingSubHeading = replaceHeaderAndSubHeader(
                    template,
                    csvFileContent.validRows,
                    0
                );
                customVars = updatedCardHeadingSubHeading;
            } else if (template.type === "imgcarousel" && isHaveCarouselVars) {
                const existingVars = [];

                // Iterate through all template contents
                template?.template_contents?.forEach((content, index) => {
                    const updatedVars = replaceHeaderAndSubHeader(
                        template,
                        csvFileContent.validRows,
                        index
                    );

                    updatedVars.forEach((newVar) => {
                        // Check if the phone number already exists in existingVars
                        const existingEntry = existingVars.find(
                            (item) => item.phone_number === newVar.phone_number
                        );

                        if (existingEntry) {
                            // Merge customParams
                            existingEntry.customParams = {
                                ...existingEntry.customParams,
                                ...newVar.customParams,
                            };
                        } else {
                            // Add new entry to existingVars
                            existingVars.push(newVar);
                        }
                    });
                });

                customVars = existingVars; // Set customVars to the final appended existingVars
            }

            const arrayInterval = [...interval];
            // Prepare the RCS data to send
            const rcsData = {
                campaign_name: campaignName,
                phone_numbers: phoneNumbers,
                template_id: template?.id,
                template_type_id: selectedTemplateType?.id,
                bot_id: selectedBot?.id,
                campaign_date: formattedDate,
                batch_size: parseInt(batchSize),
                user_id,
                unique_id: userId, // this is campaign id
                customVars,
                interval:
                    interval && arrayInterval.length > 0
                        ? parseInt(arrayInterval[0])
                        : null,
                message,
            };

            // Call the service function to send RCS data
            const response = await sendRCSservice(rcsData);

            return response;
        },
        onSuccess: () => {
            setRcsAnimationModel(true);

            // after five second model will close and navigate /rcsreports
            timeoutRef.current = setTimeout(() => {
                setRcsAnimationModel(false);
                resetSendRcsStore();
                navigate("/rcsreports");
            }, 7500);
        },
        onError: (e) => {
            addToast({
                title: e.name,
                description: e.message,
                color: "danger",
            });
        },
    });

    if (isError) {
        addToast({
            title: error.name,
            description: error.message,
            color: "danger",
        });
    }

    return (
        <div className="grid gap-3 grid-cols-3 ">
            {/* Left Col */}
            <div className="col-span-3 md:col-span-2 w-full">
                <Card
                    shadow="sm"
                    fullWidth="true"
                    radius="lg"
                    className="dark:border border-default">
                    <CardHeader className="bg-gradient-to-r from-primary-100  to-primary-50/60 p-5 ">
                        {/* BreadCrumb */}
                        <Crumb secondSib={t("Send RCS")} />
                    </CardHeader>

                    <CardBody className="p-6">
                        {/* Body */}
                        <div className="flex flex-col gap-8  mt-4">
                            <div className="flex justify-between gap-4">
                                <Input
                                    isRequired
                                    isClearable
                                    size="md"
                                    type="text"
                                    variant="flat"
                                    label={t("Campaign Name")}
                                    className="flex-1"
                                    value={campaignName}
                                    onChange={(e) =>
                                        setCampaignName(e.target.value)
                                    } // Add onChange handler
                                    onClear={() => setCampaignName("")}
                                    isInvalid={campaignName.length >= 60}
                                    errorMessage={
                                        "Campaign name should be less than 60 characters"
                                    }
                                    maxLength={60}
                                />

                                {/* user ID */}
                                <Input
                                    isReadOnly
                                    disableAnimation
                                    name="campaignID"
                                    color="primary"
                                    type="text"
                                    label="Campaign ID"
                                    className="max-w-[150px] w-full hover:cursor-default"
                                    style={{
                                        cursor: "default",
                                    }}
                                    value={userId}
                                />
                            </div>

                            {/* Target Aud */}
                            <SelectAudienceComp />

                            {/* Drop Down Input */}
                            <DropDownInput />

                            {/* Message Box */}
                            {!isLoading ? (
                                <>
                                    {
                                        template?.type === "imgcarousel" ? (
                                            <div className="mb-10">
                                                {" "}
                                                {/*  show message slider for carousel */}
                                                <Slider
                                                    sections={
                                                        template.template_contents &&
                                                        template
                                                            .template_contents
                                                            ?.length > 0 &&
                                                        template.template_contents?.map(
                                                            (
                                                                content,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <MessageBox
                                                                        key={
                                                                            content.id
                                                                        }
                                                                        csvColumns={
                                                                            csvFileContent?.columns
                                                                        }
                                                                        message={`${content.card_heading}\n${content.card_subheading}`}
                                                                        variables={[
                                                                            ...(content.card_heading_vars ||
                                                                                []),
                                                                            ...(content.card_subheading_vars ||
                                                                                []),
                                                                        ]}
                                                                    />
                                                                );
                                                            }
                                                        )
                                                    }
                                                />
                                            </div>
                                        ) : template?.type === "singleimg" ||
                                          template?.type === "video" ? (
                                            <MessageBox
                                                csvColumns={
                                                    csvFileContent?.columns
                                                }
                                                message={
                                                    template &&
                                                    template.template_contents &&
                                                    template.template_contents
                                                        .length > 0
                                                        ? `${template.template_contents[0].card_heading}\n${template.template_contents[0].card_subheading} `
                                                        : ""
                                                }
                                                variables={
                                                    template &&
                                                    template.template_contents &&
                                                    template.template_contents
                                                        .length > 0
                                                        ? [
                                                              ...(template
                                                                  .template_contents[0]
                                                                  .card_heading_vars ||
                                                                  []),
                                                              ...(template
                                                                  .template_contents[0]
                                                                  .card_subheading_vars ||
                                                                  []),
                                                          ]
                                                        : []
                                                }
                                            />
                                        ) : (
                                            <MessageBox
                                                csvColumns={
                                                    csvFileContent?.columns
                                                }
                                                message={
                                                    template &&
                                                    template.template_contents &&
                                                    template.template_contents
                                                        .length > 0
                                                        ? template
                                                              .template_contents[0]
                                                              ?.message
                                                        : ""
                                                }
                                                variables={
                                                    template &&
                                                    template.template_contents &&
                                                    template.template_contents
                                                        .length > 0
                                                        ? template
                                                              .template_contents[0]
                                                              .message_vars
                                                            ? template
                                                                  .template_contents[0]
                                                                  .message_vars
                                                            : []
                                                        : []
                                                }
                                            />
                                        ) // show message for message single image and video type template
                                    }
                                </>
                            ) : (
                                <div className="w-full h-fit flex items-center justify-center">
                                    <LoaderIcon className="animate-spin" />
                                </div>
                            )}

                            {/* for fallback text */}
                            {template && template?.fallbackText && (
                                <FallbackTextBox
                                    csvColumns={csvFileContent?.columns}
                                    message={template?.fallbackText}
                                    variables={
                                        template.fallbackTextVariables || []
                                    }
                                    label={t("Fallback Text")}
                                />
                            )}
                            {/* Divider */}
                            <Divider />
                            {/* Campaigns */}
                            <Suspense
                                fallback={<div>Loading campaigns...</div>}>
                                <Campaigns />
                            </Suspense>
                        </div>
                    </CardBody>
                    <CardFooter className="w-full p-5 border-t border-default">
                        {/* Footer Buttons */}
                        <FooterButtons
                            onSubmitHandller={() => handleCampaignLaunch()}
                        />
                    </CardFooter>
                </Card>
            </div>

            {/* Right Col : Mockup */}
            <Card className="dark:border border-default">
                <CardHeader className="p-3 bg-content2 flex-column">
                    <p className="font-semibold text-md text-primary-700">
                        Preview Mockup
                    </p>
                    <p className="text-xs text-default-500">
                        Real time preview of end user message
                    </p>
                </CardHeader>
                <CardBody>
                    <Suspense fallback={<div>Loading mockup preview...</div>}>
                        <MockupIndex
                            messageData={messageData}
                            contactName={selectedBot?.name}
                        />
                    </Suspense>
                </CardBody>
            </Card>
            {/* Righ Col Ends here */}
        </div>
    );
}
