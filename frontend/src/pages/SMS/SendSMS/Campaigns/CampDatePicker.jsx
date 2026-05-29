import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Select, SelectItem } from "@heroui/react";
import { useSendSmsStore } from "../../../../store/sendSmsStore";
import { parseDate } from "@internationalized/date";

// Time zones
const timeZones = [
    { value: "GMT+05:30", label: "Indian Standard Time (IST) - GMT+05:30" }, // India
    { value: "GMT+06:00", label: "Bangladesh Standard Time (BST) - GMT+06:00" }, // Bangladesh
    { value: "GMT+06:30", label: "Cocos Islands Time (CCT) - GMT+06:30" }, // Cocos Islands
    { value: "GMT+07:00", label: "Indochina Time (ICT) - GMT+07:00" }, // Vietnam, Thailand, Cambodia
    { value: "GMT+08:00", label: "Singapore Time (SGT) - GMT+08:00" }, // Singapore, Malaysia
    { value: "GMT+09:00", label: "Japan Standard Time (JST) - GMT+09:00" }, // Japan
    {
        value: "GMT+10:00",
        label: "Australian Eastern Standard Time (AEST) - GMT+10:00",
    }, // Australia
    { value: "GMT+04:30", label: "Afghanistan Time (AFT) - GMT+04:30" }, // Afghanistan
    { value: "GMT+05:00", label: "Pakistan Standard Time (PKT) - GMT+05:00" }, // Pakistan
    { value: "GMT+04:00", label: "Gulf Standard Time (GST) - GMT+04:00" }, // UAE, Oman
    { value: "GMT+03:30", label: "Iran Standard Time (IRST) - GMT+03:30" }, // Iran
];

export default function CampDatePicker() {
    // zustand store
    const { selectedDate, setSelectedDate } = useSendSmsStore();

    const [selectedTimeZone, setSelectedTimeZone] = useState(
        timeZones[0].value
    );

    return (
        <div className="flex gap-4">
            {/* Date Picker */}
            <DatePicker
                format="DD/MM/YYYY HH:mm"
                plugins={[<TimePicker position="bottom" />]}
                value={selectedDate}
                onChange={setSelectedDate}
                className="py-3"
            />

            {/* Time Zone Select */}
            <Select
                // label="Time Zone"
                placeholder="Time Zone"
                size="sm"
                radius="sm"
                variant="bordered"
                color="default"
                className="max-w-[140px]"
                onChange={(e) => setSelectedTimeZone(e.target.value)}
                value={selectedTimeZone}>
                {timeZones.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                        {zone.value}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}
