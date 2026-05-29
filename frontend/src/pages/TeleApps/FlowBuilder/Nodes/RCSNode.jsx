import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import {
    Select,
    SelectItem,
    Card,
    CardHeader,
    CardBody,
    Divider,
    CardFooter,
} from "@heroui/react";
import { useNodeId, useReactFlow } from "@xyflow/react";
import { useRcsFlowStore } from "../../../../store/automationFlowStore/rcsFlowStore";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ColoredRCSIcon } from "../../../../utils/ReusableIcons";

export default function RCSNode() {
    const {
        selectedBot,
        selectedTemplateType,
        selectedTemplate,
        setSelectedTemplateType,
        setSelectedTemplate,
        setSelectedBot,
    } = useRcsFlowStore();
    const [selected, setSelected] = useState([]);
    const { setNodes, getNode } = useReactFlow();
    const nodeId = useNodeId();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const id = searchParams.get("id"); // This will get the value of 'id' from the query params

    // Update the node data when select changes
    useEffect(() => {
        // Fetch the node using getNode
        const node = getNode(nodeId);
        if (node && id) {
            setSelected(node?.data?.selectedAction);
            // setSelectedTemplateType(node.data.selectedTemplateType);
            // setSelectedBot(node.data.selectedBot);
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
                            selectedBot,
                            selectedTemplate,
                            selectedTemplateType,
                        },
                    };
                }
                return node;
            })
        );
    }, [
        selected,
        nodeId,
        selectedBot,
        selectedTemplate,
        selectedTemplateType,
        id,
    ]);

    return (
        <>
            <Card className="w-[16rem]">
                {/* Icon & Title  */}
                <CardHeader className="flex gap-2 items-center bg-gradient-to-r from-primary-50 to-content">
                    <ColoredRCSIcon size="1.4em" />
                    <p className="font-medium text-md text-foreground">
                        {t("RCS")}
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
