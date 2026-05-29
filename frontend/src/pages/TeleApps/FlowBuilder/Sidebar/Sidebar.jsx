import React, { useState, useEffect } from "react";
import { Divider, Tooltip, Button, ScrollShadow } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import RCS from "./RCS";
import SMS from "./SMS";
import Timer from "./Timer";
import WhatsApp from "./WhatsApp";
import SidebarItems from "./SidebarItems/Index";
import IncomingWAConfig from "./ItemSettings/IncomingWA";
import IncomingRCSConfig from "./ItemSettings/IncomingRCS";
import WebhookConfig from "./Webhook";
import CommonHeader from "./CommonHeader";
import { CreateRecord } from "./ItemSettings/ChildMenu/CreateRecord";
import { UpdateRecord } from "./ItemSettings/ChildMenu/UpdateRecord";
import { DeleteRecord } from "./ItemSettings/ChildMenu/DeleteRecord";
import { CompleteTask, CreateTask } from "./ItemSettings/ChildMenu/Tasks";
import { AdjustTime } from "./ItemSettings/ChildMenu/AdjustTime";
import { Formula } from "./ItemSettings/ChildMenu/Formula";
import { RandomNumber } from "./ItemSettings/ChildMenu/RandomNumber";
import { SendHTTPRequest } from "./ItemSettings/ChildMenu/SendHTTPRequest";
import { GoBackToNode } from "./ItemSettings/ChildMenu/GoBackToNode";
import DelayWrapper from "./ItemSettings/ChildMenu/Delay";
import IfElseSwitch from "./ItemSettings/ChildMenu/IfElseSwitch";
import RecordCreatedConfig from "./RecordCreated";
import RecordUpdatedConfig from "./RecordUpdated";
import ManualRecordFlowConfig from "./ManualRecordFlow";
import EmailConfig from "./Email";

export default function FlowSidebar({
    copyNode,
    selectedNode,
    setSelectedNode,
    selectedNodeId,
    menu,
    setMenu,
}) {
    const [sidebarToggle, setSidebarToggle] = useState(false);

    // open preview modal template
    const openTemplateModal = () => {
        setVisible(true);
    };

    // Automatically toggle sidebar when selectedNode changes
    useEffect(() => {
        if (selectedNode) {
            setSidebarToggle(true);
        }
    }, [selectedNode]);

    const handleSidebarToggle = () => {
        setSidebarToggle((prevState) => {
            if (prevState) {
                // If sidebar is closing, reset selectedNode
                setSelectedNode(null);
            }
            return !prevState;
        });
    };

    const renderSelectedNode = () => {
        const backToDefault = () => setSelectedNode(null);
        console.log("Selected Node data", selectedNode);

        switch (selectedNode) {
            case "RCSNode":
                return (
                    <div className="flex justify-between items-center">
                        <RCS
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                    </div>
                );
            case "SMSNode":
                return (
                    <div className="flex justify-between items-center">
                        <SMS
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                    </div>
                );
            case "EmailNode":
                return (
                    <div className="flex flex-col gap-2">
                        <CommonHeader
                            name={"Email"}
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                        <EmailConfig />
                    </div>
                );
            case "WhatsAppNode":
                return (
                    <div className="flex justify-between items-center">
                        <WhatsApp
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                    </div>
                );
            case "WaitTimer":
                return (
                    <div className="flex justify-between items-center">
                        <Timer
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                    </div>
                );
            case "IncomingWA":
                return (
                    <div className="flex-between">
                        <IncomingWAConfig
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                    </div>
                );

            case "IncomingRCS":
                return (
                    <>
                        {menu === "ParentMenu" ? (
                            <div className="flex-between">
                                <IncomingRCSConfig
                                    routeBack={backToDefault}
                                    nodeId={selectedNodeId}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 ">
                                <CommonHeader
                                    name={"Incoming RCS"}
                                    nodeId={selectedNodeId}
                                />
                                <SidebarItems />
                            </div>
                        )}
                    </>
                );

            case "WebhookNode":
                return (
                    <div className="flex flex-col gap-2">
                        <CommonHeader
                            name={"Webhook"}
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                        <WebhookConfig />
                    </div>
                );

            // Parent Record Nodes
            case "RecordCreated":
                return (
                    <div className="flex flex-col gap-2">
                        <CommonHeader
                            name={"Record Created"}
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                        <RecordCreatedConfig />
                    </div>
                );

            case "RecordUpdated":
                return (
                    <div className="flex flex-col gap-2">
                        <CommonHeader
                            name={"Record Created"}
                            routeBack={backToDefault}
                            nodeId={selectedNodeId}
                        />
                        <RecordUpdatedConfig />
                    </div>
                );

            case "ManualRecordFlow":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Manual Record Flow"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <ManualRecordFlowConfig />
                    </div>
                );

            // Child Record Nodes

            case "CreateRecord":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Create Record"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <CreateRecord />
                    </div>
                );

            case "UpdateRecord":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Update Record"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <UpdateRecord />
                    </div>
                );

            case "DeleteRecord":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Delete Record"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <DeleteRecord />
                    </div>
                );

            case "CreateTask":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Create Task"
                            nodeId={selectedNodeId}
                            backToParent={backToParent}
                        />
                        <CreateTask />
                    </div>
                );

            case "CompleteTask":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Complete Task"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <CompleteTask />
                    </div>
                );

            case "AdjustTime":
                return (
                    <div className="flex gap-2 flex-col">
                        {/* <CommonHeader
                            name="Adjust Time"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <AdjustTime /> */}
                        <Timer />
                    </div>
                );

            case "Formula":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Formula"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <Formula />
                    </div>
                );

            case "RandomNumber":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Random Number"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <RandomNumber />
                    </div>
                );

            case "IfElse":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="If Else"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <IfElseSwitch />
                    </div>
                );

            case "Switch":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Switch"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <IfElseSwitch />
                    </div>
                );

            case "Delay":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Delay"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <DelayWrapper />
                    </div>
                );

            case "SendHTTPRequest":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Send HTTP Request"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <SendHTTPRequest />
                    </div>
                );

            case "GoBackToNode":
                return (
                    <div className="flex gap-2 flex-col">
                        <CommonHeader
                            name="Go Back To Node"
                            nodeId={selectedNodeId}
                            routeBack={backToDefault}
                        />
                        <GoBackToNode />
                    </div>
                );

            default:
                return (
                    <div className="flex gap-2 flex-col ">
                        <Heading />
                        <Divider />
                        <SidebarItems />
                    </div>
                );
        }
    };

    return (
        <div
            className={`bg-background rounded-large py-6 mt-2 px-6 absolute right-0 transition-all duration-300 dark:bg-background dark:text-foreground ${
                sidebarToggle
                    ? "w-[354px] top-10 border border-default h-[100vh]"
                    : "w-0 bg-transparent top-[400px]"
            }`}
        >
            {/* Toggler */}
            <Toggler
                sidebarToggle={sidebarToggle}
                handleSidebarToggle={handleSidebarToggle}
            />

            {/* Sidebar Content */}
            {sidebarToggle ? (
                <ScrollShadow
                    className="h-[calc(100vh-200px)]"
                    hideScrollBar={true}
                >
                    {selectedNode ? (
                        renderSelectedNode()
                    ) : (
                        <div>
                            <Heading />
                            {/* <Divider /> */}
                            <SidebarItems />
                        </div>
                    )}
                </ScrollShadow>
            ) : null}
        </div>
    );
}

// Heading Component
const Heading = () => {
    return (
        <div className="flex items-center gap-2">
            <Icon
                icon="fa6-solid:route"
                width={"1.3em"}
                className="text-primary-600"
            />
            <p className="font-semibold text-md text-default-600">
                TeleFlow Builder
            </p>
        </div>
    );
};

// Toggler
const Toggler = ({ sidebarToggle, handleSidebarToggle }) => {
    return (
        <Tooltip content="Toggle FlowDrawer" placement="left-start" delay={600}>
            <Icon
                icon={sidebarToggle ? "prime:angle-right" : "prime:angle-left"}
                width="2em"
                height="2em"
                className={`border-success border-2 text-success rounded-full absolute top-1/2 transform -translate-y-1/2 bg-white dark:bg-background cursor-pointer ${
                    sidebarToggle ? "-left-4" : ""
                }`}
                onClick={handleSidebarToggle}
            />
        </Tooltip>
    );
};
