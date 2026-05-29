import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import {
    Select,
    SelectItem,
    Card,
    CardBody,
    CardHeader,
    Divider,
} from "@heroui/react";
import { useNodeId, useReactFlow } from "@xyflow/react";
import { useSmsFlowStore } from "../../../../store/automationFlowStore/smsFlowStore";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ColoredSMSIcon } from "../../../../utils/ReusableIcons";

export default function SMSNode() {
    const [selected, setSelected] = useState([]);
    const {
        selectedTemplate,
        selectedTemplateType,
        sendAsFlashSMS,
        setSelectedTemplateType,
        setSendAsFlashSMS,
        setSelectedTemplate,
    } = useSmsFlowStore();
    const { setNodes, getNode } = useReactFlow();
    const { t } = useTranslation();
    const nodeId = useNodeId();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id"); // This will get the value of 'id' from the query params

    console.log("SMSNode -> selected", selected);
    // Update the node data when select changes
    useEffect(() => {
        // Fetch the node using getNode
        const node = getNode(nodeId);
        if (node && id) {
            setSelected(node?.data?.selectedAction);
            // setSelectedTemplateType(node?.data?.selectedTemplateType);
            // setSendAsFlashSMS(node?.data?.sendAsFlashSMS);
            // setSelectedTemplate(node?.data?.selectedTemplate);
        }
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    // Update only the data field you need
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            selectedAction: selected && [...selected],
                            selectedTemplate,
                            selectedTemplateType,
                            sendAsFlashSMS: sendAsFlashSMS,
                        },
                    };
                }
                return node;
            })
        );
    }, [
        selected,
        nodeId,
        selectedTemplate,
        selectedTemplateType,
        sendAsFlashSMS,
    ]);

    return (
        <>
            <Card className=" w-[16rem]">
                {/* Icon & Title  */}
                <CardHeader className="flex gap-1 items-center bg-gradient-to-r from-warning-50 to-content">
                    <ColoredSMSIcon size="1.3em" />
                    <p className="font-medium text-md text-foreground">
                        {t("SMS")}
                    </p>
                </CardHeader>
                <Divider />
                <CardBody>
                    {/* Select Items */}
                    <Select
                        aria-label="Select Channel"
                        placeholder={t("Trigger Action")}
                        onSelectionChange={setSelected}
                        value={selected}
                        selectedKeys={selected}
                        className="w-full"
                        variant="flat"
                        radius="sm"
                        size="sm"
                    >
                        <SelectItem key="sent">{t("Sent")}</SelectItem>
                        <SelectItem key="delivered">
                            {t("Delivered")}
                        </SelectItem>
                        <SelectItem key="failed">{t("Failed")}</SelectItem>
                        <SelectItem key="not delivered until">
                            {t("Not Delivered Until")}
                        </SelectItem>
                    </Select>
                </CardBody>
            </Card>
        </>
    );
}
