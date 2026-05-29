import React, { useEffect, useState } from "react";
import {
    DatePicker,
    DateRangePicker,
    Radio,
    RadioGroup,
    Button,
    ButtonGroup,
    cn,
} from "@heroui/react";
import { I18nProvider, useLocale, useDateFormatter } from "@react-aria/i18n";
import { useRcsStore } from "../../store/rcsStore";
import { useTranslation } from "react-i18next";
import {
    today,
    parseDate,
    startOfWeek,
    startOfMonth,
    endOfWeek,
    endOfMonth,
    getLocalTimeZone,
} from "@internationalized/date";
import { useEmailDashStore } from "../../store/emailCampaign/dashboardDate";

// contoller components data fetch in nextUi calender components

const DashboardDatePicker = ({ locale = "en-GB" }) => {
    const [mode, setMode] = useState("today");
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(today()); // Set today's date by default
    // Zustand store functions
    const { setDashboardDate, dashboardDate } = useRcsStore();
    const { setEmailDashboardDate, emailDashboardDate } = useEmailDashStore();
    let defaultDate = {
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({ days: 7 }),
    };
    // const now = today(getLocalTimeZone()); // Current date

    const [value, setValue] = useState(defaultDate);
    // console.log("emailDashboardDate", emailDashboardDate);
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDashboardDate(date);
    };

    useEffect(() => {
        if (mode === "yesterday") {
            const yesterday = today().subtract({ days: 1 });
            setSelectedDate(yesterday);
            setDashboardDate(yesterday);
            // setEmailDashboardDate(yesterday)
        } else if (mode === "today") {
            const currentDate = today();
            setSelectedDate(currentDate);
            setDashboardDate(currentDate);
            // setEmailDashboardDate(currentDate)
        } else if (mode === "custom") {
            setDashboardDate(value);
        }
        setEmailDashboardDate(value);
    }, [mode, value]);

    // handle range change
    const handleRangeChange = (range) => {
        setValue(range);
        setDashboardDate(range);
        setEmailDashboardDate(range);
    };

    // Date logic for buttons
    let now = today(getLocalTimeZone());

    //  "This week" to start 7 days ago
    let thisWeek = {
        start: now.subtract({ days: 7 }),
        end: now,
    };
    // "This month" starts from the 1st of the current month
    let thisMonth = {
        start: startOfMonth(now),
        end: now,
    };

    let lastMonth = {
        start: startOfMonth(now.subtract({ months: 1 })),
        end: endOfMonth(now.subtract({ months: 1 })),
    };

    const CustomRadio = (props) => {
        const { children, ...otherProps } = props;

        return (
            <Radio
                {...otherProps}
                classNames={{
                    base: cn(
                        "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
                        "cursor-pointer rounded-full border-2 border-default-200/60",
                        "data-[selected=true]:border-primary"
                    ),
                    label: "text-tiny text-default-500",
                    labelWrapper: "px-1 m-0",
                    wrapper: "hidden",
                }}>
                {children}
            </Radio>
        );
    };

    return (
        <div className="mx-auto pt-3 mb-4 rounded-md">
            <div className="flex items-center justify-end gap-2">
                {/* Picker */}
                <div className="flex justify-end">
                    <div className="ml-4">
                        {/* Today Picker */}
                        {mode === "today" && (
                            <I18nProvider locale={locale}>
                                <DatePicker
                                    showMonthAndYearPickers
                                    aria-label="Select a date"
                                    className="max-w-[284px]"
                                    defaultValue={today()}
                                    value={selectedDate}
                                    maxValue={now}
                                    onChange={handleDateChange}
                                />
                            </I18nProvider>
                        )}

                        {/* Custom Range Picker */}
                        {mode === "custom" && (
                            <I18nProvider locale={locale}>
                                <DateRangePicker
                                    aria-label="Select a range"
                                    maxValue={now}
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
                                        <ButtonGroup
                                            fullWidth
                                            className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
                                            radius="full"
                                            size="sm"
                                            variant="bordered">
                                            <Button
                                                onPress={() =>
                                                    setValue(thisWeek)
                                                }>
                                                This week
                                            </Button>
                                            <Button
                                                onPress={() =>
                                                    setValue(thisMonth)
                                                }>
                                                This month
                                            </Button>
                                            <Button
                                                onPress={() =>
                                                    setValue(lastMonth)
                                                }>
                                                Last month
                                            </Button>
                                        </ButtonGroup>
                                    }
                                    value={value}
                                    onChange={handleRangeChange}
                                />
                            </I18nProvider>
                        )}
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex border rounded-full p-1">
                    <Button
                        className={`mode-button ${
                            mode === "today"
                                ? "active bg-success"
                                : "bg-white text-gray-700 dark:bg-content1  dark:text-gray-200"
                        }`}
                        onPress={() => setMode("today")}
                        radius="full"
                        size="sm">
                        {t("Today")}
                    </Button>

                    <Button
                        className={`mode-button ${
                            mode === "custom"
                                ? "active bg-success"
                                : "bg-white text-gray-700 dark:bg-content1  dark:text-gray-200"
                        }`}
                        onPress={() => setMode("custom")}
                        radius="full"
                        size="sm">
                        {t("Custom Range")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DashboardDatePicker;
