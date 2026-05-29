import { formatDate } from "./dateformat.js";

//  this function save sms in details sms_details table
const saveSmsDetails = async (supabase, smsData) => {
    const {
        phone_number,
        operator,
        circle,
        received_at,
        submitted_at,
        delivered_at,
        campaign_id,
        status = "pending",
        error_code,
        error_description,
        message_id,
    } = smsData;
    console.log("smsData", smsData);
    try {
        const { data, error } = await supabase.from("sms_details").insert([
            {   
                phone_number,
                operator,
                circle,
                received_at,
                submitted_at,
                delivered_at,
                campaign_id,
                status,
                error_code,
                error_description,
                message_id,
            },
        ]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error in saveSmsDetails:", error);
        throw error;
    }
};

// this function save test sms in details
const saveTestSMSDetails = async (supabase, data) => {
    const {
        phone_number,
        operator,
        circle,
        received_at,
        submitted_at,
        delivered_at,
        campaign_id,
        status = "pending",
        error_code,
        error_description,
    } = data;

    try {
        const { data: insertData, error } = await supabase
            .from("sms_test_details")
            .insert([
                {
                    phone_number,
                    operator,
                    circle,
                    received_at,
                    submitted_at,
                    delivered_at,
                    campaign_id,
                    status,
                    error_code,
                    error_description,
                },
            ]);

        if (error) {
            throw new Error(`Error saving SMS details: ${error.message}`);
        }

        console.log("SMS details saved successfully:", insertData);
        return insertData;
    } catch (error) {
        console.error("Error saving SMS details:", error.message);
        throw error;
    }
};

// Function to fetch SMS additional details from the database
export const fetchSMSAdditionalDetails = async (supabase, campaign_id) => {
    const { data: smsDetailsData, error: smsDetailsError } = await supabase
        .from("sms_details")
        .select(
            `*,
            smscampaign:campaign_id(*,
                sms_template_types:template_type_id(name),
                sms_templates:template_id(name,message),
                sms_headers:header_id(name)
            )
            `
        )
        .eq("campaign_id", campaign_id);

    if (smsDetailsError) {
        throw new Error(
            error.message || "Failed to fetch SMS additional details."
        );
    }

    return { smsDetailsData };
};

// Function to format the sms details data
const formatSMSDetails = (smsDetails) => {
    const { smsDetailsData } = smsDetails;
    return smsDetailsData.map((item) => ({
        ...item,
        submitted_at: item.submitted_at
            ? formatDate(new Date(item.submitted_at))
            : "",
        received_at: item.received_at
            ? formatDate(new Date(item.received_at))
            : "",
        delivered_at: item.delivered_at
            ? formatDate(new Date(item.delivered_at))
            : "",
        date: formatDate(new Date(item.smscampaign.created_at)),
        campaign_name: item.smscampaign.campaign_name,
        header_name: item.smscampaign.sms_headers.name,
        message: item.smscampaign.sms_templates.message,
        uuid: item?.smscampaign?.uuid,
        template_type: item.smscampaign.sms_template_types.name,
    }));
};

const getTestSmsCampaignData = async (campaign_id, supabase) => {
    try {
        // Query to get data from both tables using the foreign key relationship
        const { data, error } = await supabase
            .from("sms_test_campaign")
            .select(
                `
                *
            `
            )
            .eq("id", campaign_id);
        if (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
        // Check if data is not empty
        if (data && data.length > 0) {
            // `data` will be an array of objects with the joined data
            return data[0];
        } else {
            throw new Error("No data found for the given campaign_id");
        }
    } catch (error) {
        console.error("Error retrieving data:", error.message);
        throw error;
    }
};
export {
    saveSmsDetails,
    saveTestSMSDetails,
    formatSMSDetails,
    getTestSmsCampaignData,
};
