import React, { useEffect, useState } from "react";
import { Select, SelectItem, Checkbox, cn } from "@heroui/react";
import { Input } from "@heroui/react";
import CampDatePicker from "./CampaignDatePicker";
import { useTranslation } from "react-i18next";
import emailCampaingnStore from "../../../../../store/emailCampaign/emailCampaignStore";
import CampaignScheduler from "../../../../../components/DatePicker/Scheduler";
export const intervals = [
    { key: "5 minutes", label: "5 minutes" },
    { key: "10 minutes", label: "10 minutes" },
    { key: "15 minutes", label: "15 minutes" },
    { key: "20 minutes", label: "20 minutes" },
    { key: "25 minutes", label: "25 minutes" },
    { key: "30 minutes", label: "30 minutes" },
];

export default function SplitCampaign() {
    const { t } = useTranslation();
    const [isScheduleChecked, setIsScheduleChecked] = useState(false);
    const [isSplitChecked, setIsSplitChecked] = useState(false);
    const [batchSize, setBatchSize] = useState("");
    const [interval, setInterval] = useState([]);
    const setEmailCampaingnData = emailCampaingnStore(
        (state) => state.setEmailCampaingnData
    );
    // Batch size store in zustand
    const handleBatched = (e) => {
        setBatchSize(e.target.value);
        setEmailCampaingnData(e.target.name, e.target.value);
    };
    // Time interval store in zustand
    const handleTime = (key) => {
        setInterval(key);
        // console.log(key.currentKey)
        setEmailCampaingnData("Interval", key.currentKey);
    };
    return (
        <div className="flex gap-8 flex-col">
            {/* Split Campaign Checkbox */}
            <div className="flex items-center gap-4 w-full ml-2">
                <Checkbox
                    size="md"
                    color="none"
                    isSelected={isScheduleChecked}
                    onChange={() => setIsScheduleChecked(!isScheduleChecked)}
                    classNames={{
                        ...styles,
                    }}
                    className="mr-2"
                >
                    <Label label="Schedule Campaign" />
                </Checkbox>
                <Checkbox
                    size="md"
                    color="none"
                    isSelected={isSplitChecked}
                    onChange={() => setIsSplitChecked(!isSplitChecked)}
                    classNames={{
                        ...styles,
                    }}
                >
                    <Label label="Split Campaign" />
                </Checkbox>
            </div>

            <div className="gap-4 grid grid-cols-3">
                {/* New Date Picker */}
                {isScheduleChecked && (
                    <div className="flex flex-col gap-4 col-span-1">
                        <p className="text-sm">Select the schedule date</p>
                        <CampaignScheduler />
                    </div>
                )}

                {isSplitChecked && (
                    <div className="flex gap-4 w-full col-span-2">
                        {/* Batch Size */}
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-sm">Select the batch size</p>
                            <Input
                                size="sm"
                                name="batchSize"
                                defaultValue={0}
                                value={batchSize}
                                onChange={handleBatched}
                                type="text"
                                label="Batch Size"
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            {/* Interval */}
                            <p className="text-sm">Select the interval</p>
                            <Select
                                label="Interval"
                                size="sm"
                                selectedKeys={interval}
                                onSelectionChange={handleTime}
                            >
                                {intervals.map((item) => (
                                    <SelectItem key={item.key}>
                                        {item.label}
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
        "cursor-pointer rounded-lg gap-2 px-2 py-2 border-2 border-transparent",
        "data-[selected=true]:border-default"
        // "data-[selected=true]:bg-success"
    ),
    label: "w-full",
};
