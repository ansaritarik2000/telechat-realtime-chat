// this controller function is used for get users controller
export const getCreatorUsersController = async (req, res, supabase) => {
    try {
        const { id: creator_id } = req.user; // Get the creator ID from the authenticated user

        console.log("creator id", creator_id);

        // Fetch users created by the specified creator with a join to fetch roles
        const { data: members, error } = await supabase
            .from("member_user_details")
            .select(
                `
                user_id,
                users:user_id(id, role)
                `
            )
            .eq("creator_id", creator_id)
            .neq("status", "trash");
        if (error) {
            return res.status(500).send({
                status: "ERROR",
                message: error.message || "Failed to retrieve creator's users.",
            });
        }

        if (!members || members.length === 0) {
            return res.status(404).send({
                status: "SUCCESS",
                data: {
                    totalUsers: 0,
                    rolePercentages: {
                        Admin: 0,
                        Campaigner: 0,
                        Viewer: 0,
                        Agent: 0,
                    },
                    roleTotals: {
                        Admin: 0,
                        Campaigner: 0,
                        Viewer: 0,
                        Agent: 0,
                    },
                },
                message: "No users found for this creator.",
            });
        }

        // Extract roles from the joined data
        const roles = members.map((member) => member.users.role);

        // Calculate the total number of users
        const totalUsers = roles.length;

        // Calculate the count of each role
        const roleCounts = roles.reduce((acc, role) => {
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        // Calculate the percentage for each role
        const rolePercentages = {
            Admin: (((roleCounts.Admin || 0) / totalUsers) * 100).toFixed(2),
            Campaigner: (
                ((roleCounts.Campaigner || 0) / totalUsers) *
                100
            ).toFixed(2),
            Viewer: (((roleCounts.Viewer || 0) / totalUsers) * 100).toFixed(2),
            Agent: (((roleCounts.Agent || 0) / totalUsers) * 100).toFixed(2),
        };

        // each role totals
        const roleTotals = {
            Admin: roleCounts.Admin || 0,
            Campaigner: roleCounts.Campaigner || 0,
            Viewer: roleCounts.Viewer || 0,
            Agent: roleCounts.Agent || 0,
        };

        res.status(200).send({
            status: "SUCCESS",
            data: {
                totalUsers,
                rolePercentages,
                roleTotals,
            },
            message: "Creator user data retrieved successfully.",
        });
    } catch (error) {
        console.error("Failed to retrieve creator user data:", error);
        res.status(500).send({
            status: "ERROR",
            message: error.message || "Failed to retrieve creator user data.",
        });
    }
};
