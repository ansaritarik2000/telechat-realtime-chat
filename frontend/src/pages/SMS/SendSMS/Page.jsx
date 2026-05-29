import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
    addToast,
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

// Lazy load the components
const MockupIndex = React.lazy(() => import("./Mockups/Index"));

const Campaigns = React.lazy(() => import("./Campaigns/Index"));

import FooterButtons from "./Buttons/Index";
import generateSMSCampaignID from "../../../functions/sms/generateSmsCampaignName";
import generateSMSUserId from "../../../functions/sms/generateSmsUserId";
import SendIndex from "./Send/Index";
import { useSendSmsStore } from "../../../store/sendSmsStore";
import { sendSMSservice } from "../../../services/Sms/sendSmsService";
import { useSendRcStore } from "../../../store/sendRcsStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PromptInputIndex from "../../../components/prompt-container/PromptIndex";

export default function SendSMSPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const timeoutRef = useRef(null); // Md Faizan: Store timeout reference
    const user_id = localStorage.getItem("user_id");
    const queryClinet = useQueryClient();
    // zustand sms store
    const {
        campaignName,
        phoneNumbers,
        setCampaignName,
        interval,
        userId,
        setUserId,
        selectedTemplateType,
        selectedTemplate,
        selectedHeader,
        csvFileContent,
        selectedDate,
        batchSize,
        sendAsFlashSMS,
        resetSendSmsStore,
    } = useSendSmsStore();

    const { setRcsAnimationModel } = useSendRcStore(); // this is use for checked modal open currently i'm using comman modal for rcs and sms

    // this useeffect function are used to get campaign name and userid
    useEffect(() => {
        const { campaingName, campaignId } = generateSMSCampaignID();
        setCampaignName(campaingName);
        setUserId(campaignId);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // formated date
    const formattedDate = selectedDate
        ? new Date(selectedDate).toISOString()
        : null;

    // sms message Data
    const smsMessageData = [
        {
            type: "text",
            content: selectedTemplate.message || "Preview your sms message...",
        },
    ];

    // Function to launch the SMS campaign
    const { mutateAsync: launchCampaign } = useMutation({
        mutationFn: async () => {
            // Clear previous timeout (if any)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            const arrayInterval = [...interval];

            // preapre the SMS data to send
            const smsData = {
                campaign_name: campaignName,
                phone_numbers: phoneNumbers,
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
                is_flash_sms: sendAsFlashSMS,
            };

            // Call the service function to send RCS data
            const response = await sendSMSservice(smsData);

            return response;
        },
        onSuccess: () => {
            setRcsAnimationModel(true);
            queryClinet.invalidateQueries(["sms-campaign"]);
            // after seven second model will close and navigate /rcsreports
            timeoutRef.current = setTimeout(() => {
                setRcsAnimationModel(false);
                resetSendSmsStore();
                navigate("/smsreports");
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

    return (
        <div className="grid gap-3 grid-cols-3 h-full">
            {/* Left Col */}
            <div className="col-span-3 md:col-span-2  w-full h-full">
                {/* Body */}
                <Card
                    shadow="sm"
                    fullWidth="true"
                    radius="lg"
                    className="dark:border border-default">
                    <CardHeader className="bg-gradient-to-r from-warning-100  to-warning-50 p-5 ">
                        <Crumb secondSib={t("Send SMS")} />{" "}
                    </CardHeader>
                    <CardBody className="p-6">
                        <div className="flex flex-col gap-8">
                            <div className="flex justify-between gap-4">
                                <Input
                                    isRequired
                                    isClearable
                                    size="md"
                                    type="text"
                                    label={t("Campaign Name")}
                                    variant="flat"
                                    className="flex-1"
                                    value={campaignName}
                                    onClear={() => setCampaignName("")}
                                    onChange={(e) =>
                                        setCampaignName(e.target.value)
                                    }
                                    isInvalid={campaignName.length >= 60}
                                    errorMessage={
                                        "Campaign name should be less than 60 characters"
                                    }
                                    maxLength={60}
                                />

                                {/* Campaign ID */}
                                <Input
                                    isReadOnly
                                    disableAnimation
                                    classNames="!cursor-default"
                                    name="campaignID"
                                    color="warning"
                                    type="text"
                                    label="Campaign ID"
                                    className="max-w-[150px] w-full"
                                    value={userId}
                                />
                            </div>

                            {/* Send Nums / CSV */}
                            <Suspense fallback={<div>Loading NumCSV...</div>}>
                                <SendIndex />
                            </Suspense>

                            {/* Drop Down Input */}
                            <DropDownInput />

                            {/* Message Box */}
                            {/* <MessageBox
                                message={selectedTemplate?.message}
                                variables={selectedTemplate?.message_vars}
                                csvColumns={csvFileContent.columns}
                            /> */}

                            {/* Message Box*/}
                            <PromptInputIndex
                                message={selectedTemplate?.message}
                                variables={selectedTemplate?.message_vars}
                                csvColumns={csvFileContent.columns}
                            />

                            {/* Divider */}
                            <Divider />

                            {/* Campaigns */}
                            <Suspense
                                fallback={<div>Loading Campaigns...</div>}>
                                <Campaigns />
                            </Suspense>
                        </div>
                    </CardBody>
                    <CardFooter className="w-full p-5 border-t border-default">
                        {/* Footer Buttons */}
                        <FooterButtons onSubmitHandller={launchCampaign} />
                    </CardFooter>
                </Card>
            </div>
            {/* Left Col (Form) Ends Here */}

            {/* Right Col : Mockup */}
            <Card className="dark:border border-default">
                <CardHeader className="p-3 bg-content2 flex-column">
                    <p className="font-semibold text-md text-warning-700">
                        Preview Mockup
                    </p>
                    <p className="text-xs text-default-500">
                        Real time preview of end user message
                    </p>
                </CardHeader>
                <CardBody>
                    <Suspense fallback={<div>Loading Mockup...</div>}>
                        <MockupIndex
                            contactName={
                                selectedHeader.name
                                    ? `VM-${selectedHeader.name}`
                                    : ""
                            }
                            messageData={smsMessageData}
                        />
                    </Suspense>
                </CardBody>
            </Card>
            {/* Righ Col Ends here */}
        </div>
    );
}
