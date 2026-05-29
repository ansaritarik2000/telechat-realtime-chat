// this function is used to generate whatsapp campaign name

export const generateWhatsappCampaignName = () => {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    const now = new Date();

    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const time = now
        .toLocaleString("en-US", options)
        .toUpperCase()
        .replace(/\s/g, "");

    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();

    return {campaignName:`${randomSixDigits}-WhatsApp Campaign (${day} ${month} ${year} ${time})`, campaignId:randomSixDigits};
};
