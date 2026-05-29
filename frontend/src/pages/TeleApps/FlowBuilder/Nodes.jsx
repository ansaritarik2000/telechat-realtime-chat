import { Position } from "@xyflow/react";

import TargetAudience from "./Nodes/TargetAudience";
import WhatsAppNode from "./Nodes/WhatsAppNode";
import SMSNode from "./Nodes/SMSNode";
import RCSNode from "./Nodes/RCSNode";
import EmailNode from "./Nodes/EmailNode";
import WaitTimer from "./Nodes/WaitTimer";
import IncomingWA from "./Nodes/IncomingWA";
import IncomingRCS from "./Nodes/IncomingRCS";
import WebhookNode from "./Nodes/Webhook";
import RecordCreated from "./Nodes/Records/RecordCreated";
import RecordUpdated from "./Nodes/Records/RecordUpdated";
import ManualRecordFlow from "./Nodes/Records/ManualRecordFlow";

import {
  // Records
  CreateRecord,
  UpdateRecord,
  DeleteRecord,

  // Tasks
  CreateTask,
  CompleteTask,

  // Calculations
  AdjustTime,
  Formula,
  RandomNumber,

  // Conditions
  IfElse,
  Switch,

  // Delays
  Delay,
  // DelayUntil,

  // Utilities
  SendHTTPRequest,
  GoBackToNode,
} from "./Nodes/ChildMenuNodes/ChildMenuIndex";

const nodeDefaults = {
  sourcePosition: Position.Top,
  targetPosition: Position.Bottom,
};

const commonStyles = {
  borderRadius: "20px",
  borderColor: "#1ac964",
  borderWidth: "3px",
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
  backgroundColor: "transparent",
};

const parentStyle = {
  style: {
    width: "190px",
    ...commonStyles,
  },
};

// initial nodes
export default [
  {
    id: "1",
    data: { label: <TargetAudience nodeTypeId={"1"} /> },
    position: { x: 500, y: 10 },
    type: "targetAudience",
  },
];

// available nodes
export const availableNodes = [
  {
    id: "1",
    data: { label: <TargetAudience nodeTypeId={"1"} /> },
    position: { x: 400, y: 0 },
    type: "targetAudience",
  },

  {
    id: "2",
    data: { label: <RCSNode nodeTypeId={"2"} /> },
    position: { x: 400, y: 275 },
    type: "custom",
    ...nodeDefaults,
  },

  {
    id: "3",
    data: { label: <WhatsAppNode nodeTypeId={"3"} /> },
    position: { x: 0, y: 400 },
    type: "custom",
    ...nodeDefaults,
  },

  {
    id: "4",
    data: { label: <SMSNode nodeTypeId={"4"} /> },
    position: { x: 400, y: 800 },
    type: "conditional",
    ...nodeDefaults,
  },

  {
    id: "5",
    data: { label: <EmailNode nodeTypeId={"5"} /> },
    position: { x: 800, y: 260 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "6",
    data: { label: <WaitTimer nodeTypeId={"6"} /> },
    position: { x: 440, y: 550 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "7",
    data: { label: <IncomingWA nodeTypeId={"7"} /> },
    position: { x: 440, y: 2000 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "8",
    data: { label: <IncomingRCS nodeTypeId={"8"} /> },
    position: { x: 460, y: 1250 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "20",
    data: { label: <WebhookNode nodeTypeId={"20"} /> },
    position: { x: 550, y: 1450 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "23",
    data: { label: <RecordCreated nodeTypeId={"23"} /> },
    position: { x: 580, y: 1400 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "24",
    data: { label: <RecordUpdated nodeTypeId={"24"} /> },
    position: { x: 600, y: 1000 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "25",
    data: { label: <ManualRecordFlow nodeTypeId={"25"} /> },
    position: { x: 700, y: 1100 },
    type: "custom",
    ...nodeDefaults,
  },

  // Child Menu Nodes (@ used for Incoming RCS )
  {
    id: "9",
    data: { label: <CreateRecord nodeTypeId={"9"} /> },
    position: { x: 440, y: 1500 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "10",
    data: { label: <UpdateRecord nodeTypeId={"10"} /> },
    position: { x: 440, y: 1800 },
    type: "custom",
    ...nodeDefaults,
  },
  {
    id: "11",
    data: { label: <DeleteRecord nodeTypeId={"11"} /> },
    position: { x: 420, y: 2100 },
    type: "custom",
  },
  {
    id: "12",
    data: { label: <CreateTask nodeTypeId={"12"} /> },
    position: { x: 400, y: 2000 },
    type: "custom",
  },
  {
    id: "13",
    data: { label: <CompleteTask nodeTypeId={"13"} /> },
    position: { x: 500, y: 2300 },
    type: "custom",
  },
  {
    id: "14",
    data: { label: <AdjustTime nodeTypeId={"14"} /> },
    position: { x: 400, y: 1700 },
    type: "custom",
  },
  {
    id: "15",
    data: { label: <Formula nodeTypeId={"15"} /> },
    position: { x: 400, y: 2400 },
    type: "custom",
  },
  {
    id: "16",
    data: { label: <RandomNumber nodeTypeId={"16"} /> },
    position: { x: 600, y: 1600 },
    type: "custom",
  },
  {
    id: "17",
    data: { label: <IfElse nodeTypeId={"17"} /> },
    position: { x: 450, y: 2200 },
    type: "conditional",
  },
  {
    id: "18",
    data: { label: <Switch nodeTypeId={"18"} /> },
    position: { x: 450, y: 2500 },
    type: "custom",
  },
  {
    id: "19",
    data: { label: <Delay nodeTypeId={"19"} /> },
    position: { x: 450, y: 2000 },
    type: "custom",
  },
  {
    id: "21",
    data: { label: <SendHTTPRequest nodeTypeId={"21"} /> },
    position: { x: 450, y: 2100 },
    type: "custom",
  },
  {
    id: "22",
    data: { label: <GoBackToNode nodeTypeId={"22"} /> },
    position: { x: 420, y: 1900 },
    type: "custom",
  },
];
