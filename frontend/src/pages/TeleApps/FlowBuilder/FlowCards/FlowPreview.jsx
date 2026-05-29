import React, { useEffect, useState, useMemo } from "react";
import CustomNode from "../CustomNodes/CustomNode";
import TargetAudNode from "../CustomNodes/TargetAudNode";
import Conditional from "../CustomNodes/Conditional";
import AnimatedSVGEdge from "../CustomEdges/AnimatedSVGEdge";
import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { useThemeStore } from "../../../../store/themeStore";

const styles = {
  //   background: "#e0e8ec",
  paddingLeft: "10px",
  paddingRight: "10px",
  paddingTop: "10px",
};

const proOptions = { hideAttribution: true };

const nodeTypes = {
  custom: CustomNode,
  targetAudience: TargetAudNode,
  conditional: Conditional,
};

const edgeTypes = {
  "custom-edge": AnimatedSVGEdge,
};

const FlowPreview = ({ flowData }) => {
  const [colorMode, setColorMode] = useState("light");

  const [edges] = useEdgesState(flowData?.edges);
  const [nodes] = useNodesState(flowData?.nodes);

  // Sync with themeStore
  const theme = useThemeStore((state) => state.theme);
  const [viewport, setViewport] = useState({ x: -130, y: 0, zoom: 0.5 });

  useEffect(() => {
    setColorMode(theme);
  }, [theme]);

  return (
    <ReactFlow
      // style={styles}
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      colorMode={colorMode}
      proOptions={proOptions}
      fitView={false}
      viewport={viewport}
      nodesDraggable={false} // Disable node dragging
      elementsSelectable={false} // Disable element selection
      panOnDrag={false} // Disable panning
      zoomOnScroll={false} // Disable zooming on scroll
      zoomOnPinch={false} // Disable zooming on pinch
      className="h-full w-full opacity-50"
      snapToGrid={true}
      fitViewOptions={{
        padding: 0.1,
      }}
    />
  );
};

export default FlowPreview;
