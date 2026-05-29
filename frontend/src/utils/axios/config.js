import axios from "axios";
import { SERVER_DOMAIN } from "../env";

export const axiosServerInstance = axios.create({
    baseURL: `${SERVER_DOMAIN}`,
});
console.log("SERVER_DOMAIN =>", SERVER_DOMAIN);

// Request Interceptor: Attach Authorization Token

axiosServerInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Example: Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors

axiosServerInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.data);
        }
        return Promise.reject(error);
    }
);
