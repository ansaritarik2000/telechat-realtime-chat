import React, { useState } from "react";
import { DatePicker, DateRangePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";

export default function CustomDatePicker() {
    const [isSingleSelect, setIsSingleSelect] = useState(false);
    const [selectedDate, setSelectedDate] = useState(parseDate("2024-04-04"));
    const [dateRange, setDateRange] = useState([null, null]);

    return (
        <div className="max-w-xs flex items-center">
            <div>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isSingleSelect}
                        onChange={() => setIsSingleSelect(!isSingleSelect)}
                    />
                    <span>Single Date</span>
                </label>
            </div>
            {isSingleSelect ? (
                <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    label="Select a date"
                    className="max-w-xs"
                />
            ) : (
                <DateRangePicker
                    label="Select date range"
                    className="max-w-xs"
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    onChange={(dates) => setDateRange(dates)}
                />
            )}
        </div>
    );
}
