import React from "react";

// Define columns with updated headers
const columns = [
    // { name: "TUC ID", uid: "tuc_id", sortable: true },
    // { name: "TUC Name", uid: "tuc_name", sortable: true },
    { name: "Message ID", uid: "message_id", sortable: true },
    { name: "Header", uid: "header_name", sortable: true },
    { name: "Mobile", uid: "phone_number", sortable: true },
    { name: "Operator", uid: "operator", sortable: true },
    { name: "Circle", uid: "circle", sortable: true },
    { name: "Received At", uid: "received_at", sortable: true },
    { name: "Submitted At", uid: "submitted_at", sortable: true },
    { name: "Delivered At", uid: "delivered_at", sortable: true },
    { name: "Message", uid: "message", sortable: true },
    { name: "Status", uid: "status", sortable: true },
    { name: "Error Code", uid: "error_code", sortable: true },
    { name: "Error Description", uid: "error_description", sortable: true },
];

// Status options for filtering
const statusOptions = [
    { name: "Success", uid: "success" },
    { name: "Failed", uid: "failed" },
];

// Error descriptions mapping
const errorDescriptions = {
    101: "API Key is required in the request",
    102: "API key is invalid",
    103: "Invalid JSON body",
    104: "Account inactive",
    // 105: "User IP is not whitelisted",
    // 106: "Insufficient permissions",
    // 107: "Required fields missing",
    // 108: "Internal Error while saving",
    // 109: "Resource not found",
    // 110: "No credits left",
    // 111: "Requested resource doesn't exist",
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
const users = Array.from({ length: 20 }, (_, index) => {
    // Determine status
    const status = getRandomElement(["Success", "Failed"]);

    // Determine error code and description based on status
    let errorCode, errorDescription;

    if (status === "Success") {
        errorCode = "000";
        errorDescription = "None";
    } else {
        errorCode = getRandomElement(Object.keys(errorDescriptions));
        errorDescription = errorDescriptions[errorCode];
    }

    return {
        id: index + 1, // Use index + 1 for unique IDs
        tucId: 49591 + index,
        tucName: getRandomElement([
            "Nawaz",
            "Michael",
            "Zoey",
            "Jane",
            "William",
            "Kristen",
            "Brian",
            "Samantha",
            "Frank",
            "Emma",
            "Brandon",
            "Megan",
            "Oliver",
            "Grace",
            "Noah",
            "Ava",
            "Liam",
            "Sophia",
            "Lucas",
            "Mia",
        ]),
        uuid: generateRandomUUID(),
        header: getRandomElement(["TELEPIE", "TSGNAL"]),
        mobile: `+91 ${Math.floor(Math.random() * 10000000000)
            .toString()
            .padStart(10, "0")}`,
        operator: getRandomElement(["VI", "Reliance Jio", "Airtel"]),
        circle: getRandomElement([
            "Delhi",
            "Andhra Pradesh",
            "Maharashtra",
            "Karnataka",
            "Tamil Nadu",
            "West Bengal",
            "Uttar Pradesh",
            "Bihar",
            "Rajasthan",
            "Haryana",
        ]),
        receivedTs: formatDate(new Date()),
        submitTs: formatDate(new Date(new Date().getTime() + 1000)),
        deliveryTs: formatDate(new Date(new Date().getTime() + 4000)),
        message: `Your security code is ${
            Math.floor(Math.random() * 9000) + 1000
        }`,
        status: status,
        errorCode: errorCode,
        errorDescription: errorDescription,
    };
});

export { columns, users, statusOptions };
