import { availableNodes } from "../Nodes";

// update flow nodes labels
export const updateNodeLabels = (flowData) => {
    return flowData.map((flow) => {
        const updatedNodes = flow.flow_data.nodes.map((node) => {
            // Find the corresponding availableNode with matching nodeTypeId
            const matchedNode = availableNodes.find(
                (availableNode) =>
                    availableNode.id === node.data.label.props.nodeTypeId
            );

            // If a match is found, update the node's label
            if (matchedNode) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: matchedNode.data.label,
                    },
                };
            }
            // If no match is found, return the node as is
            return node;
        });

        // Return the flow with updated nodes
        return {
            ...flow,
            flow_data: {
                ...flow.flow_data,
                nodes: updatedNodes,
            },
        };
    });
};
