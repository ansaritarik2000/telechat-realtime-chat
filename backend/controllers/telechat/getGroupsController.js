export const getGroupsController = async (req, res, supabase) => {
    try {
        const { data, error } = await supabase
            .from("groups")
            .select("*");

        if (error) throw error;

        res.status(200).json({
            status: "SUCCESS",
            groups: data,
        });
    } catch (error) {
        console.error("Error in getGroupsController:", error);
        res.status(500).json({
            status: "FAILED",
            message: "Internal server error",
        });
    }
};
