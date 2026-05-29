// This function is used to format date. like 14 Sep 2024
const formatDate = (date) => {
    const options = {
        day: "2-digit",
        month: "short", // Short month name like "Sep"
        year: "numeric", // Full year like "2024"
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
};

// This function is used to format date with time. like 27/11/24, 8:39 am
const formatDateWithTime = (date) => {
    const options = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
};

//  this function is used to format date for scheduler
function formatDateSchedule(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
}

// valid date format
const validDateFormat = (newDate) => {
    // Extracting date components and creating a valid Date object
    const validDate = new Date(
        newDate.year,
        newDate.month - 1, // Month is zero-based in JS Date
        newDate.day,
        newDate.hour || 0,
        newDate.minute || 0,
        newDate.second || 0,
        newDate.millisecond || 0
    );
    return validDate;
};
export { formatDate, formatDateSchedule, formatDateWithTime, validDateFormat };
