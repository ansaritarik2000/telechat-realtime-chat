import React, { useState, useEffect } from "react";
import { DatePicker, DateRangePicker } from "@heroui/react";
import { Button } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { parseDate } from "@internationalized/date";
import { useTranslation } from "react-i18next";
import axios from "axios";
import emailCampaingnStore from "../../store/emailCampaign/emailCampaignStore";
import { axiosServerInstance } from "../../utils/axios/config";

const DatePickerNew = () => {
    const [mode, setMode] = useState("day");
    const currentDate = new Date();
    const currentDay = parseDate(
        `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`
    );
    const [selectedDate, setSelectedDate] = useState(null);
    const dayOfWeek = currentDate.getDay();
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(currentDate.getDate() - dayOfWeek); // Start of the week
    const weekEndDate = new Date(currentDate);
    weekEndDate.setDate(currentDate.getDate() + (6 - dayOfWeek)); // End of the week
    const defaultWeekStart = parseDate(
        `${weekStartDate.getFullYear()}-${String(
            weekStartDate.getMonth() + 1
        ).padStart(2, "0")}-${String(weekStartDate.getDate()).padStart(2, "0")}`
    );
    const defaultWeekEnd = parseDate(
        `${weekEndDate.getFullYear()}-${String(
            weekEndDate.getMonth() + 1
        ).padStart(2, "0")}-${String(weekEndDate.getDate()).padStart(2, "0")}`
    );
    const monthStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    const defaultMonth = parseDate(
        `${monthStartDate.getFullYear()}-${String(
            monthStartDate.getMonth() + 1
        ).padStart(2, "0")}-${String(monthStartDate.getDate()).padStart(
            2,
            "0"
        )}`
    );
    const { t } = useTranslation();
    const setEmailDashboard = emailCampaingnStore(
        (state) => state.setEmailDashboard
    );
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosServerInstance.get(
                    `/email/dashboard?range=${mode}`
                );
                console.log(response.data.data);
                setEmailDashboard(response.data.data);
            } catch (error) {
                console.log("Getting Error from Daterange", error);
                throw error;
            }
        };
        fetchData();
    }, [mode]);

    return (
        <div className="mx-auto pt-3 mb-4 rounded-md ">
            <div className="flex items-center justify-end gap-2 mb-4">
                {/* Picker */}
                <div className="flex justify-end">
                    <div className="ml-4">
                        {mode === "day" && (
                            <I18nProvider locale="en-US">
                                <DatePicker
                                    className="max-w-[284px]"
                                    value={currentDay}
                                    onChange={(date) => {
                                        console.log("Formate check", date); // Log the value of date to understand its format
                                        setSelectedDate(date);
                                    }}
                                    aria-label="Select a date"
                                    radius="sm"
                                />
                            </I18nProvider>
                        )}
                        {mode === "week" && (
                            <I18nProvider locale="en-US">
                                <DateRangePicker
                                    className="max-w-xs"
                                    value={{
                                        start: defaultWeekStart,
                                        end: defaultWeekEnd,
                                    }}
                                    onChange={(range) => setSelectedDate(range)}
                                    aria-label="Select a range"
                                />
                            </I18nProvider>
                        )}
                        {mode === "month" && (
                            <I18nProvider locale="en-US">
                                <DatePicker
                                    className="max-w-[284px]"
                                    type="month"
                                    value={defaultMonth}
                                    showMonthAndYearPickers
                                    onChange={(date) => setSelectedDate(date)}
                                    aria-label="Select a date"
                                />
                            </I18nProvider>
                        )}
                    </div>
                </div>
                {/* Mode Buttons */}
                <div className="flex border rounded-full px-2 py-1">
                    <Button
                        className={`mode-button ${
                            mode === "day"
                                ? "active bg-success text-white"
                                : "bg-white text-gray-700"
                        }`}
                        onPress={() => setMode("day")}
                        radius="full"
                        size="sm">
                        {t("Day")}
                    </Button>
                    <Button
                        className={`mode-button ${
                            mode === "week"
                                ? "active bg-success text-white"
                                : "bg-white text-gray-700"
                        }`}
                        onPress={() => setMode("week")}
                        radius="full"
                        size="sm">
                        {t("Week")}
                    </Button>
                    <Button
                        className={`mode-button ${
                            mode === "month"
                                ? "active bg-success text-white"
                                : "bg-white text-gray-700"
                        }`}
                        onPress={() => setMode("month")}
                        radius="full"
                        size="sm">
                        {t("Month")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DatePickerNew;
