import React, { useCallback } from "react";
import { useThemeStore } from "../../../../store/themeStore";
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

const commonStyle = {
    width: 12,
    height: 12,
    // background: "#353839",
    zIndex: 40,
};

const CustomNode = ({ id, data }) => {
    const { setNodes, getNodes } = useReactFlow();
    const { theme, setTheme } = useThemeStore();
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
                        type: "custom",
                        data: {
                            label: nodeToCopy.data.label,
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
        // if (typeof copyNode === "function") {
        //     copyNodeHandler(nodeId, title, logo);
        // } else {
        //     console.error("copyNode is not a function");
        // }
        copyNodeHandler(nodeId, title, logo);
    };

    return (
        <div className="overflow-visible z-40">
            <NodeToolbar position={Position.Top} align="start">
                <div className="-mb-1 bg-default-50 rounded-md px-2 ">
                    <span className="text-[0.7em] text-default-400">
                        ID: {nodeId}
                    </span>
                </div>
            </NodeToolbar>
            {/* NodeToolbar with copy and delete  button */}
            <NodeToolbar position={Position.Top} align="end">
                <div className="mr-2 -mb-3 flex gap-2">
                    {/* Copy Icon within button */}
                    <button
                        style={{
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            handleCopyClick(id, data.label, data.logo)
                        }
                    >
                        <CopyCodeIcon size="1.2em" />
                    </button>

                    {/* Delete Icon within button */}
                    <button
                        style={{
                            cursor: "pointer",
                        }}
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

            <div>{data.label}</div>

            <Handle
                type="target"
                position={Position.Top}
                style={{
                    ...commonStyle,
                    background: theme === "dark" ? "#F5F5F5" : "#adb5bd",
                }}
            />
            <Handle
                id="right-source"
                type="source"
                position={Position.Bottom}
                style={{
                    ...commonStyle,
                    background: theme === "dark" ? "#F5F5F5" : "#adb5bd",
                }}
            />
        </div>
    );
};

export default CustomNode;
