import generateUserId from "../rcs/generateUserId";

// this function generates campaign name
const generateSMSCampaignID = () => {
    const now = new Date();
    const campaignId = generateUserId();
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const time = now
        .toLocaleString("en-US", options)
        .toUpperCase()
        .replace(/\s/g, "");

    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();

    return {
        campaingName: `${campaignId}-SMS Campaign (${day} ${month} ${year} ${time})`,
        campaignId: campaignId,
    };
};

export default generateSMSCampaignID;
