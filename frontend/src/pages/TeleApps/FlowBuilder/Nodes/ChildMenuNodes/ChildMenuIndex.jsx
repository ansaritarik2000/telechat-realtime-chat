import { Card, CardHeader, Divider, CardBody } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { Handle, Position } from "@xyflow/react";

// Common Component
const Record = function ({ label, icon, color }) {
    return (
        <Card className="w-64">
            <CardHeader
                className={`flex-start gap-2 bg-gradient-to-r from-${color}-50 to-content`}
            >
                <Icon
                    icon={icon}
                    width="1.2em"
                    height="1.2em"
                    className={`text-${color}`}
                />
                <p className="font-medium text-sm text-foreground">{label}</p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="h-3"></div>
            </CardBody>
        </Card>
    );
};

// Records
// Create Record
export const CreateRecord = function () {
    return (
        <Record
            label="Create Record"
            icon="tabler:folder-plus"
            color="primary"
        />
    );
};

// Update Record
export const UpdateRecord = function () {
    return (
        <Record
            label="Update Record"
            icon="quill:folder-todo"
            color="primary"
        />
    );
};

// Delete Record
export const DeleteRecord = function () {
    return (
        <Record
            label="Delete Record"
            icon="iconamoon:trash-light"
            color="primary"
        />
    );
};

// Tasks
// Create Task
export const CreateTask = function () {
    return (
        <Record
            label="Create Task"
            icon="hugeicons:task-01"
            color="secondary"
        />
    );
};

// Complete Task
export const CompleteTask = function () {
    return (
        <Record
            label="Complete Task"
            icon="tdesign:task-checked"
            color="secondary"
        />
    );
};

// Calculations
// Adjust Time
export const AdjustTime = function () {
    return (
        <Record label="Adjust Time" icon="tabler:clock-check" color="warning" />
    );
};

// Formula
export const Formula = function () {
    return (
        <Record
            label="Formula"
            icon="solar:calculator-broken"
            color="warning"
        />
    );
};

// Random Number
export const RandomNumber = function () {
    return (
        <Record label="Random Number" icon="eva:hash-fill" color="warning" />
    );
};

// Conditions
// If/Else
export const IfElse = function () {
    return (
        <ConditionalComponent
            label="If/Else"
            icon="carbon:flow"
            color="danger"
        />
    );
};

// Switch
export const Switch = function () {
    return <Record label="Switch" icon="typcn:flow-switch" color="danger" />;
};

// Delays
// Delay
export const Delay = function () {
    return (
        <Record
            label="Delay / Delay Until"
            icon="mdi:clock-arrow"
            color="danger"
        />
    );
};

// Delay Until
export const DelayUntil = function () {
    return <Record label="Delay Until" icon="mdi:clock-arrow" />;
};

// Utilities
// Send HTTP Request
export const SendHTTPRequest = function () {
    return <Record label="Send HTTP Request" icon="ci:code" color="success" />;
};

// Go Back To Node
export const GoBackToNode = function () {
    return (
        <Record
            label="Go Back To Node"
            icon="lets-icons:refund-back"
            color="success"
        />
    );
};

// Common Component
const ConditionalComponent = function ({ label, icon }) {
    return (
        <div
            className="flex flex-col items-start gap-2  w-52 h-16"
            data-node-type="conditional"
        >
            <div className="flex gap-1 justify-center items-center">
                <Icon
                    icon={icon}
                    width="1.2em"
                    height="1.2em"
                    className="text-danger"
                />
                <p className="font-medium text-sm text-foreground">{label}</p>
            </div>
            <Divider className="mb-4" />
        </div>
    );
};
