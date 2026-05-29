import React, { useState, useEffect } from "react";
import { DateRangePicker, Button, ButtonGroup } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import {
    today,
    startOfMonth,
    endOfMonth,
    getLocalTimeZone,
} from "@internationalized/date";

const CustomDateRangePicker = ({
    onChange,
    defaultValue = null,
    locale = "en-GB",
    presets = true,
    className = "",
}) => {
    // Get current date in local timezone
    const now = today(getLocalTimeZone());

    // Define preset ranges
    const presetRanges = {
        thisWeek: {
            start: now.subtract({ days: 7 }),
            end: now,
            label: "This week",
        },
        thisMonth: {
            start: startOfMonth(now),
            end: now,
            label: "This month",
        },
        lastMonth: {
            start: startOfMonth(now.subtract({ months: 1 })),
            end: endOfMonth(now.subtract({ months: 1 })),
            label: "Last month",
        },
    };

    // Set default value if not provided
    const initialValue = defaultValue || {
        start: now.subtract({ days: 365 }),
        end: now,
    };

    const [value, setValue] = useState(initialValue);

    // Handle range change
    const handleRangeChange = (range) => {
        setValue(range);
        if (onChange) {
            onChange(range);
        }
    };

    // Handle preset selection
    const handlePresetSelect = (presetKey) => {
        setValue(presetRanges[presetKey]);
        if (onChange) {
            onChange(presetRanges[presetKey]);
        }
    };

    // Update parent component when value changes
    useEffect(() => {
        if (onChange) {
            onChange(value);
        }
    }, [value]);

    return (
        <div className={className}>
            <I18nProvider locale={locale}>
                <DateRangePicker
                    maxValue={now}
                    aria-label="Select a date range"
                    value={value}
                    onChange={handleRangeChange}
                    locale={locale}
                    calendarProps={{
                        focusedValue: value.start,

                        onFocusChange: (val) =>
                            setValue({ ...value, start: val }),
                        nextButtonProps: {
                            variant: "bordered",
                        },
                        prevButtonProps: {
                            variant: "bordered",
                        },
                    }}
                    CalendarTopContent={
                        presets ? (
                            <ButtonGroup
                                fullWidth
                                className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                                radius="full"
                                size="sm"
                                variant="bordered">
                                <Button
                                    onPress={() =>
                                        handlePresetSelect("thisWeek")
                                    }>
                                    {presetRanges.thisWeek.label}
                                </Button>
                                <Button
                                    onPress={() =>
                                        handlePresetSelect("thisMonth")
                                    }>
                                    {presetRanges.thisMonth.label}
                                </Button>
                                <Button
                                    onPress={() =>
                                        handlePresetSelect("lastMonth")
                                    }>
                                    {presetRanges.lastMonth.label}
                                </Button>
                            </ButtonGroup>
                        ) : null
                    }
                />
            </I18nProvider>
        </div>
    );
};

export default CustomDateRangePicker;
