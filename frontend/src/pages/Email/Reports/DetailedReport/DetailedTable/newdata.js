import React from "react";

// Define columns with updated platforms
const columns = [
  { name: "UUID", uid: "uuid", sortable: true },
  // { name: "Campaign Name", uid: "campaignName", sortable: true },
  { name: "Email Id", uid: "emailID", sortable: true },
  { name: "Type", uid: "templateType", sortable: true },
  { name: "Date & Time", uid: "sent_at", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Platform", uid: "platform", sortable: true },
  { name: "Engagement", uid: "engagement", sortable: true },
  { name: "Error Id", uid: "errorId", sortable: true },
  
  
];
// { name: "UUID", uid: "uuid", sortable: true },
   //{ name: "SubmitTS", uid: "submitTs", sortable: true },
  //{ name: "DeliveryTS", uid: "deliveryTs", sortable: true },
 // { name: "Message", uid: "message", sortable: true },
  //{ name: "Mobile", uid: "mobile", sortable: true },
  // { name: "Circle", uid: "circle", sortable: true },
   //{ name: "TUC ID", uid: "tucId", sortable: true },
// Status options for filtering
const statusOptions = [
  { name: "Completed", uid: "completed" },
  { name: "Failed", uid: "failed" },
  { name: "Pending", uid: "pending" },
  {name:"Scheduled", uid:"scheduled"}
];

// Error descriptions mapping
// const engagements = {
//   101: "API Key is required in the request",
//   102: "API key is invalid",
//   103: "Invalid JSON body",
//   104: "Account inactive",
//   // 105: "User IP is not whitelisted",
//   // 106: "Insufficient permissions",
//   // 107: "Required fields missing",
//   // 108: "Internal Error while saving",
//   // 109: "Resource not found",
//   // 110: "No credits left",
//   // 111: "Requested resource doesn't exist",
// };

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
const users = Array.from({ length: 5 }, (_, index) => {
  // Determine status
  const status = getRandomElement(["Success", "Failed","Awaited"]);

  // Determine error code and description based on status
  let errorId, engagement;

  if (status === "Success") {
    errorId = "--";
    engagement = "Read";
    } else if (status === "Awaited") {
      errorId = "--";
      engagement = "--";
    } else {
    errorId = getRandomElement(["001", "002 ","003"]),
    engagement = "N/A"
  }
  const campaignName = getRandomElement(["Nawaz", "Michael", "Zoey", "Jane", "William"]);
  const email = `${campaignName.toLowerCase()}${49591 + index}@example.com`; // Generate email

  return {
    id: index + 1, // Use index + 1 for unique IDs
    tucId: 49591 + index,
    campaignName: campaignName,
    email:email, 
    uuid: generateRandomUUID(),
    platform: getRandomElement(["Windows", "Tablet","Macos"]),
    mobile: `+91 ${Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(10, "0")}`,
    type: getRandomElement(["Transactional", "Promotional "]),
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
    dateTime: formatDate(new Date()),
    submitTs: formatDate(new Date(new Date().getTime() + 1000)),
    deliveryTs: formatDate(new Date(new Date().getTime() + 4000)),
    message: `Your security code is ${Math.floor(Math.random() * 9000) + 1000}`,
    status: status,
    errorId: errorId,
    engagement: engagement,
  };
});

export { columns, users, statusOptions };
