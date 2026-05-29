import React, { useEffect, useState } from "react";
import { DatePicker, DateRangePicker } from "@heroui/react";
import { Button } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { parseDate, CalendarDate, today } from "@internationalized/date";
import { useRcsStore } from "../../store/rcsStore";
import { useTranslation } from "react-i18next";

const DatePiker = () => {
    const [mode, setMode] = useState("today"); // Default mode is "today"
    const defaultDay = parseDate("2024-06-04");
    const defaultWeekStart = parseDate("2024-04-01");
    const defaultWeekEnd = parseDate("2024-08-08");
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(null); // Set today's date by default
    // Zustand store functions
    const { setDashboardDate } = useRcsStore();

    // Function to handle the date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDashboardDate(date);
    };

    // Effect to handle mode changes
    useEffect(() => {
        if (mode === "yesterday") {
            const yesterday = today().subtract({ days: 1 });
            setSelectedDate(yesterday);
            setDashboardDate(yesterday);
        } else if (mode === "today") {
            const currentDate = today();
            setSelectedDate(currentDate);
            setDashboardDate(currentDate);
        }
    }, [mode]);

    return (
        <div className="mx-auto pt-3 mb-4 rounded-md">
            <div className="flex items-center justify-end gap-2">
                {/* Picker */}
                <div className="flex  justify-end">
                    <div className="ml-4">
                        {mode === "today" && (
                            <I18nProvider locale="en-US">
                                <DatePicker
                                    className="max-w-[284px]"
                                    defaultValue={today()}
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </I18nProvider>
                        )}
                        {mode === "yesterday" && (
                            <I18nProvider locale="en-US">
                                <DatePicker
                                    className="max-w-[284px]"
                                    defaultValue={defaultDay.subtract({
                                        days: 1,
                                    })}
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                />
                            </I18nProvider>
                        )}
                        {mode === "custom" && (
                            <I18nProvider locale="en-US">
                                <DateRangePicker
                                    selectorButtonPlacement="start"
                                    className="max-w-xs"
                                    defaultValue={{
                                        start: defaultWeekStart,
                                        end: defaultWeekEnd,
                                    }}
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
                            mode === "yesterday"
                                ? "active bg-success"
                                : "bg-white text-gray-700 dark:bg-content1  dark:text-gray-200"
                        }`}
                        onPress={() => setMode("yesterday")}
                        radius="full"
                        size="sm">
                        {t("Yesterday")}
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

export default DatePiker;
