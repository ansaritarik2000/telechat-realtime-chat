import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service function to save flow data
export const saveFlowService = async (flowData) => {
    try {
        const response = await axiosServerInstance.post(
            `/flow/saveflow`,
            flowData
        );
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Error saving flow",
            error: error.response?.data || error,
        };
    }
};

// Service function to retrieve all flow data
export const getAllFlowsService = async () => {
    try {
        const response = await axiosServerInstance.get(`/flow/getflows`);
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Error retrieving flows",
            error: error.response?.data || error,
        };
    }
};

// Service function to retrieve a specific flow by ID
export const getFlowByIdService = async (id) => {
    try {
        const response = await axiosServerInstance.get(`/flow/getflow/${id}`);
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Error retrieving flow by ID",
            error: error.response?.data || error,
        };
    }
};

// Service function to update flow data by ID
export const updateFlowService = async (id, flowData) => {
    try {
        const response = await axiosServerInstance.put(
            `/flow/updateflow/${id}`,
            flowData
        );
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Error updating flow",
            error: error.response?.data || error,
        };
    }
};
