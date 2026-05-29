import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import {
    Select,
    SelectItem,
    Card,
    CardHeader,
    CardBody,
    Divider,
} from "@heroui/react";
import { useNodeId, useReactFlow } from "@xyflow/react";
import { useTranslation } from "react-i18next";

export default function EmailNode() {
    const [selected, setSelected] = useState([]);
    const { setNodes, getNode } = useReactFlow();
    const { t } = useTranslation();
    const nodeId = useNodeId();

    // Update the node data when select changes
    useEffect(() => {
        // Fetch the node using getNode
        const node = getNode(nodeId);
        if (node) {
            setSelected(node?.data?.selectedAction);
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
                        },
                    };
                }
                return node;
            })
        );
    }, [selected, nodeId]);

    return (
        <>
            <Card className="w-[16rem]">
                {/* Icon & Title  */}
                <CardHeader className="flex gap-2 items-center bg-gradient-to-r from-secondary-50 to-content">
                    <Icon icon="skill-icons:gmail-light" width={"1.4em"} />
                    <p className="font-medium text-md text-foreground">
                        {t("Email")}
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
                        className="w-full"
                        variant="flat"
                        selectedKeys={selected}
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
