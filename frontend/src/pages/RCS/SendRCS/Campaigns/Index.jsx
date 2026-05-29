import React, { useEffect, useState } from "react";
import { Select, SelectItem, Checkbox, cn } from "@heroui/react";
import { Input } from "@heroui/react";
import CampDatePicker from "./CampDatePicker";
import { useSendRcStore } from "../../../../store/sendRcsStore";
import { useTranslation } from "react-i18next";
import CampaignScheduler from "../../../../components/DatePicker/Scheduler";
import {
    formatDateSchedule,
    validDateFormat,
} from "../../../../utils/formatDate";

export const intervals = [
    { key: "5 minutes", label: "5 minutes" },
    { key: "10 minutes", label: "10 minutes" },
    { key: "15 minutes", label: "15 minutes" },
    { key: "20 minutes", label: "20 minutes" },
];

export default function Campaigns() {
    // zustand store
    const {
        interval,
        batchSize,
        splitCampaign,
        setInterval,
        setBatchSize,
        setSelectedDate,
        setSplitCampaign,
        scheduleCampaign,
        setScheduleCampaign,
    } = useSendRcStore();

    const { t } = useTranslation();

    // use effect
    useEffect(() => {
        if (!splitCampaign) {
            setBatchSize(0);
            setInterval([]);
        } else if (!scheduleCampaign) {
            setSelectedDate(null);
        }
    }, [splitCampaign, scheduleCampaign]);

    // on date change handller
    const onDateChangeHandller = (newDate) => {
        const validDate = validDateFormat(newDate);
        setSelectedDate(validDate);
    };

    return (
        <div className="flex gap-8 flex-col ">
            {/* Split Campaign Checkbox */}
            <div className="flex items-center gap-4 w-full ml-2">
                <Checkbox
                    size="md"
                    color="none"
                    checked={scheduleCampaign}
                    onChange={(e) => setScheduleCampaign(e.target.checked)}
                    classNames={{
                        ...styles,
                    }}
                    className="mr-2"
                >
                    <Label label={t("Schedule Campaign")} />
                </Checkbox>
                <Checkbox
                    size="md"
                    color="none"
                    checked={splitCampaign}
                    onChange={(e) => setSplitCampaign(e.target.checked)}
                    classNames={{
                        ...styles,
                    }}
                >
                    <Label label={t("Split Campaign")} />
                </Checkbox>
            </div>

            {/* Schedule Campaign Row */}
            <div className="gap-4 grid grid-cols-3">
                {scheduleCampaign && (
                    <div className="flex flex-col gap-4 col-span-1">
                        <p className="text-sm">Select the schedule date</p>
                        <CampaignScheduler
                            onDateChange={onDateChangeHandller}
                        />
                    </div>
                )}

                {splitCampaign && (
                    <div className="flex gap-4 w-full col-span-2">
                        {/* Batch Size */}
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-sm">Select the batch size</p>
                            {/* Batch Size */}
                            <Input
                                value={batchSize}
                                onChange={(e) => setBatchSize(e.target.value)}
                                size="sm"
                                type="text"
                                label="Batch Size"
                                className="w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-sm">Select the interval</p>

                            {/* Interval */}
                            <Select
                                label="Interval"
                                size="sm"
                                selectedKeys={interval}
                                className="w-full"
                                onSelectionChange={setInterval}
                            >
                                {intervals.map((interval) => (
                                    <SelectItem key={interval.key}>
                                        {interval.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Label
const Label = ({ label }) => {
    return <p className="text-default-600 text-sm">{label}</p>;
};

const styles = {
    base: cn(
        "inline-flex max-w-lg bg-content2",
        "hover:bg-content3 transition-all duration-200  items-center justify-start",
        "cursor-pointer rounded-lg gap-2 py-2 border-2 border-transparent",
        "data-[selected=true]:border-default"
    ),
    label: "w-full",
};
