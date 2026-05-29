import { formatDate } from "../dateformat.js";
import { fetchWalletDataAndDeductAmount } from "../wallet/deductWalletUtils.js";

// this function is used to get credit and history
export const getRcsCreditHistory = async (
    req,
    res,
    supabase,
    user_id,
    limit = 5,
    offset = 0,
    columns = "*",
    start_date,
    end_date,
    search,
    status
) => {
    // Convert offset and limit to numbers
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);

    try {
        let query = supabase
            .from("rcs_credit_history")
            .select(
                `*, 
                users:user_id(id,rcs_service_pricing(rcs_text_credits,rcs_multimedia_credits,global_credits_billing_on)),
                rcscampaign:campaign_id(*, 
                    rcs_templates(name,template_type_id,rcs_template_types(name)), 
                    rcs_bots(name),
                    rcs_phone_campaigns(phone_numbers),
                    sendRCS(phone_numbers,status),
                    rcs_details(phone_number,status)
                )`,
                { count: "exact" }
            )
            .eq("user_id", user_id)
            .order("id", { ascending: false });

        if (start_date && end_date) {
            query = query
                .gte("created_at", start_date)
                .lte("created_at", `${end_date}T23:59:59`);
        }

        if (status && status !== "all") {
            if (Array.isArray(status)) {
                query = query.in("status", status); // Filtering based on multiple statuses
            } else {
                query = query.eq("status", status); // Filtering based on a single status
            }
        }

        // Execute the query
        const { data, error, count } = await query;

        if (error) {
            throw new Error(error.message);
        }

        let filteredData = data;

        // here iam search on use of filter method because supabase doesn't support search on joined table
        if (search) {
            filteredData = data.filter((item) =>
                item.rcscampaign?.campaign_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        // Get total filtered records count
        const totalRecords = filteredData.length;

        // Apply pagination
        filteredData = filteredData.slice(offsetNum, offsetNum + limitNum);

        // Process each entry for total submitted, delivered numbers & total cost
        const processedData = await Promise.all(
            filteredData.map(async (entry) => {
                const campaign = entry.rcscampaign || {};
                const phoneCampaigns = campaign.rcs_phone_campaigns || {};
                const sendRCS = campaign.sendRCS || [];
                const rcsDetails = campaign.rcs_details || [];

                // Check if any sendRCS entry has status "completed"
                const isCompleted = sendRCS.some(
                    (s) => s.status === "completed"
                );

                const billingCompleted = entry.billing_completed;

                // Get pricing details from `users.rcs_service_pricing` or fallback to `rcs_credit_history`
                const pricing = entry.users?.rcs_service_pricing?.[0] || {};
                const rcsTextPrice =
                    pricing.rcs_text_credits ?? entry.rcs_text_credits;
                const rcsRichPrice =
                    pricing.rcs_multimedia_credits ??
                    entry.rcs_multimedia_credits;
                const billingOn = pricing.global_credits_billing_on;

                // Initialize values as empty if not completed
                let totalSubmitted = "";
                let totalDelivered = "";
                let totalCost = "";

                if (isCompleted) {
                    // Total submitted numbers
                    totalSubmitted = phoneCampaigns.phone_numbers
                        ? phoneCampaigns.phone_numbers.length
                        : 0;

                    // Total delivered numbers
                    if (billingOn === "delivery") {
                        totalDelivered = rcsDetails.filter(
                            (detail) => detail.status === "delivered"
                        ).length;
                    } else {
                        totalDelivered =
                            sendRCS.length > 0
                                ? sendRCS[0].phone_numbers.length
                                : 0;
                    }

                    // Determine total cost based on template type
                    const templateType =
                        campaign.rcs_templates?.rcs_template_types?.name;
                    const costPerMessage =
                        templateType === "Text" ? rcsTextPrice : rcsRichPrice;
                    // total cost
                    totalCost = (totalDelivered * costPerMessage).toFixed(2);

                    filteredData.map(async (entry) => {
                        const campaign = entry.rcscampaign || {};
                        const phoneCampaigns =
                            campaign.rcs_phone_campaigns || {};
                        const sendRCS = campaign.sendRCS || [];
                        const rcsDetails = campaign.rcs_details || [];

                        // Check if any sendRCS entry has status "completed"
                        const isCompleted = sendRCS.some(
                            (s) => s.status === "completed"
                        );

                        const billingCompleted = entry.billing_completed;

                        // Get pricing details from `users.rcs_service_pricing` or fallback to `rcs_credit_history`
                        const pricing =
                            entry.users?.rcs_service_pricing?.[0] || {};
                        const rcsTextPrice =
                            pricing.rcs_text_credits ?? entry.rcs_text_credits;
                        const rcsRichPrice =
                            pricing.rcs_multimedia_credits ??
                            entry.rcs_multimedia_credits;
                        const billingOn = pricing.global_credits_billing_on;

                        // Initialize values as empty if not completed
                        let totalSubmitted = "";
                        let totalDelivered = "";
                        let totalCost = "";

                        if (isCompleted) {
                            // Total submitted numbers
                            totalSubmitted = phoneCampaigns.phone_numbers
                                ? phoneCampaigns.phone_numbers.length
                                : 0;

                            // Total delivered numbers
                            if (billingOn === "delivery") {
                                totalDelivered = rcsDetails.filter(
                                    (detail) => detail.status === "delivered"
                                ).length;
                            } else {
                                totalDelivered =
                                    sendRCS.length > 0
                                        ? sendRCS[0].phone_numbers.length
                                        : 0;
                            }

                            // Determine total cost based on template type
                            const templateType =
                                campaign.rcs_templates?.rcs_template_types
                                    ?.name;
                            const costPerMessage =
                                templateType === "Text"
                                    ? rcsTextPrice
                                    : rcsRichPrice;

                            // Total cost
                            totalCost = (
                                totalDelivered * costPerMessage
                            ).toFixed(2);

                            // Deduct from wallet if not already billed
                            if (
                                !billingCompleted &&
                                parseFloat(totalCost) > 0
                            ) {
                                try {
                                    await fetchWalletDataAndDeductAmount({
                                        userId: user_id,
                                        amountToDeduct: parseFloat(totalCost),
                                        campaignId:
                                            entry.rcscampaign?.campaign_id,
                                        templateType:
                                            entry.rcscampaign?.rcs_templates
                                                ?.rcs_template_types?.name,
                                        submittedCredits: entry.total_submitted,
                                        deliveredCredits: entry.total_delivered,
                                        supabase,
                                    });

                                    // Mark billing as completed
                                    await supabase
                                        .from("rcs_credit_history")
                                        .update({ billing_completed: true })
                                        .eq("id", entry.id);
                                } catch (walletError) {
                                    console.error(
                                        `Failed to deduct wallet balance for user ${user_id}:`,
                                        walletError.message
                                    );
                                }
                            }
                        }

                        return {
                            ...entry,
                            rcs_text_message_price: rcsTextPrice,
                            rcs_rich_card_carousel_price: rcsRichPrice,
                            global_credits_billing_on: billingOn,
                            total_submitted: totalSubmitted,
                            total_delivered: totalDelivered,
                            total_cost: isNaN(totalCost) ? "" : totalCost,
                        };
                    });
                }

                return {
                    ...entry,
                    rcs_text_message_price: rcsTextPrice,
                    rcs_rich_card_carousel_price: rcsRichPrice,
                    global_credits_billing_on: billingOn,
                    total_submitted: totalSubmitted,
                    total_delivered: totalDelivered,
                    total_cost: isNaN(totalCost) ? "" : totalCost,
                };
            })
        );

        return { records: processedData, totalRecords: totalRecords };
    } catch (error) {
        console.error("Error fetching RCS credit history:", error.message);
        throw new Error("Error fetching RCS credit history.");
    }
};

// format rcs credit history data
export const formatRcsCreditHistoryData = (data) => {
    return data.map((record) => {
        return {
            name: record.rcscampaign.campaign_name, // Campaign Name
            created_at: record.created_at
                ? formatDate(new Date(record.created_at))
                : "", // Date & Time (Formatted)
            bot_name: record.rcscampaign.rcs_bots.name, // Bot Name
            type: record.rcscampaign.rcs_templates.rcs_template_types.name, // Template Type
            status: record.status, // Status
            submitted_credits: record.total_submitted, // Submitted Credits
            delivered_credits: record.total_delivered, // Delivered Credits
            cost: record.total_cost, // Cost (Formatted with $)
        };
    });
};
