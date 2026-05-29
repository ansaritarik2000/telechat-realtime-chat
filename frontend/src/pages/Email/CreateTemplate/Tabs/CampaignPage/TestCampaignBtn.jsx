import React, { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Textarea,
    Image,
    addToast,
} from "@heroui/react";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import { sendEmailsTest } from "../../../../../services/email/sendEmails";
import { Rocket } from "../../../../../utils/ReusableIcons";
import { HtmlTemplate } from "../Buttons/ActionButtonFun";

export default function EmailTestBtn() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // zustand store
    const setEmailCampaingnData = emailCampaingnStore(
        (state) => state.setEmailCampaingnData
    );
    const emailCampaingnData = emailCampaingnStore(
        (state) => state.emailCampaingnData
    );
    const [emails, setEmails] = useState([]);
    // save the emails in zustand store
    const handleChange = (e) => {
        if (emailCampaingnData.testEmail.length > 5) {
            addToast({
                title: "Alert",
                description: "Only Emails 5 can be sent",
                color: "warning",
            });
        }
        setEmailCampaingnData(e.target.name, e.target.value.split(","));
    };
    function replaceEmailPart(subject, email) {
        const emailPartBeforeAt = email.split("@")[0];
        return subject
            .replace("{{EmailPartBeforeAt}}", emailPartBeforeAt)
            .replace("{{Name}}", "")
            .replace("{{Last Name}}", "");
    }
    const runCampaign = async () => {
        setEmails(emailCampaingnData.testEmail);
        let response = await HtmlTemplate(
            emailCampaingnData.templateName,
            emailCampaingnData.templateType
        );
        let personalizedHTML = response.data;

        try {
            const emailDetails = emails?.map((email) => {
                let personalizedSubject = replaceEmailPart(
                    emailCampaingnData.subjectLine,
                    email
                );
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

            // Consolidate campaign data
            const campaignData = {
                emails: emailDetails,
                submittedCredits: emails.length,
                ...emailCampaingnData,
            };

            console.log("campaignData", campaignData);
            await sendEmailsTest(campaignData);
            addToast({
                title: "Success 🎉",
                description: "Testing mail sent!",
                color: "success",
            });
        } catch (error) {
            console.log("Email test are failed", error);
            throw error;
        }
    };
    return (
        <div>
            <Button
                size="sm"
                radius="sm"
                color="default"
                variant="flat"
                onClick={onOpen}
                startContent={
                    <Icon
                        icon="heroicons:rocket-launch"
                        width="1.4em"
                        height="1.4em"
                    />
                }
                onPress={onOpen}
            >
                Test Campaign
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-1 items-center">
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
                                    name="testEmail"
                                    label="Email"
                                    size="md"
                                    radius="sm"
                                    variant="flat"
                                    placeholder="customer@gmail.com, customer@outlook.com"
                                    onChange={handleChange}
                                />
                            </ModalBody>
                            <ModalBody>
                                <div className="flex  text-xs text-gray-500 ml-1 ">
                                    <span className="text-red-500">*</span>{" "}
                                    Please enter only 5 emails separated by
                                    commas" , "
                                </div>
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
                                    onClick={runCampaign}
                                    onPress={onClose}
                                    variant="flat"
                                >
                                    Test
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
