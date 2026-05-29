import { formatDate } from "../../utils/dateformat.js";
import { asyncErrorHandler } from "../ErrorController/asyncErrorHandler.js";

// Controller function to get members with pagination, search, and status filters

export const getMembersController = async (req, res, supabase) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status,
            user_id,
        } = req.query;

        // Build the base query (without pagination)
        let query = supabase
            .from("member_user_details")
            .select(
                `
                    status,
                    created_at,
                    avatar_value,
                    avatar_type,
                    id,
                    password,
                    is_favourite,
                users:user_id(
                    email,
                    first_name,
                    role,
                    last_name,
                    id,
                    phone_no,
                    country_dial_code
                ),
                creator_details:creator_id(first_name, last_name, email, id)
            `,
                { count: "exact" }
            )
            .neq("status", "trash") // Exclude "trash" members
            .order("created_at", { ascending: false });

        if (user_id) {
            query = query.neq("user_id", user_id);
        }

        if (status && status !== "all") {
            if (Array.isArray(status)) {
                query = query.in("status", status);
            } else {
                query = query.eq("status", status);
            }
        }

        const { data: members, error } = await query;

        if (error) {
            return res.status(500).send({
                status: "ERROR",
                message: error.message || "Failed to retrieve members.",
            });
        }

        // Apply search filter on the full dataset before pagination
        let filteredMembers = members;

        if (search) {
            const lowerSearch = search.toLowerCase();
            filteredMembers = members.filter((item) =>
                `${item?.users?.first_name || ""} ${
                    item?.users?.last_name || ""
                } ${item?.users?.email || ""} ${item?.users?.phone_no || ""}`
                    .toLowerCase()
                    .includes(lowerSearch)
            );
        }

        // Calculate total items after filtering
        const totalItems = filteredMembers.length;

        // Apply pagination after filtering
        const paginatedMembers = filteredMembers.slice(
            (page - 1) * limit,
            page * limit
        );

        // Format response data
        const formattedData = paginatedMembers.map((item) => ({
            id: item.id,
            user_id: item.users.id,
            name: `${item?.users?.first_name || ""} ${
                item?.users?.last_name || ""
            }`,
            first_name: item?.users?.first_name,
            last_name: item?.users?.last_name,
            role: item.users.role,
            email: item.users?.email,
            phone_no: item.users?.phone_no,
            country_dial_code: item.users?.country_dial_code,
            status: item.status,
            created_at: item.created_at
                ? formatDate(new Date(item.created_at))
                : null,
            creator_name: `${item?.creator_details?.first_name || ""} ${
                item?.creator_details?.last_name || ""
            }`,
            creator_email: `${item?.creator_details?.email || ""}`,
            password: item.password,
            avatar_value: item.avatar_value,
            avatar_type: item.avatar_type,
            is_favourite: item.is_favourite,
        }));

        res.status(200).send({
            status: "SUCCESS",
            data: formattedData,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / limit),
                totalItems,
                limit: parseInt(limit),
            },
            message: "Members retrieved successfully",
        });
    } catch (error) {
        console.error("Failed to retrieve members:", error);
        res.status(500).send({
            status: "ERROR",
            message: error.message || "Failed to retrieve members.",
        });
    }
};

// get member controller with IP info
export const getMemebrsIpInfoController = async (req, res, supabase) => {
    try {
        const { id: creator_id } = req.user; // Creator ID

        // Build the base query
        let query = supabase
            .from("member_user_details")
            .select(
                `
                    status,
                    created_at,
                    avatar_value,
                    avatar_type,
                    id,
                    user_id,
                    users:user_id(
                        email,
                        first_name,
                        last_name,
                        last_login,
                        country,
                        region,
                        city,
                        platform,
                        ip
                    )
                `,
                { count: "exact" }
            )
            .eq("creator_id", creator_id) // Filter by creator ID
            .neq("status", "trash") // Exclude members with "trash" status
            .eq("status", "active");

        const { data: members, count, error } = await query;

        if (error) {
            return res.status(500).send({
                status: "ERROR",
                message:
                    error.message ||
                    "Failed to retrieve members with IP details.",
            });
        }

        console.log("members", members);

        // Sort and limit in-memory as last_login is nested
        const sortedMembers = members
            .filter((item) => item.users?.last_login) // Ensure `last_login` exists
            .sort(
                (a, b) =>
                    new Date(b.users.last_login) - new Date(a.users.last_login)
            ) // Sort by `last_login` descending
            .slice(0, 5); // Limit to 5 members

        console.log("sortedMembers", sortedMembers);
        // Format data for response
        const formattedData = sortedMembers.map((item) => ({
            id: item.id, // Member ID
            user_id: item.users.id,
            name: `${item?.users?.first_name || ""}${
                item?.users?.last_name ? " " : ""
            }${item?.users?.last_name || ""}`, // User name
            email: item.users?.email, // User email
            phone_no: item.users?.phone_no, // User phone number
            ipaddress: item.users?.ip,
            platform: item.users?.platform,
            date: formatDate(new Date(item.users?.last_login)), //last login
            location: `${item?.users?.city}, ${item?.users?.region}, ${item?.users?.country}`,
            avatar_value: item.avatar_value,
            avatar_type: item.avatar_type,
            is_favourite: item.is_favourite || false,
        }));

        res.status(200).send({
            status: "SUCCESS",
            data: formattedData,
            message: "Members retrieved with IP info successfully",
        });
    } catch (error) {
        console.error("Failed to retrieve members:", error);
        res.status(500).send({
            status: "ERROR",
            message:
                error.message || "Failed to retrieve members with IP info.",
        });
    }
};

export const getMemebrById = async (req, res, supabase) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("member_user_details")
            .select(`avatar_value`)
            .eq("id", id)
            .single();
        res.status(200).send({
            status: "SUCCESS",
            data: data,
        });
    } catch (error) {
        console.error("Failed to retrieve avatar_value", error);
        res.status(500).send({
            status: "ERROR",
            message: error.message || "Failed to retrieve avatar_value",
        });
    }
};

export const getMemberIdByUserId = async (req, res, supabase) => {
    try {
        const { user_id } = req.params;
        const { data, error } = await supabase
            .from("member_user_details")
            .select(`id`)
            .eq("user_id", user_id)
            .single();
        res.status(200).send({
            status: "SUCCESS",
            data: data,
        });
    } catch (error) {
        console.error("Failed to retrieve avatar_value", error);
        res.status(500).send({
            status: "ERROR",
            message: error.message || "Failed to retrieve avatar_value",
        });
    }
};
