import {
    BaseEdge,
    EdgeLabelRenderer,
    useReactFlow,
    Position,
    getSmoothStepPath,
} from "@xyflow/react";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { Chip } from "@heroui/react";

export default function AnimatedSVGEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = Position.Right,
    targetPosition = Position.Left,
    data,
}) {
    const { setEdges } = useReactFlow();
    const [hovered, setHovered] = useState(false);
    const label = data?.label || ""; // Get the label from edge data

    // Calculate path, label position, and offset using getSmoothStepPath
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 10,
    });

    const deleteEdgeHandler = () => {
        setEdges((eds) => eds.filter((edge) => edge.id !== id));
    };

    return (
        <>
            {/* Marker Definition */}
            <svg style={{ position: "absolute", top: 0, left: 0 }}>
                <defs>
                    <marker
                        id={`${id}-arrow`}
                        markerWidth="12"
                        markerHeight="6"
                        refX="6"
                        refY="3"
                        orient="auto"
                    >
                        <path d="M0,0 L6,3 L0,6 Z" fill="#74dfa2" />
                    </marker>
                </defs>
            </svg>

            {/* Wrapper for handling hover state */}
            <g
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Base Edge with animated dashed line */}
                <BaseEdge
                    id={id}
                    path={edgePath}
                    style={{
                        strokeWidth: 3,
                        stroke: "#74dfa2",
                        strokeDasharray: "5",
                        animation: "dash-animation 1s linear infinite",
                    }}
                    markerEnd={`url(#${id}-arrow)`}
                />

                {/* Label with delete button */}
                <EdgeLabelRenderer>
                    <button
                        style={{
                            position: "absolute",
                            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                            pointerEvents: "all",
                            zIndex: 1000,
                            display: hovered ? "block" : "none",
                        }}
                        className="nodrag nopan"
                        onClick={deleteEdgeHandler}
                    >
                        <Icon
                            icon="emojione:cross-mark-button"
                            width="1.5em"
                            height="1.5em"
                        />
                    </button>

                    {label && (
                        <div
                            style={{
                                position: "absolute",
                                transform: `translate(-50%, -50%) translate(${labelX}px, ${
                                    labelY - 15
                                }px)`,
                                zIndex: 40,
                                pointerEvents: "none",
                            }}
                        >
                            <Chip
                                size="sm"
                                color="warning"
                                variant="flat"
                                className="z-40"
                            >
                                {label}
                            </Chip>
                        </div>
                    )}
                </EdgeLabelRenderer>
            </g>

            {/* CSS for animating dashed line */}
            <style>
                {`
          @keyframes dash-animation {
            to {
              stroke-dashoffset: -20;
            }
          }
        `}
            </style>
        </>
    );
}
