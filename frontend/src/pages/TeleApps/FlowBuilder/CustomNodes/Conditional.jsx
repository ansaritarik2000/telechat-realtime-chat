import React, { useCallback } from "react";
import {
    Handle,
    Position,
    useReactFlow,
    NodeToolbar,
    useNodeId,
} from "@xyflow/react";
import { Icon } from "@iconify-icon/react";
import { generateUniqueId } from ".././utils/generateRandomId";
import { CopyCodeIcon } from "../../../../utils/ReusableIcons";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { useThemeStore } from "../../../../store/themeStore";

const commonStyle = {
    width: 12,
    height: 12,
};

const ConditionalNode = ({ id, data }) => {
    const { setNodes, getNodes } = useReactFlow();
    const { theme } = useThemeStore();
    const nodeId = useNodeId();

    const copyNodeHandler = useCallback(
        (nodeId, title, logo) => {
            setNodes((nds) => {
                //  function to copy nodes recursively
                const copyNodeRecursively = (nodeId, offsetX, offsetY) => {
                    // Find the node to copy
                    const nodeToCopy = nds.find((node) => node.id === nodeId);
                    if (!nodeToCopy) return [];

                    // Generate a unique ID for the copied node
                    const newNodeId = generateUniqueId();
                    // generate random number between 1 to 50
                    const getRandomInt = () => {
                        return Math.floor(Math.random() * 50) + 1;
                    };
                    const newNode = {
                        id: newNodeId,
                        type: "conditional",
                        data: {
                            label: nodeToCopy.data.label,
                            condition: nodeToCopy.data.condition,
                        },
                        position: {
                            x: 200 + getRandomInt(),
                            y: 200 + getRandomInt(),
                        },
                    };

                    return [newNode];
                };

                // Get the number of existing copies to calculate offset
                const numberOfCopies = nds.filter((node) =>
                    node.id.startsWith(`copy-${nodeId}`)
                ).length;

                const offset = 10; // Base offset value
                const offsetX = (numberOfCopies + 1) * offset;
                const offsetY = (numberOfCopies + 1) * offset;

                const newNodes = copyNodeRecursively(nodeId, offsetX, offsetY);

                return [...nds, ...newNodes];
            });
        },
        [setNodes]
    );

    // Recursive function to get all children nodes
    const getAllChildren = (nodeId, nodes) => {
        const children = nodes.filter((node) => node.parentId === nodeId);
        let allChildren = [...children];
        children.forEach((child) => {
            allChildren = [...allChildren, ...getAllChildren(child.id, nodes)];
        });
        return allChildren;
    };

    // Handler for deleting the node and its children
    const deleteNodeHandler = () => {
        setNodes((nds) => {
            // Get all nodes and find the ones to delete
            const allNodes = getNodes();
            const nodesToDelete = getAllChildren(id, allNodes);
            nodesToDelete.push(allNodes.find((node) => node.id === id)); // Include the node itself

            // Filter out nodes to delete
            return nds.filter(
                (node) =>
                    !nodesToDelete.some((delNode) => delNode.id === node.id)
            );
        });
    };

    const handleCopyClick = (nodeId, title, logo) => {
        copyNodeHandler(nodeId, title, logo);
    };

    return (
        <Card className=" relative overflow-visible">
            <CardHeader className="p-0">
                {/* NodeToolbar showing NodeId */}
                <NodeToolbar position={Position.Top} align="start">
                    <div className="-mb-1 bg-default-50 rounded-md px-2">
                        <span className="text-[0.7em] text-default-400">
                            ID: {nodeId}
                        </span>
                    </div>
                </NodeToolbar>

                {/* NodeToolbar with copy and delete button */}
                <NodeToolbar position={Position.Top} align="end">
                    <div className="mr-2 -mb-3 flex gap-2">
                        {/* Copy Icon within button */}
                        <button
                            className="cursor-pointer"
                            onClick={() =>
                                handleCopyClick(id, data.label, data.logo)
                            }
                        >
                            <CopyCodeIcon size="1.2em" />
                        </button>

                        {/* Delete Icon within button */}
                        <button
                            className="cursor-pointer"
                            onClick={deleteNodeHandler}
                        >
                            <Icon
                                icon="emojione:cross-mark-button"
                                width="1em"
                                height="1em"
                            />
                        </button>
                    </div>
                </NodeToolbar>
            </CardHeader>

            <CardBody className="flex flex-col items-center pb-4">
                <div className="font-bold mb-1">
                    {data.label || "Condition"}
                </div>

                {/* Display condition expression if provided */}
                {data.condition && (
                    <div className="text-sm text-gray-600 italic">
                        {data.condition}
                    </div>
                )}
            </CardBody>

            {/* Input handle at the top */}
            <Handle
                type="target"
                position={Position.Top}
                style={{
                    ...commonStyle,
                    background: theme === "dark" ? "#F5F5F5" : "#adb5bd",
                }}
            />

            {/* True output handle - positioned bottom-left */}
            <Handle
                id="true"
                type="source"
                position={Position.Bottom}
                style={{
                    ...commonStyle,
                    left: "25%",
                    background: theme === "dark" ? "#F5F5F5" : "#adb5bd",
                }}
            />
            <div className="absolute text-xs bg-success-200 rounded-md py-1 px-2 left-10 bottom-2">
                True
            </div>

            {/* False output handle - positioned bottom-right */}
            <Handle
                id="false"
                type="source"
                position={Position.Bottom}
                style={{
                    ...commonStyle,
                    left: "75%",
                    background: theme === "dark" ? "#F5F5F5" : "#adb5bd",
                }}
            />
            <div className="absolute text-xs bg-warning-200 rounded-md py-1 px-2  right-10 bottom-2">
                False
            </div>
        </Card>
    );
};

export default ConditionalNode;
