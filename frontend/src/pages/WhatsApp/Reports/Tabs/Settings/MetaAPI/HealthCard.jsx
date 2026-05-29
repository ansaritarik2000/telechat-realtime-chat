import React from "react";
import { Icon } from "@iconify-icon/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
  Input,
} from "@heroui/react";

export default function HealthCard(props) {
  const {
    number = "+91-9028345923",
    username = "Wired",
    status = "Connected",
    reputation = "High",
    messageLimit = "5000",
    country = "India",
    verifiedName = "Wired Technology",
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
    <div className="w-full">
      <Card
        isBlurred
        className="max-w-[800px] border border-transparent dark:border-content2"
        radius="sm"
        shadow="sm"
      >
        {/* Card Header */}
        <CardHeader className="flex gap-3 p-6 justify-between items-center  ">
          <div className="flex flex-col">
            <p className="text-xl font-medium">Quality Report </p>
            <p className="text-sm text-primary">{number}</p>
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
        <CardBody>
          <div className="flex gap-4 items-center p-4 ">
            {/* Left Half */}
            <div className="flex flex-col gap-1  w-1/2">
              {/* Status */}
              <div className="flex gap-2 justify-between p-2 items-center  ">
                <p className="text-sm font-semibold text-default-500">Status</p>
                <Divider className="w-[6em]" />
                <Chip size="sm" variant="dot" color={statusColor}>
                  <span>{status}</span>
                </Chip>
              </div>

              {/* Country */}
              <div className="flex gap-2 justify-between p-2 items-center  ">
                <p className="text-sm font-semibold text-default-500">
                  Country
                </p>
                <Divider className="w-[8em]" />

                <div className="flex  items-center text-default-500">
                  <span className="text-sm">🇮🇳 {country}</span>
                </div>
              </div>

              {/* Message Limit */}
              <div className="flex gap-2 justify-between p-2 items-center  ">
                <p className="text-sm font-semibold text-default-500">
                  Message Limit
                </p>
                <Divider className="w-[5em]" />

                <div className="flex  items-center text-default-500">
                  <span className="text-sm">{messageLimit} / day</span>
                </div>
              </div>
            </div>

            {/* Right Half */}
            <div className="flex flex-col gap-1 w-1/2 ">
              {/* Reputation */}
              <div className="flex gap-2 justify-between p-2 items-center  ">
                <p className="text-sm font-semibold text-default-500">
                  Reputation
                </p>
                <Divider className="w-[10em]" />
                <Chip size="sm" variant="flat" color={reputationColor}>
                  <span>{reputation}</span>
                </Chip>
              </div>

              {/* Username */}
              <div className="flex gap-2 justify-between p-2 items-center  ">
                <p className="text-sm font-semibold text-default-500">
                  Username
                </p>
                <Divider className="w-[8em]" />

                <div className="flex  items-center text-default-500">
                  <span className="text-sm">{username}</span>
                </div>
              </div>

              {/* Verified Name */}
              <div className="flex gap-2 justify-between p-2 items-center  ">
                <p className="text-sm font-semibold text-default-500">
                  Verfied Name
                </p>
                <Divider className="w-[1em]" />

                <div className="flex  items-center text-default-500">
                  <span className="text-sm flex items-center gap-1">
                    {verifiedName}
                    <Icon
                      icon="material-symbols-light:verified"
                      className="text-primary"
                      width={20}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
