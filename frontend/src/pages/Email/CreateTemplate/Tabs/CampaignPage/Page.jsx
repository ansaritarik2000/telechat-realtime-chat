import React, { Suspense, useState, useEffect } from "react";
import {
    Input,
    Skeleton,
    Card,
    Divider,
    Chip,
    CardBody,
    CardHeader,
    CardFooter,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import EmailTestBtn from "./TestCampaignBtn";
import ABTestingModal from "../FilterModal/ABTestingModal";
import SplitCampaign from "../Buttons/SplitCampaign";
import TargetAudience from "../TargetAudience/TargetAudience";
import DropdownMenu from "../Buttons/Dropdown";
import { ActionButtons } from "../Buttons/ActionButtons";
import EmailTemplatesColumnView from "../EmailTemplateColumnView";
import PersonalizationInput from "../Buttons/SubjectLine";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "../Buttons/ActionButtonFun";
import AvatarIndex from "../../../../../components/AvatarGen/Index";
import Crumb from "../../../../../components/Breadcrumb/Crumb";
import EmailTemplateIndex from "../../Index";
import EmailTemplatePreview from "./Preview";

export default function CampaignPage() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [campaignID, setCampaignId] = useState("");
    const [inputValue, setInputValuePersonalization] = useState("");
    const [selectedPersonalization, setSelectedPersonalization] = useState([]);
    const [emailVal, setEmail] = useState("");
    const { emailCampaingnData, setEmailCampaingnData } = emailCampaingnStore();

    // Group selected personalization by type

    const groupedPersonalization = selectedPersonalization.reduce(
        (acc, item) => {
            const [type, value] = item.split(":");
            if (!acc[type]) acc[type] = [];
            acc[type].push(value);
            return acc;
        },
        {}
    );
    useEffect(() => {
        const date = formatDate();
        const uuid = uuidv4();
        const uniqueNumber = parseInt(uuid.replace(/-/g, ""), 16) % 1000000;
        setCampaignId(String(uniqueNumber).padStart(6, "0"));
        setEmailCampaingnData(
            "campaignID",
            String(uniqueNumber).padStart(6, "0")
        );
        setEmailCampaingnData(
            "campaignName",
            `${String(uniqueNumber).padStart(6, "0")}-Email Campaign (${date})`
        );
    }, []);
    //Skelton Loader
    const [isLoaded, setIsLoaded] = useState(false);

    const toggleLoad = () => {
        setIsLoaded(!isLoaded);
    };

    // handle the email name and user id form input field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailCampaingnData(name, value);
    };
    const handleClear = () => {
        setEmailCampaingnData("campaignName", "");
    };

    console.log(emailCampaingnStore.getState().emailCampaingnData);
    return (
        <div className="grid gap-3 grid-cols-3 ">
            {/*Left Col */}
            <div className="col-span-3 md:col-span-2 w-full ">
                <Card
                    shadow="sm"
                    fullWidth="true"
                    radius="lg"
                    className="dark:border border-default"
                >
                    <CardHeader className="bg-gradient-to-r from-gray-100 dark:from-content2  to-gray-50 dark:to-content1 p-5 ">
                        <Crumb secondSib={t("Send Email")} />
                    </CardHeader>

                    <CardBody className="p-6">
                        <div className="flex flex-col gap-4 ">
                            {/*First Two Fields */}
                            <div className="flex justify-between gap-4 pb-2">
                                {/* Campaign Name Input */}
                                <Input
                                    name="campaignName"
                                    isClearable
                                    isRequired
                                    type="text"
                                    label="Campaign Name"
                                    className="w-full"
                                    value={emailCampaingnData["campaignName"]}
                                    onChange={(e) => handleChange(e)}
                                    onClear={() => handleClear("campaignName")}
                                    // Update state on change
                                />

                                {/* User ID Input */}
                                <Input
                                    isReadOnly
                                    disableAnimation
                                    name="campaignID"
                                    color="success"
                                    type="text"
                                    label="Campaign ID"
                                    className="max-w-[150px] w-full"
                                    value={campaignID}

                                    // Update state on change
                                />
                            </div>

                            {/*Target Audience */}
                            <div className="pb-2">
                                <TargetAudience />
                            </div>

                            {/*Three dropdowns */}
                            <div className="pb-2">
                                <DropdownMenu setEmail={setEmail} />
                            </div>

                            {/* Subject Input */}
                            <div>
                                <PersonalizationInput
                                    setInputValuePersonalization={
                                        setInputValuePersonalization
                                    }
                                    setSelectedPersonalization={
                                        setSelectedPersonalization
                                    }
                                />
                            </div>

                            {/*Icons- below the Message Box */}
                            <div className="flex flex-row pb-2 mt-[-5px] justify-between">
                                <div className="flex gap-2 flex-row ">
                                    <EmailTestBtn />
                                    {/* Modal */}
                                    <ABTestingModal isModalOpen={isModalOpen} />
                                </div>
                            </div>

                            {/* Display Personalization Data */}
                            <motion.div
                                className="flex flex-col items-center justify-center mx-auto w-full pb-4 gap-3 border rounded-md border-default"
                                variants={staggerVariants.container}
                                initial="hidden"
                                animate="visible"
                            >
                                {/* Mailbox Preview Header */}
                                <p
                                    className="font-semibold text-sm self-start p-4 rounded-md bg-content2 w-full"
                                    // variants={staggerVariants.item}
                                >
                                    Mailbox Preview
                                </p>

                                {/* First Card (Top Card) */}
                                <motion.div
                                    variants={staggerVariants.item}
                                    className="w-11/12 flex-center"
                                >
                                    <EmptySkeleton isLoaded={isLoaded} />
                                </motion.div>

                                {/* Second Card (Middle Card - Bigger with Enhanced 3D Effect) */}
                                <motion.div
                                    variants={staggerVariants.item}
                                    className="w-11/12 flex-center"
                                    whileHover={{
                                        scale: 1.03,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeInOut",
                                        },
                                    }}
                                >
                                    <Card className="w-11/12 px-4 h-[2.8rem] flex items-center flex-row z-10 border border-default shadow-lg bg-content2 ">
                                        <div className="flex flex-row gap-2 items-center justify-between">
                                            <AvatarIndex
                                                isEditable={false}
                                                avatarType={"character"}
                                                value={"TP"}
                                                size={30}
                                                radius={18}
                                                border={false}
                                                borderColor="#f0f0f0"
                                            />
                                            <span className="text-xs pr-2">
                                                {emailVal || "user@telepie.com"}
                                            </span>
                                            <Divider
                                                className="mx-4 h-1 w-[120px]"
                                                orientation="vertical"
                                            />
                                        </div>
                                        <div className="flex flex-row mx-16 items-center gap-2">
                                            <span className="text-xs pr-2">
                                                {inputValue || "Subject Line"}
                                            </span>
                                            {Object.keys(
                                                groupedPersonalization
                                            ).map((key) => (
                                                <div
                                                    key={key}
                                                    className="flex flex-col"
                                                >
                                                    <div className="flex flex-row flex-wrap">
                                                        {groupedPersonalization[
                                                            key
                                                        ].map(
                                                            (value, index) => (
                                                                <Chip
                                                                    size="sm"
                                                                    key={index}
                                                                    className="text-xs pr-2 h-2/3 w-1/3"
                                                                >
                                                                    <span className="text-xs">
                                                                        {key}
                                                                    </span>
                                                                </Chip>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Third Card (Bottom Card) */}
                                <motion.div
                                    variants={staggerVariants.item}
                                    className="w-11/12 flex-center"
                                >
                                    <EmptySkeleton isLoaded={isLoaded} />
                                </motion.div>
                            </motion.div>

                            {/*Checkboxes */}
                            <div className="mt-4">
                                <Suspense
                                    fallback={<div>Loading Campaigns...</div>}
                                >
                                    <SplitCampaign />
                                </Suspense>
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="w-full p-5 border-t border-default">
                        <ActionButtons />
                    </CardFooter>
                </Card>
            </div>
            {/* Left Col Ends Here */}

            {/*Right Col Starts Here*/}
            <Card className="dark:border border-default col-span-1">
                <CardHeader className="p-3 bg-content2 flex-column">
                    <p className="font-semibold text-md text-secondary-700">
                        Preview Mockup
                    </p>
                    <p className="text-xs text-default-500">
                        Real time preview of email template
                    </p>
                </CardHeader>
                <CardBody>
                    <Suspense fallback={<div>Loading preview...</div>}>
                        <div className="w-full h-full ">
                            {/* G.Prakas: This is old one, Review it and delete if required */}
                            {/* <EmailTemplatesColumnView />  */}

                            {/* New One */}
                            <EmailTemplatePreview />
                        </div>
                    </Suspense>
                </CardBody>
            </Card>
            {/*Right Col Ends Here*/}
        </div>
    );
}

const EmptySkeleton = ({ isLoaded }) => {
    return (
        <Card className="w-11/12 h-[2.8rem] flex items-center px-4 flex-row shadow-md border border-default">
            <div className="flex flex-row gap-2 items-center">
                <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-2xl">
                    <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                </Skeleton>
                <Divider
                    className="mx-4 h-1 w-[120px]"
                    orientation="vertical"
                />
            </div>
            <div className="flex flex-row mx-16 gap-10">
                <Skeleton isLoaded={isLoaded} className="w-[70px] rounded-2xl">
                    <Divider className="mx-4 h-1" orientation="vertical" />
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className="w-[70px] rounded-2xl">
                    <Divider className="mx-4 h-1" orientation="vertical" />
                </Skeleton>
            </div>
        </Card>
    );
};

const staggerVariants = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Stagger delay between children
            },
        },
    },
    item: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    },
};
