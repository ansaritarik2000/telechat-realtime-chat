import { saveRcsDetails, saveTestRcsDetails } from "./rcsDetailsUtils.js";

// This function for save rcs campaign data like schedule time, batchsie, and interval in rcscampaign table
const saveCampaign = async (supabase, campaignData) => {
    const {
        template_id,
        template_type_id,
        bot_id,
        campaign_name,
        campaign_date,
        batch_size,
        interval,
    } = campaignData;

    const { data, error } = await supabase
        .from("rcscampaign")
        .insert([
            {
                template_id,
                template_type_id,
                bot_id,
                campaign_name,
                campaign_date,
                batch_size,
                interval,
            },
        ])
        .select("id")
        .single(); // We assume there is only one record

    if (error) throw error;

    return data.id;
};

// this function save test rcs campaign
const saveTestCampaign = async (supabase, campaignData) => {
    const {
        template_id,
        template_type_id,
        bot_id,
        campaign_name,
        campaign_date,
        batch_size,
        interval,
    } = campaignData;

    const { data, error } = await supabase
        .from("rcs_test_campaign")
        .insert([
            {
                template_id,
                template_type_id,
                bot_id,
                campaign_name,
                campaign_date,
                batch_size,
                interval,
            },
        ])
        .select("id")
        .single(); // We assume there is only one record

    if (error) throw error;
    return data.id;
};

//  this function save phone_numbers, campaing_id, user_id and status sendRCS table
const saveRCS = async (supabase, rcsData) => {
    const { phone_numbers, campaign_id, user_id, campaign_date } = rcsData;

    const { data, error } = await supabase.from("sendRCS").insert([
        {
            phone_numbers,
            campaign_id,
            user_id,
            status: campaign_date ? "scheduled" : "pending", // this is satus updateing if campaign_date available then scheduled
        },
    ]);

    if (error) throw error;

    return data;
};

//  this function save test campagins phone_numbers, campaign_id in sendTestRCS table
const saveTestRCS = async (supabase, rcsData) => {
    const { phone_numbers, campaign_id, user_id } = rcsData;

    const { data, error } = await supabase.from("sendTestRCS").insert([
        {
            phone_numbers,
            campaign_id,
            user_id,
        },
    ]);

    if (error) throw error;

    return data;
};

//   this function are saving all mobile numbers with campaign id
const saveAllMobileNumbers = async (supabase, allmobileCampaignData) => {
    const { phone_numbers, campaign_id } = allmobileCampaignData;
    const { data, error } = await supabase.from("rcs_phone_campaigns").insert([
        {
            phone_numbers,
            campaign_id,
        },
    ]);
    if (error) throw error;
    return data;
};

//   this function are saving all mobile numbers with  test campaign id
const saveAllTestMobileNumbers = async (supabase, allmobileCampaignData) => {
    const { phone_numbers, campaign_id } = allmobileCampaignData;
    const { data, error } = await supabase
        .from("rcs_test_phone_campaigns")
        .insert([
            {
                phone_numbers,
                campaign_id,
            },
        ]);
    if (error) throw error;
    return data;
};

// save invalid mobile  number in rcs details
const saveInvalidPhoneNumber = async (supabase, invalidMobileCampaignData) => {
    const { invalidPhoneNumbers = [], campaign_id } = invalidMobileCampaignData;
    // this are saving rcs details
    invalidPhoneNumbers?.forEach(async (phone, index) => {
        if (phone) {
            const rcsdata = {
                country: "INDIA", // default india
                phone_number: phone,
                submitted_at: new Date(), // current date
                campaign_id: campaign_id,
                status: "failed",
            };
            return await saveRcsDetails(supabase, rcsdata);
        }
    });
};

// this function is used for add non rcs device in rcs details
const saveNonRcsDevice = async (supabase, nonRcsDeviceData) => {
    const {
        rcsNotEnabled = [],
        campaign_id,
        message_id,
        status = "failed",
    } = nonRcsDeviceData;
    // this are saving rcs details
    rcsNotEnabled?.forEach(async (phone, index) => {
        if (phone) {
            const rcsdata = {
                country: "INDIA", // default india
                phone_number: phone,
                device: "NON-RCS",
                submitted_at: new Date(), // current date
                campaign_id: campaign_id,
                status: status,
                message_id: message_id,
            };

            return await saveRcsDetails(supabase, rcsdata);
        }
    });
};

// Function to update RCS and Non-RCS device arrays in sendRCS table
export const updateRcsNonRcsDeviceTotal = async (
    rcsDeviceArray = [],
    nonRcsDeviceArray = [],
    campaign_id,
    supabase
) => {
    try {
        // Step 1: Fetch existing values
        const { data: existingData, error: fetchError } = await supabase
            .from("sendRCS")
            .select("rcs_devices, nonrcs_devices")
            .eq("campaign_id", campaign_id)
            .single();

        if (fetchError) throw fetchError;

        // Step 2: Calculate updated arrays
        const updatedRcsDevices = [
            ...(existingData.rcs_devices || []),
            ...rcsDeviceArray,
        ];
        const updatedNonRcsDevices = [
            ...(existingData.nonrcs_devices || []),
            ...nonRcsDeviceArray,
        ];

        // Step 3: Update with new arrays
        const { data: updatedData, error: updateError } = await supabase
            .from("sendRCS")
            .update({
                rcs_devices: updatedRcsDevices,
                nonrcs_devices: updatedNonRcsDevices,
            })
            .eq("campaign_id", campaign_id);

        if (updateError) throw updateError;

        return updatedData;
    } catch (error) {
        console.error("Error updating RCS and non-RCS devices:", error);
        throw error;
    }
};

// save invalid mobile  number in rcs details
const saveTestInvalidPhoneNumber = async (
    supabase,
    invalidMobileCampaignData
) => {
    const { invalidPhoneNumbers = [], campaign_id } = invalidMobileCampaignData;
    // this are saving rcs details
    invalidPhoneNumbers?.forEach(async (phone, index) => {
        if (phone) {
            const rcsdata = {
                country: "INDIA", // default india
                phone_number: phone,
                submitted_at: new Date(), // current date
                campaign_id: campaign_id,
                status: "failed",
            };
            return await saveTestRcsDetails(supabase, rcsdata);
        }
    });
};

export {
    saveCampaign,
    saveTestCampaign,
    saveRCS,
    saveTestRCS,
    saveAllMobileNumbers,
    saveAllTestMobileNumbers,
    saveInvalidPhoneNumber,
    saveTestInvalidPhoneNumber,
    saveNonRcsDevice,
};
