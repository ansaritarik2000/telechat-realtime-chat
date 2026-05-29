import { saveTeleCreditsUsesHistory } from "../creditAndHistory/saveTeleCreditsUsesHistory.js";

// This function fetches the wallet data using the user_id and deducts the amount from the wallet balance.
const fetchWalletDataAndDeductAmount = async ({
    userId,
    campaignId,
    templateType,
    submittedCredits,
    deliveredCredits,
    amountToDeduct,
    supabase,
}) => {
    try {
        // Fetch wallet data using user_id
        const { data: walletData, error } = await supabase
            .from("wallets")
            .select("*")
            .eq("user_id", userId)
            .single();
        if (error) {
            throw new Error(error.message);
        }

        if (!walletData) {
            throw new Error("Wallet data not found");
        }

        // Check if the wallet has sufficient balance
        if (walletData?.wallet_balance < amountToDeduct) {
            throw new Error("Insufficient balance");
        }

        // Deduct the amount from the wallet balance
        walletData.wallet_balance -= amountToDeduct;

        const { data: updatedWalletData, error: updateError } = await supabase
            .from("wallets")
            .update({ wallet_balance: walletData.wallet_balance })
            .eq("user_id", userId)
            .select()
            .single();
        if (updateError) {
            throw new Error(updateError.message);
        }

        // save telecredits uses history

        await saveTeleCreditsUsesHistory({
            data: [
                {
                    user_id: userId,
                    campaign_id: campaignId,
                    service: "RCS",
                    type: templateType,
                    subitted_credits: submittedCredits,
                    delivered_credits: deliveredCredits,
                    cost: amountToDeduct,
                },
            ],
            supabase,
        });

        return walletData;
    } catch (error) {
        console.error(
            "Error in fetching wallet data and deducting amount:",
            error
        );
        throw error;
    }
};

export { fetchWalletDataAndDeductAmount };
