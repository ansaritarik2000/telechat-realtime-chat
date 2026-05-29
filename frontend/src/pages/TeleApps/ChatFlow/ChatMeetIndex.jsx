import React, { lazy, Suspense } from "react";
import { Icon } from "@iconify-icon/react";
import { Tabs, Tab } from "@heroui/react";
const ChatBody = lazy(() => import("./TeleChat/ChatBody"));
const UpcomingIndex = lazy(() => import("./Upcoming/UpcomingIndex"));
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const TabSwitcher = () => {
    return (
        <Tabs
            aria-label="Chat Flow Options"
            color="primary"
            variant="light"
            classNames={{
                base: "flex-col p-1 z-40  my-3 rounded-tl-xl rounded-bl-xl ml-2",
                tabList: "flex-col gap-2",
                cursor: "w-12 h-12 rounded-full bg-success-400",
                tab: "w-12 h-12 rounded-full bg-gray-200 data-[selected=true]:bg-success-400 data-[selected=true]:text-white",
                tabContent: "flex-between w-full",
            }}
        >
            <Tab
                key="chat"
                title={
                    <Icon
                        icon="solar:chat-line-linear"
                        width="1.5em"
                        height="1.5em"
                    />
                }
                className="w-full"
            >
                <Suspense fallback={<LoadingSpinner />}>
                    <ChatBody />
                </Suspense>
            </Tab>
            <Tab
                key="upcoming"
                title={
                    <Icon
                        icon="akar-icons:schedule"
                        width="1.5em"
                        height="1.5em"
                    />
                }
                className="w-full"
            >
                <Suspense fallback={<LoadingSpinner />}>
                    <UpcomingIndex />
                </Suspense>
            </Tab>
        </Tabs>
    );
};

export default function ChatFlowIndex() {
    return (
        <div className="flex  border border-transparent rounded-lg bg-content2 h-[90vh] w-full">
            <TabSwitcher />
        </div>
    );
}
