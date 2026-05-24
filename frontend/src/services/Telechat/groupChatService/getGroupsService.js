import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

export const getGroupsService = async (token) => {
    try {
        const response = await axiosServerInstance.get(`/telechat/group/list`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            status: response.data.status,
            groups: response.data.groups,
        };
    } catch (error) {
        console.error("Error fetching groups:", error);
        return {
            status: "ERROR",
            message: "Failed to fetch groups",
        };
    }
};
