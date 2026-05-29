import { backend_base_url } from "../common";

export const sendEmailsClient = async (data) => {
    try {
        const response = await fetch(
            `${backend_base_url}/email/send-email-aws`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        if (!response.ok) {
            console.error("Request failed with status:", response.status);
            return { message: "Request failed", status: response.status };
        }
        const result = await response.json(); // Parse the JSON response
        console.log(result);
        return result;
    } catch (error) {
        console.error("Error occurred while sending emails:", error);
        return { message: "Error occurred", error };
    }
};

export const sendEmailsTest = async (data) => {
    try {
        const response = await fetch("/email/send-test-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            console.error("Request failed with status:", response.status);
            return { message: "Request failed", status: response.status };
        }
        const result = await response.json(); // Parse the JSON response
        console.log(result);
        return result;
    } catch (error) {
        console.error("Error occurred while sending emails:", error);
        return { message: "Error occurred", error };
    }
};
