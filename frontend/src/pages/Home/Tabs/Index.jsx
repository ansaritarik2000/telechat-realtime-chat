import React, { Suspense, lazy } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import SMSCards from "./SMS/SMSCards";
import PreviousSMSCampaigns from "./RecentTables/SMSTable/Index";
import { useTranslation } from "react-i18next";

// Lazy loading the components
const RCSCards = lazy(() => import("./RCS/RCSCards"));
const WhatsAppCards = lazy(() => import("./WhatsApp/WhatsAppCards"));
const EmailCards = lazy(() => import("./Email/EmailCards"));

const PreviousRCSCampaigns = lazy(() =>
    import("./RecentTables/RCSTable/Index")
);
const PreviousWhatsAppCampaigns = lazy(() =>
    import("./RecentTables/WATable/Index")
);
const PreviousEmailCampaigns = lazy(() =>
    import("./RecentTables/EmailTable/Index")
);

export default function TabIndex() {
    const [selected, setSelected] = React.useState("sms");
    const { t } = useTranslation();

    const handleTabChange = (key) => {
        setSelected(key);
    };

    return (
        <div>
            <Tabs
                aria-label="Tabs"
                selectedKey={selected}
                onSelectionChange={handleTabChange}
                size="lg"
                radius="full"
                className="w-full justify-center py-4">
                <Tab
                    key="sms"
                    title={
                        <div className="flex gap-1 items-center ">
                            <Icon
                                icon="ph:chat-dots-duotone"
                                width="1.2em"
                                height="1.2em"
                                className={
                                    selected === "sms"
                                        ? "text-green-500"
                                        : "light:text-default-500"
                                }
                            />
                            {t("SMS")}
                        </div>
                    }
                    className="flex flex-col gap-4">
                    <SMSCards />
                    <PreviousSMSCampaigns />
                </Tab>

                <Tab
                    key="rcs"
                    title={
                        <div className="flex gap-1 items-center">
                            <Icon
                                icon="pepicons-print:text-bubbles"
                                width="1.3em"
                                height="1.3em"
                                className={
                                    selected === "rcs"
                                        ? "text-green-500"
                                        : "text-default-500"
                                }
                            />
                            {t("RCS")}
                        </div>
                    }
                    className="flex flex-col gap-4">
                    <Suspense fallback={<LoadingSpinner />}>
                        <RCSCards />
                        <PreviousRCSCampaigns />
                    </Suspense>
                </Tab>

                <Tab
                    key="whatsapp"
                    title={
                        <div className="flex gap-1 items-center">
                            <Icon
                                icon="prime:whatsapp"
                                width="1.3em"
                                height="1.3em"
                                className={
                                    selected === "whatsapp"
                                        ? "text-green-500"
                                        : "text-default-500"
                                }
                            />
                            {t("WhatsApp")}
                        </div>
                    }
                    className="flex flex-col gap-4">
                    <Suspense fallback={<LoadingSpinner />}>
                        <WhatsAppCards />
                        <PreviousWhatsAppCampaigns />
                    </Suspense>
                </Tab>

                <Tab
                    key="email"
                    title={
                        <div className="flex gap-1 items-center">
                            <Icon
                                icon="ic:outline-email"
                                width="1.2em"
                                height="1.2em"
                                className={
                                    selected === "email"
                                        ? "text-green-500"
                                        : "text-default-500"
                                }
                            />
                            {t("Email")}
                        </div>
                    }
                    className="flex flex-col gap-4">
                    <Suspense fallback={<LoadingSpinner />}>
                        <EmailCards />
                        <PreviousEmailCampaigns />
                    </Suspense>
                </Tab>
            </Tabs>
        </div>
    );
}
