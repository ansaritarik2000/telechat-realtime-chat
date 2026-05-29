import { saveSmsDetails, saveTestSMSDetails } from "./smsDetailsUtils.js";

// This function for save sms campaign data like schedule time, batchsie, and interval in smscampaign table

const saveCampaign = async (supabase, campaignData) => {
    const {
        template_id,
        template_type_id,
        header_id,
        campaign_name,
        campaign_date,
        batch_size,
        interval,
        is_flash_sms,
        phone_numbers,
        validPhoneNumbers,
        user_id,
        campaign_id,
    } = campaignData;

    const { data, error } = await supabase
        .from("smscampaign")
        .insert([
            {
                template_id,
                template_type_id,
                header_id,
                campaign_name,
                campaign_date,
                batch_size,
                interval,
                is_flash_sms,
                all_phone_numbers: phone_numbers,
                user_id,
                campaign_id,
                valid_phone_numbers: validPhoneNumbers,
                status: campaign_date ? "scheduled" : "pending", // this is satus updateing if campaign_date available then scheduled
            },
        ])
        .select("id")
        .single(); // We assume there is only one record

    if (error) throw error;

    return data.id;
};

// this function save test sms campaign
const saveTestSmsCampaign = async (supabase, campaignData) => {
    const {
        template_id,
        template_type_id,
        header_id,
        campaign_name,
        campaign_date,
        batch_size,
        interval,
        phone_numbers,
        user_id,
        validPhoneNumbers,
        campaign_id,
    } = campaignData;

    const { data, error } = await supabase
        .from("sms_test_campaign")
        .insert([
            {
                template_id,
                template_type_id,
                header_id,
                campaign_name,
                campaign_date,
                batch_size,
                interval,
                all_phone_numbers: phone_numbers,
                user_id,
                valid_phone_numbers: validPhoneNumbers,
                campaign_id,
            },
        ])
        .select("id")
        .single(); // We assume there is only one record

    if (error) throw error;
    return data.id;
};

// save invalid mobile  number in sms_additional_details
const saveInvalidPhoneNumber = async (supabase, invalidMobileCampaignData) => {
    const { invalidPhoneNumbers = [], campaign_id } = invalidMobileCampaignData;
    // this are saving sms_additional_details
    invalidPhoneNumbers?.forEach(async (phone, index) => {
        if (phone) {
            const smsdata = {
                country: "INDIA", // default india
                phone_number: phone,
                submitted_at: new Date(), // current date
                received_at: new Date(), // current date
                operator: "Jio", // hardcoded this will replace
                circle: "Madhya Pradesh", // hardcoded this will replace
                campaign_id: campaign_id,
                status: "failed",
                error_code: "116",
                error_description: "Invalid mobile number.",
            };
            return await saveSmsDetails(supabase, smsdata);
        }
    });
};

// save invalid mobile  number in sms_test_details
const saveTestSmsInvalidPhoneNumber = async (
    supabase,
    invalidMobileCampaignData
) => {
    const { invalidPhoneNumbers = [], campaign_id } = invalidMobileCampaignData;
    // this are saving sms details
    invalidPhoneNumbers?.forEach(async (phone, index) => {
        if (phone) {
            const smsdata = {
                country: "INDIA", // default india
                phone_number: phone,
                submitted_at: new Date(), // current date
                campaign_id: campaign_id,
                status: "failed",
            };
            return await saveTestSMSDetails(supabase, smsdata);
        }
    });
};

export {
    saveCampaign,
    saveInvalidPhoneNumber,
    saveTestSmsCampaign,
    saveTestSmsInvalidPhoneNumber,
};
