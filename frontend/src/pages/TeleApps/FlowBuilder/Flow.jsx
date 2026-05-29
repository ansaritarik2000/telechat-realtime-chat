import { useState, useCallback, useMemo, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { useThemeStore } from "../../../store/themeStore";
import { FlowProvider } from "./FlowContext";
import {
    Controls,
    Background,
    addEdge,
    BackgroundVariant,
    MiniMap,
    ReactFlowProvider,
    Panel,
    useNodesState,
    useEdgesState,
    ReactFlow,
} from "@xyflow/react";

import AnimatedSVGEdge from "./CustomEdges/AnimatedSVGEdge";
import CustomNode from "./CustomNodes/CustomNode";
import ConditionalNode from "./CustomNodes/Conditional";
import TargetAudNode from "./CustomNodes/TargetAudNode";
import Buttons, { DownloadFlowButton } from "./Buttons";
import FlowSidebar from "./Sidebar/Sidebar";

import initialEdges from "./Edges";
import initialNodes, { availableNodes } from "./Nodes";
import { generateUniqueId } from "./utils/generateRandomId";
import {
    getFlowByIdService,
    saveFlowService,
    updateFlowService,
} from "../../../services/flow/flowServices";
import { useFlowStore } from "../../../store/automationFlowStore/flowStore";
import { useSearchParams } from "react-router-dom";
import { updateNodeLabels } from "./utils/updateNodeLabels";

const styles = {
    background: "#e0e8ec",
    width: "100%",
};

const nodeTypes = {
    custom: CustomNode,
    targetAudience: TargetAudNode,
    conditional: ConditionalNode,
};

const edgeTypes = {
    "custom-edge": AnimatedSVGEdge,
};

const nodeTypeMapping = {
    17: "conditional",
};

export default function Flow() {
    const [colorMode, setColorMode] = useState("light");

    const [rfInstance, setRfInstance] = useState(null);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id"); // This will get the value of 'id' from the query params

    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const { flowName, setFlowName, setSaveFlowModalVisible } = useFlowStore();
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

    // Menu display state
    const [menu, setMenu] = useState("ParentMenu");

    // Handle node selection
    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node.data.label.type.name);
        setSelectedNodeId(node.id);
    }, []);

    const onConnect = useCallback(
        (connection) => {
            const edge = { ...connection, type: "custom-edge" };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    // Sync with themeStore
    const theme = useThemeStore((state) => state.theme);

    // this useeffect functiton set color according to theme
    useEffect(() => {
        setColorMode(theme);
    }, [theme]);

    // this useEffect function is used for fetch flow data
    useEffect(() => {
        const fetchFlowData = async () => {
            if (id) {
                try {
                    const response = await getFlowByIdService(id);
                    if (response.status === "SUCCESS") {
                        const flowData = response.data;
                        setFlowName(flowData?.name);
                        const updatedFlowData = updateNodeLabels([flowData]);

                        console.log("updatedFlowData", updatedFlowData);

                        setNodes(
                            (updatedFlowData &&
                                updatedFlowData.length > 0 &&
                                updatedFlowData[0].flow_data.nodes) ||
                                []
                        );
                        setEdges(
                            (updatedFlowData &&
                                updatedFlowData.length > 0 &&
                                updatedFlowData[0].flow_data.edges) ||
                                []
                        );
                    } else {
                        console.error(
                            "Error retrieving flow data:",
                            response.message
                        );
                    }
                } catch (error) {
                    console.error("Failed to fetch flow data:", error);
                }
            }
        };

        fetchFlowData();
    }, [id, setNodes, setEdges]);

    // Handle node save in draft
    const saveDraft = useCallback(async () => {
        if (rfInstance) {
            try {
                const flow = rfInstance.toObject();
                const flowData = {
                    name: flowName,
                    flow_data: flow,
                    is_draft: true,
                };

                const response = await saveFlowService(flowData);
                if (response.status === "SUCCESS") {
                    window.alert(`${flowName} saved successfully as Draft!`);
                } else {
                    window.alert("Failed to save as Draft!");
                }
            } catch (error) {
                console.error("Error saving flow as draft:", error);
            }
        } else {
            console.error("React Flow instance is not initialized.");
        }
    }, [rfInstance]);

    // this function is used for save and update flow in database

    const saveFlow = useCallback(async () => {
        try {
            if (rfInstance) {
                const flow = rfInstance.toObject();

                const flowData = {
                    name: flowName,
                    flow_data: flow,
                };

                if (id) {
                    // If `id` exists, call updateFlowService
                    const response = await updateFlowService(id, flowData);
                    if (response.status === "SUCCESS") {
                        window.alert(`${flowName} updated successfully!`);
                        setSaveFlowModalVisible(false);
                    } else {
                        window.alert("Failed to update flow!");
                    }
                } else {
                    // If `id` doesn't exist, call saveFlowService
                    const response = await saveFlowService(flowData);
                    if (response.status === "SUCCESS") {
                        window.alert(`${flowName} saved successfully!`);
                        setSaveFlowModalVisible(false);
                    } else {
                        window.alert("Failed to save flow!");
                    }
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }, [rfInstance]);

    const copyNodeHandler = useCallback(
        (nodeId, title, logo) => {
            setNodes((nds) => {
                // Check if the node already exists
                const existingNode = nds.find((node) => node.id === nodeId);

                if (existingNode) {
                    // If the node exists, copy the node
                    const copyNodeRecursively = (nodeId, offsetX, offsetY) => {
                        const nodeToCopy = nds.find(
                            (node) => node.id === nodeId
                        );
                        if (!nodeToCopy) return [];

                        const newNodeId = generateUniqueId();

                        const newNode = {
                            ...nodeToCopy,
                            id: newNodeId,
                            nodeTypeId: nodeId,
                            data: {
                                ...nodeToCopy.data,
                                label: (
                                    <nodeToCopy.data.label.type
                                        logo={logo}
                                        title={title}
                                    />
                                ),
                            },
                            position: {
                                x:
                                    nodeToCopy.position.x +
                                    offsetX +
                                    parseInt(nodeId),
                                y:
                                    nodeToCopy.position.y +
                                    offsetY +
                                    parseInt(nodeId),
                            },
                            parentId: null,
                        };

                        return [newNode];
                    };

                    const numberOfCopies = nds.filter((node) =>
                        node.id.startsWith(`copy-${nodeId}`)
                    ).length;

                    const offset = 10;
                    const offsetX = (numberOfCopies + 1) * offset;
                    const offsetY = (numberOfCopies + 1) * offset;

                    const newNodes = copyNodeRecursively(
                        nodeId,
                        offsetX,
                        offsetY
                    );
                    return [...nds, ...newNodes];
                } else {
                    // this is find node
                    const findCustomNode = availableNodes.find(
                        (item) => item.id === nodeId
                    );

                    // generate random number between 1 to 50
                    const getRandomInt = () => {
                        return Math.floor(Math.random() * 50) + 1;
                    };

                    const nodeType = nodeTypeMapping[nodeId] || "custom";

                    // If the node doesn't exist, create a new node
                    const newNodeId = generateUniqueId();
                    const newNode = {
                        id: newNodeId,
                        nodeTypeId: nodeId,
                        type: nodeType,
                        position: {
                            x: 200 + getRandomInt(),
                            y: 200 + getRandomInt(),
                        },
                        data: {
                            label: findCustomNode?.data?.label,
                        },
                    };

                    return [...nds, newNode];
                }
            });
        },
        [setNodes]
    );

    // Create context value object
    const flowContextValue = {
        copyNode: copyNodeHandler,
        selectedNode,
        setSelectedNode,
        selectedNodeId,
        menu,
        setMenu,
    };

    return (
        <div className="h-[90vh] w-[100%] mx-auto">
            <FlowProvider value={flowContextValue}>
                <ReactFlowProvider>
                    <ReactFlow
                        // style={styles}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        edgeTypes={edgeTypes}
                        nodeTypes={nodeTypes}
                        colorMode={colorMode}
                        onNodeClick={onNodeClick}
                        onInit={setRfInstance}
                        preventScrolling
                        fitView={false}
                        snapToGrid={true}
                        className="download-image"
                        fitViewOptions={
                            {
                                // padding: 0.1,
                            }
                        }
                    >
                        <Panel position="top-right">
                            <Buttons
                                saveDraft={saveDraft}
                                saveFlow={saveFlow}
                            />
                        </Panel>
                        <Panel position="top-right">
                            <FlowSidebar
                                // copyNode={copyNodeHandler}
                                selectedNode={selectedNode}
                                setSelectedNode={setSelectedNode}
                                selectedNodeId={selectedNodeId}
                                menu={menu}
                                setMenu={setMenu}
                            />
                        </Panel>
                        <Background
                            id="2"
                            gap={30}
                            variant={BackgroundVariant.Dots}
                        />
                        <Controls />
                        {/* <MiniMap nodeStrokeWidth={3} /> */}

                        <DownloadFlowButton />
                    </ReactFlow>
                </ReactFlowProvider>
            </FlowProvider>
        </div>
    );
}
