// Campaign Name, WABA ID, Time & Date, Route, Type, Number, Country (IND, UK, US), Status (Delivered, Failed, Awaited),
// Engagement (Read with Double tick icon, Not Read double tick, Clicked cursor icon), Error Code, Error Description

const columns = [
    // { name: "Campaign Name", uid: "campaign_name", sortable: true },
    { name: "WABA ID", uid: "waba_id", sortable: true },
    { name: "Time & Date", uid: "created_at", sortable: true },
    { name: "Type", uid: "type", sortable: true },
    { name: "Number", uid: "phoneNumbers", sortable: true },
    { name: "Country", uid: "country", sortable: true },
    { name: "Status", uid: "status", sortable: true },
    { name: "Engagement", uid: "engagement", sortable: true },
    { name: "Error Code", uid: "error_code", sortable: true },
    { name: "Error Description", uid: "error", sortable: true },

];

// Status options for filtering
const statusOptions = [
    { name: "Success", uid: "success" },
    { name: "Failed", uid: "failed" },
    { name: "Awaited", uid: "awaited" },
];

// Error descriptions mapping
const errorDescriptions = {
    101: "API Key is required in the request",
    102: "API key is invalid",
    103: "Invalid JSON body",
    104: "Account inactive",
};

// Helper functions for generating random data
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function formatDate(date) {
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Kolkata",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
}

// Generate random data
// Generate random data
const users = Array.from({ length: 20 }, (_, index) => {
    // Determine status
    const status = getRandomElement(["Success", "Failed", "Awaited"]);

    // Determine error code and description based on status
    let errorCode, errorDescription, engagement;

    if (status === "Success") {
        errorCode = "--";
        errorDescription = "--";
        engagement = getRandomElement(["Read", "Not Read", "Clicked"]); // Random engagement for Success
    } else if (status === "Awaited") {
        errorCode = "--";
        errorDescription = "--";
        engagement = "N/A"; // Set engagement to "--" when status is Awaited
    } else {
        // Failed status
        errorCode = getRandomElement(Object.keys(errorDescriptions));
        errorDescription = errorDescriptions[errorCode];
        engagement = "N/A"; // Set engagement to "--" when status is Failed
    }

    return {
        id: index + 1, // Use index + 1 for unique IDs
        tucId: 49591 + index,
        tucName: getRandomElement([
            "Marketing",
            "Sales",
            "Discount",
            "New",
            "Holiday",
        ]),
        uuid: generateRandomUUID(),
        header: getRandomElement(["API", "Panel"]),
        type: getRandomElement([
            "Marketing",
            "Services",
            "Utility",
            "Authentication",
        ]),
        mobile: `+91-${Math.floor(Math.random() * 10000000000)
            .toString()
            .padStart(10, "0")}`,
        operator: getRandomElement(["VI", "Reliance Jio", "Airtel"]),
        circle: getRandomElement(["India"]),
        receivedTs: formatDate(new Date()),
        submitTs: formatDate(new Date(new Date().getTime() + 1000)),
        deliveryTs: formatDate(new Date(new Date().getTime() + 4000)),
        message: `Your security code is ${
            Math.floor(Math.random() * 9000) + 1000
        }`,
        status: status,
        engagement: engagement,
        errorCode: errorCode,
        errorDescription: errorDescription,
    };
});

export { columns, users, statusOptions };
