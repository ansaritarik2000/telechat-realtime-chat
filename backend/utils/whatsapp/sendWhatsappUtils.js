import {
    saveWhatsappDetails,
    saveTestWhatsappDetails,
} from "./whatsappDetailsUtils.js";

// This function for save whatsapp campaign data like schedule time, batchsie, and interval in whatsappcampaign table
const saveCampaign = async (supabase, campaignData) => {
    const {
        template_id,
        template_type_id,
        campaign_name,
        campaign_date,
        batch_size,
        interval,
    } = campaignData;

    const { data, error } = await supabase
        .from("whatsapp_campaign")
        .insert([
            {
                template_id,
                template_type_id,
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

// this function save test whatsapp campaign
const saveTestCampaign = async (supabase, campaignData) => {
    const {
        template_id,
        template_type_id,
        campaign_name,
        campaign_date,
        batch_size,
        interval,
    } = campaignData;

    const { data, error } = await supabase
        .from("whatsapp_test_campaign")
        .insert([
            {
                template_id,
                template_type_id,
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

//  this function save phone_numbers, campaing_id, user_id and status sendWhatsApp table
const saveWhatsApp = async (supabase, whatsappData) => {
    const { phone_numbers, campaign_id, user_id, waba_id, campaign_date } =
        whatsappData;

    const { data, error } = await supabase.from("sendWhatsApp").insert([
        {
            phone_numbers,
            campaign_id,
            user_id,
            waba_id,
            status: campaign_date ? "scheduled" : "pending", // this is satus updateing if campaign_date available then scheduled
        },
    ]);

    if (error) throw error;

    return data;
};

//  this function save test campagins phone_numbers, campaign_id in sendTestWhatsApp table
const saveTestWhatsApp = async (supabase, whatsappData) => {
    const { phone_numbers, campaign_id, user_id, waba_id } = whatsappData;

    const { data, error } = await supabase.from("sendTestWhatsApp").insert([
        {
            phone_numbers,
            campaign_id,
            user_id,
            waba_id,
        },
    ]);

    if (error) throw error;

    return data;
};

//   this function are saving all mobile numbers with campaign id
const saveAllMobileNumbers = async (supabase, allmobileCampaignData) => {
    const { phone_numbers, campaign_id } = allmobileCampaignData;
    const { data, error } = await supabase
        .from("whatsapp_phone_campaigns")
        .insert([
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
        .from("whatsapp_test_phone_campaigns")
        .insert([
            {
                phone_numbers,
                campaign_id,
            },
        ]);
    if (error) throw error;
    return data;
};

// save invalid mobile  number in whataspp details
const saveInvalidPhoneNumber = async (supabase, invalidMobileCampaignData) => {
    const { invalidPhoneNumbers = [], campaign_id } = invalidMobileCampaignData;
    // this are saving whatsapp details
    invalidPhoneNumbers?.forEach(async (phone, index) => {
        if (phone) {
            const whatsappdata = {
                country: "INDIA", // default india
                phone_number: phone,
                submitted_at: new Date(), // current date
                campaign_id: campaign_id,
                status: "failed",
            };
            return await saveWhatsappDetails(supabase, whatsappdata);
        }
    });
};

// save invalid mobile  number in whatsapp details
const saveTestInvalidPhoneNumber = async (
    supabase,
    invalidMobileCampaignData
) => {
    const { invalidPhoneNumbers = [], campaign_id } = invalidMobileCampaignData;
    // this are saving whatsapp details
    invalidPhoneNumbers?.forEach(async (phone, index) => {
        if (phone) {
            const whatsappdata = {
                country: "INDIA", // default india
                phone_number: phone,
                submitted_at: new Date(), // current date
                campaign_id: campaign_id,
                status: "failed",
            };
            return await saveTestWhatsappDetails(supabase, whatsappdata);
        }
    });
};

export {
    saveCampaign,
    saveTestCampaign,
    saveWhatsApp,
    saveTestWhatsApp,
    saveAllMobileNumbers,
    saveAllTestMobileNumbers,
    saveInvalidPhoneNumber,
    saveTestInvalidPhoneNumber,
};
