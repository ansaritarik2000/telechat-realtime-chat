import { useState, useEffect } from "react";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import {
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Divider,
} from "@heroui/react";

import { toast } from "react-hot-toast";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import { sendEmailsClient } from "../../../../../services/email/sendEmails";
import { useTranslation } from "react-i18next";
import { HtmlTemplate } from "../Buttons/ActionButtonFun";

export default function ABTestingModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { t } = useTranslation();
    const [audience, setAudience] = useState(0);
    const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
    const [isDropdownOpenB, setIsDropdownOpenB] = useState(false);
    const [selectedKeysA, setSelectedKeysA] = useState(new Set());
    const [selectedKeysB, setSelectedKeysB] = useState(new Set());
    const [subjectLineA, setSubjectLineA] = useState("");
    const [subjectLineB, setSubjectLineB] = useState("");
    const [subjectCountA, setSubjectCountA] = useState(null);
    const [subjectCountB, setSubjectCountB] = useState(null);
    const {
        resetEmailCamaingData,
        sendDataToBackend,
        getDataFromBackend,
        emailCampaingnData,
    } = emailCampaingnStore();
    const [isRunning, setIsRunning] = useState(false);
    const subjectLines = [subjectLineA, subjectLineB];
    const setEmailCampaingnData = emailCampaingnStore(
        (state) => state.setEmailCampaingnData
    );
    const [valid, setValid] = useState(true);

    const emailArray = Array.from(emailCampaingnData.targetEmails);
    useEffect(() => {
        const targetMails = Array.isArray(emailCampaingnData.targetEmails)
            ? emailCampaingnData.targetEmails
            : Array.from(emailCampaingnData.targetEmails);

        setAudience(
            (emailCampaingnData?.validEmails?.length || 0) +
                (emailCampaingnData?.phoneGroupEmails?.length || 0) +
                (targetMails?.length || 0)
        );
        if (
            parseInt(subjectCountA) + parseInt(subjectCountB) <= audience &&
            (parseInt(subjectCountA) < audience ||
                parseInt(subjectCountB) < audience)
        ) {
            setValid(false);
        } else {
            setValid(true);
        }
    }, [emailCampaingnData, subjectCountA, subjectCountB]);
    const handleSubmit = async () => {
        try {
            if (
                !subjectLineA ||
                !subjectLineB ||
                !subjectCountA ||
                !subjectCountB
            ) {
                toast.error("Both Subject Lines must be filled!");
                return;
            }
            if (
                parseInt(subjectCountB) + parseInt(subjectCountA) >
                emailArray.length
            ) {
                toast.error("You can't split more than total mails!");
                return;
            }

            // console.log("Emails for A will be sliced from 0 to", parseInt(subjectCountA, 10));
            // console.log(
            //   "Emails for B will be sliced from",
            //   parseInt(subjectCountA, 10),
            //   "to",
            //   parseInt(subjectCountA, 10) + parseInt(subjectCountB, 10)
            // );

            const emailsForA = emailArray.slice(0, parseInt(subjectCountA, 10));
            const emailsForB = emailArray.slice(
                parseInt(subjectCountA, 10),
                parseInt(subjectCountA, 10) + parseInt(subjectCountB, 10)
            );
            let response = await HtmlTemplate(
                emailCampaingnData.templateName,
                emailCampaingnData.templateType
            );
            let personalizedHTML = response.data;
            const emailDetailsA = emailsForA?.map((email) => {
                return {
                    email,
                    subject: subjectLineA,
                    content: emailCampaingnData.templateName,
                    customArgs: {
                        campaignID: emailCampaingnData.campaignID,
                        campaign: emailCampaingnData.campaignName,
                    },
                    personalizedHTML,
                    status: "sent",
                };
            });

            const emailDetailsB = emailsForB?.map((email) => {
                return {
                    email,
                    subject: subjectLineB,
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
            const campaignDataA = {
                emails: emailDetailsA,
                submittedCredits: emailsForA.length,
                ...emailCampaingnData,
            };
            const campaignDataB = {
                emails: emailDetailsB,
                submittedCredits: emailsForB.length,
                ...emailCampaingnData,
            };
            await sendEmailsClient(campaignDataA);
            await sendEmailsClient(campaignDataB);
            toast.success("Successfully Broadcast Created!");
            onOpenChange(false);
            setEmailCampaingnData("AB_Subject", subjectLines);
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    return (
        <>
            <Button
                onPress={onOpen}
                color="default"
                size="sm"
                radius="sm"
                variant="flat"
                startContent={
                    <Icon
                        icon="teenyicons:ab-testing-outline"
                        width="1.8em"
                        height="1.8em"
                    />
                }
            >
                Testing
            </Button>
            <Modal
                className="flex flex-col gap-4 max-w-2xl"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="flex items-center gap-2">
                                    <Icon
                                        icon="teenyicons:ab-testing-outline"
                                        width="40px"
                                        height="40px"
                                    />
                                    Testing
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex flex-col gap-4">
                                {/* Subject Line A */}
                                <div className="space-y-2">
                                    <Chip
                                        color="primary"
                                        variant="flat"
                                        radius="sm"
                                        size="sm"
                                    >
                                        Subject Line A
                                    </Chip>
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Subject Line A"
                                            defaultValue=""
                                            onChange={(e) =>
                                                setSubjectLineA(e.target.value)
                                            }
                                        />

                                        <Input
                                            validate={(value) => {
                                                if (value >= audience) {
                                                    return "value should be less than audience";
                                                }

                                                return null;
                                            }}
                                            type="number"
                                            placeholder="QTY"
                                            value={subjectCountA}
                                            onChange={(e) =>
                                                setSubjectCountA(e.target.value)
                                            }
                                            className="max-w-[6rem]"
                                        />
                                    </div>
                                </div>

                                {/* Subject Line B */}
                                <div className="space-y-2">
                                    <Chip
                                        color="success"
                                        variant="flat"
                                        radius="sm"
                                        size="sm"
                                    >
                                        Subject Line B
                                    </Chip>
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Subject Line B"
                                            defaultValue=""
                                            onChange={(e) =>
                                                setSubjectLineB(e.target.value)
                                            }
                                        />
                                        <Input
                                            validate={(value) => {
                                                if (value >= audience) {
                                                    return "value should be less than audience";
                                                }

                                                return null;
                                            }}
                                            type="number"
                                            placeholder="QTY"
                                            value={subjectCountB}
                                            onChange={(e) =>
                                                setSubjectCountB(e.target.value)
                                            }
                                            className="max-w-[6rem]"
                                        />
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <div className="flex flex-col gap-2 w-full">
                                    <Divider />
                                    {/* Total Audience */}
                                    <span className="flex items-center text-sm text-success">
                                        <Icon
                                            icon="fluent:people-48-filled"
                                            width={"1.3em"}
                                        />
                                        {t("Total audience")}: {audience}
                                    </span>

                                    {/* Buttons */}
                                    <div className="self-end space-x-2">
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            isDisabled={valid}
                                            color="success"
                                            variant="flat"
                                            onPress={handleSubmit}
                                        >
                                            Run
                                        </Button>
                                    </div>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
