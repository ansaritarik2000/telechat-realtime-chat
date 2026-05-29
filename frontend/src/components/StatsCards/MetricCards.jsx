import React from "react";
import { Card, CardBody } from "@heroui/react";
import {
    ContactIcon,
    DuplicateIcon,
    QuestionIcon,
} from "../../utils/ReusableIcons";

// Single Contact Metric Card
const ContactMetricCard = ({ title, number, downloadLink, icon, color }) => (
    <Card className="w-full shadow-md dark:bg-content1 border border-default  dark:border-content3">
        <CardBody className="px-8 py-6 flex flex-row items-center justify-between gap-3">
            <div className="flex flex-col gap-3">
                <span
                    className={`text-sm text-default-700 font-medium uppercase tracking-wide`}
                >
                    {title}
                </span>
                <span className={`text-3xl font-bold text-${color}-600 `}>
                    {number?.toLocaleString() ?? 0}
                </span>
                <a
                    href={downloadLink}
                    className={`text-sm cursor-pointer text-${color}-500 underline w-fit`}
                    download
                >
                    Download List
                </a>
            </div>
            <div
                className={`flex-shrink-0 flex items-center justify-center p-4 bg-${color}-50 rounded-xl `}
            >
                {icon}
            </div>
        </CardBody>
    </Card>
);

// Two-column layout for both cards
export default function MetricCards({
    invalidCount,
    duplicateCount,
    invalidDownload,
    duplicateDownload,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactMetricCard
                title="Invalid Contacts"
                number={invalidCount}
                downloadLink={invalidDownload}
                color="danger"
                icon={<QuestionIcon size="2.8em" className="text-danger" />}
            />
            <ContactMetricCard
                title="Duplicate Contacts"
                number={duplicateCount}
                downloadLink={duplicateDownload}
                color="primary"
                icon={<DuplicateIcon size="2.8em" className="text-primary" />}
            />
        </div>
    );
}
