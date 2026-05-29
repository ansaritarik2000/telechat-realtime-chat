import { Button, addToast } from "@heroui/react";
import React from "react";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import { sendEmailsClient } from "../../../../../services/email/sendEmails";
import { convertToMilliseconds, HtmlTemplate } from "./ActionButtonFun";

export const ActionButtons = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        resetEmailCamaingData,
        sendDataToBackend,
        getDataFromBackend,
        emailCampaingnData,
    } = emailCampaingnStore();
    const sendToEmails = [
        ...emailCampaingnData.targetEmails,
        ...emailCampaingnData?.phoneGroupEmails,
        ...emailCampaingnData.validEmails,
    ];
    const csvData = emailCampaingnData.csvFileContent?.allData || [];

    function replaceTokens(subject, email, csvData) {
        const user = csvData.find((row) => row.emails === email);
        if (!user) return subject;
        return subject
            .replace("{{Name}}", user.name || "")
            .replace("{{Last Name}}", user.lastName || "");
    }

    function replaceEmailPart(subject, email) {
        const emailPartBeforeAt = email.split("@")[0];
        return subject
            .replace("{{EmailPartBeforeAt}}", emailPartBeforeAt)
            .replace("{{Name}}", "")
            .replace("{{Last Name}}", "");
    }

    function replaceHtmlTemplateToken(htmlTemplate, csvData, email) {
        const emailPartBeforeAt = email.split("@")[0];
        const user = csvData.find((row) => row.emails === email);
        if (!user)
            return htmlTemplate
                .replace("{campaignName}", emailCampaingnData.campaignName)
                .replace("{campaignID}", emailCampaingnData.campaignID);
        return htmlTemplate
            .replace("{{Name}}", user.name || "")
            .replace("{{Last Name}}", user.lastName || "")
            .replace("{{EmailPartBeforeAt}}", emailPartBeforeAt || "");
    }

    const handleSend = async () => {
        const batchSize = emailCampaingnData.batchSize || sendToEmails.length; // Use batch size if provided, otherwise send all emails
        const miliseconds = convertToMilliseconds(emailCampaingnData?.Interval);
        const delay = miliseconds || 0; // Default delay to 0 if not provided
        // console.log('delay',delay)
        const scheduleDate = emailCampaingnData.date;
        let response = await HtmlTemplate(
            emailCampaingnData.templateName,
            emailCampaingnData.templateType
        );
        let htmlTemplate = response.data;
        console.log();
        const sendBatch = async (emailsBatch) => {
            const emailDetails = emailsBatch.map((email) => {
                let personalizedSubject;
                let personalizedHTML;
                if (emailCampaingnData.validEmails.length >= 1) {
                    personalizedSubject = replaceTokens(
                        emailCampaingnData.subjectLine,
                        email,
                        csvData
                    );
                } else if (
                    Array.from(emailCampaingnData.targetEmails).length >= 1
                ) {
                    personalizedSubject = replaceEmailPart(
                        emailCampaingnData.subjectLine,
                        email
                    );
                }
                personalizedHTML =
                    replaceHtmlTemplateToken(htmlTemplate, csvData, email) ||
                    `Template Not Selected`;
                return {
                    email,
                    subject: personalizedSubject,
                    content: emailCampaingnData.templateName,
                    customArgs: {
                        campaignID: emailCampaingnData.campaignID,
                        campaign: emailCampaingnData.campaignName,
                    },
                    personalizedHTML,
                    status: "sent",
                };
            });

            const campaignData = {
                emails: emailDetails,
                submittedCredits: emailsBatch.length,
                ...emailCampaingnData,
            };
            console.log("campaignData", campaignData);
            await sendEmailsClient(campaignData);
        };

        if (scheduleDate) {
            // Schedule the emails
            const currentDate = new Date();
            const delayUntilSchedule = new Date(scheduleDate) - currentDate;

            if (delayUntilSchedule > 0) {
                setTimeout(async () => {
                    for (let i = 0; i < sendToEmails.length; i += batchSize) {
                        const batch = sendToEmails.slice(i, i + batchSize);
                        await sendBatch(batch);
                        if (i + batchSize < sendToEmails.length) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, delay)
                            );
                        }
                    }
                    addToast({
                        title: "Success 🎉",
                        description: "Scheduled Campaign Sent",
                        color: "success",
                    });
                }, delayUntilSchedule);
            } else {
                addToast({
                    title: "Alert",
                    description:
                        "Scheduled date is in the past. Please select a future date.",
                    color: "warning",
                });
            }
        } else {
            // Immediate sending
            for (let i = 0; i < sendToEmails.length; i += batchSize) {
                const batch = sendToEmails.slice(i, i + batchSize);
                await sendBatch(batch);
                addToast({
                    title: "Success 🎉",
                    description: "First Batch Sent to Emails",
                    color: "success",
                });
                if (i + batchSize < sendToEmails.length && delay > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
            addToast({
                title: "Success 🎉",
                description: "Campaign Created & Sent to Emails!",
                color: "success",
            });
        }
        // resetEmailCamaingData();
    };

    const handleDiscard = () => {
        navigate("/emaildash");
    };

    const handleResetData = async () => {
        await resetEmailCamaingData();
    };

    return (
        <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row gap-4">
                <Button
                    size="md"
                    radius="sm"
                    onClick={handleDiscard}
                    startContent={
                        <Icon
                            icon="iconamoon:trash-bold"
                            width="1.3em"
                            height="1.3em"
                        />
                    }
                    color="danger"
                    variant="bordered"
                >
                    {t("Discard")}
                </Button>

                <Button
                    size="md"
                    radius="sm"
                    onClick={handleResetData}
                    startContent={
                        <Icon
                            icon="ri:reset-right-line"
                            width="1.2em"
                            height="1.2em"
                        />
                    }
                    color="default"
                    variant="bordered"
                >
                    {t("Reset")}
                </Button>
            </div>

            <div className="items-right">
                <Button
                    size="md"
                    radius="sm"
                    onClick={handleSend}
                    endContent={
                        <Icon
                            icon="mingcute:send-plane-line"
                            width="1.2em"
                            height="1.2em"
                        />
                    }
                    color="success"
                    variant="shadow"
                    className="text-white"
                >
                    {t("Send")}
                </Button>
            </div>
        </div>
    );
};
