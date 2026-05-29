import { users } from "./DetailedTable/newdata"; 

// Function to calculate percentage for each status
const totalUsers = users.length;

// Compute counts for each status
const successUsers = users.filter((user) => user.status === "Success").length;
const failedUsers = users.filter((user) => user.status === "Failed").length;
const awaitedUsers = users.filter((user) => user.status === "Awaited").length;

// Compute percentages for each status
const successPercentage = ((successUsers / totalUsers) * 100).toFixed(2);
const failedPercentage = ((failedUsers / totalUsers) * 100).toFixed(2);
const awaitedPercentage = ((awaitedUsers / totalUsers) * 100).toFixed(2);

// Export computed data for each chart
export const successChartData = {
    percentage: successPercentage,
    current: successUsers,
    total: totalUsers,
};

export const failedChartData = {
    percentage: failedPercentage,
    current: failedUsers,
    total: totalUsers,
};

export const awaitedChartData = {
    percentage: awaitedPercentage,
    current: awaitedUsers,
    total: totalUsers,
};