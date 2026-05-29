import { MarkerType } from "@xyflow/react";

const commonStyles = {
  // animated: true,
  type: "custom-edge",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 18,
    height: 18,
    color: "#1ac964",
    zIndex: 999,
  },
  style: {
    strokeWidth: 1,
    // stroke: "#1ac964",
    // stroke: "#FF0072",
    // stroke: "#026fee",
  },
};

export default [
  {
    id: "1-2",
    source: "1",
    target: "2",
    animated: true,
    type: "custom-edge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18,
      height: 18,
      color: "#1ac964",
      zIndex: 999,
    },
  },
];
