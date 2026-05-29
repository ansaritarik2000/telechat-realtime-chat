import React from "react";
import { Icon } from "@iconify-icon/react";
import { Card, CardHeader, CardBody, Divider, Chip } from "@heroui/react";

export default function HealthCard(props) {
  const {
    email = "sudhanshu123@gmail.com",
    status = "Connected",
    reputation = "High",
    messageLimit = "5000",
    country = "India",
  } = props;

  // Determine Chip color based on status
  const statusColor = status === "Disconnected" ? "danger" : "success";
  const statusIcon =
    status === "Disconnected"
      ? "carbon:connection-signal-off"
      : "carbon:connection-signal";

  // Determine Chip color based on reputation
  let reputationColor;

  if (reputation === "Medium") {
    reputationColor = "warning";
  } else if (reputation === "Low") {
    reputationColor = "danger";
  } else {
    reputationColor = "success";
  }

  return (
    <div className="w-full  p-2">
      <Card
        isBlurred
        className="border border-content2"
        radius="sm"
        shadow="sm"
      >
        {/* Card Header */}
        <CardHeader className="flex gap-3 p-6 justify-between items-center  ">
          <div className="flex flex-col">
            <p className="text-xl font-medium">Email Quality </p>
            <p className="text-sm text-primary">{email}</p>
          </div>
          {/* Icon */}
          <div className="flex gap-2 items-center">
            <Icon
              icon="mage:health-square"
              width={50}
              className="text-primary"
            />
          </div>
        </CardHeader>

        <Divider orientation="horizontal" />

        {/* Card Body */}
        <CardBody className="w-full">
          <div className="flex flex-col gap-4 p-2 w-full  ">
            {/* Status */}
            <div className="flex items-center space-x-4   max-w-full  ">
              <p className="text-sm font-semibold text-default-500">Status</p>
              <div className="flex-1">
                <Divider className=" mx-2" />
              </div>
              <Chip size="sm" variant="dot" color={statusColor}>
                <span>{status}</span>
              </Chip>
            </div>

            {/* Reputation */}
            <div className="flex items-center space-x-4   max-w-full">
              <p className="text-sm font-semibold text-default-500">
                Reputation
              </p>
              <div className="flex-1">
                <Divider className=" mx-2" />
              </div>
              <Chip size="sm" variant="flat" color={reputationColor}>
                <span>{reputation}</span>
              </Chip>
            </div>

            {/* Country */}
            <div className="flex items-center space-x-4   max-w-full">
              <p className="text-sm font-semibold text-default-500">Country</p>
              <div className="flex-1">
                <Divider className=" mx-2" />
              </div>
              <span className="text-sm">🇮🇳 {country}</span>
            </div>

            {/* Message Limit */}
            <div className="flex items-center space-x-4   max-w-full">
              <p className="text-sm font-semibold text-default-500">
                Email Limit
              </p>
              <div className="flex-1">
                <Divider className=" mx-2" />
              </div>
              <span className="text-sm">{messageLimit} / day</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
