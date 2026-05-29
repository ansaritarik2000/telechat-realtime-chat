import axios from "axios";
import { axiosServerInstance } from "../../../../../../utils/axios/config";
export const convertToMilliseconds = (timeString) => {
    if (!timeString || typeof timeString !== "string") {
        return 0; // Default to 0 milliseconds if no time string is provided
    }
    const [value, unit] = timeString.split(" ");
    const numericValue = parseInt(value, 10);
    switch (unit) {
        case "minutes":
            return numericValue * 60 * 1000; // Convert minutes to milliseconds
        default:
            throw new Error(`Unsupported time unit: ${unit}`);
    }
};

// formate the date of campaign name
export const formatDate = () => {
    const date = new Date(); // Current date and time

    // Extract components
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour format
    hours = hours % 12 || 12;

    // Format the date correctly
    return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
};

export const formatDateRangeDashboard = (dateRange) => {
    const { start, end } = dateRange || {};
    console.log(dateRange);
    const formatDate = (dateObj) => {
        if (
            !dateObj ||
            typeof dateObj.year === "undefined" ||
            typeof dateObj.month === "undefined" ||
            typeof dateObj.day === "undefined"
        ) {
            return null; // or return an empty string or any other fallback value
        }
        const year = dateObj.year;
        const month = String(dateObj.month).padStart(2, "0"); // Ensure two digits for the month
        const day = String(dateObj.day).padStart(2, "0"); // Ensure two digits for the day
        return `${year}-${month}-${day}`;
    };

    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);

    return { formattedStart, formattedEnd };
};

// Example usage:
// const dateRange = {
//     start: { calendar: '$3b62074eb05584b2$export$80ee6245ec4f29ec', era: 'AD', year: 2024, month: 12, day: 1 },
//     end: { calendar: '$3b62074eb05584b2$export$80ee6245ec4f29ec', era: 'AD', year: 2024, month: 12, day: 31 }
// };

// const formattedDates = formatDateRange(dateRange);
// console.log(formattedDates); // { formattedStart: '2024-12-01', formattedEnd: '2024-12-31' }

export const HtmlTemplate = async (templatename, typename) => {
    try {
        const template = axiosServerInstance.get(
            `/email/htmlTemplates?templatename=${templatename}&typename=${typename}`
        );
        console.log("template", template);
        return template;
    } catch (error) {
        console.log("Please select the template");
        throw error;
    }
};
