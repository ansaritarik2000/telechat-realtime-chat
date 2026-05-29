import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Function to get weekly report data
export const getWeeklyReport = async (startDate, endDate) => {
    try {
        const response = await axiosServerInstance.get(`/rcs/weekly-report`, {
            params: {
                startDate,
                endDate,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weekly report:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};

// Function to get hourly report data for a specific day
export const getHourlyReport = async (date) => {
    try {
        const response = await axiosServerInstance.get(`/rcs/hourly-report`, {
            params: {
                date,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching hourly report:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};

// Function to get yearly report data
export const getYearlyReport = async (year) => {
    try {
        const response = await axiosServerInstance.get(`/rcs/yearly-report`, {
            params: {
                year,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching yearly report:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};
