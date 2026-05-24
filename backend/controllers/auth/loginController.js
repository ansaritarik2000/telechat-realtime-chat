import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginController = async (req, res, supabase) => {
    try {
        const { email, phone_no, password } = req.body;

        // Check if the user exists
        const { data: user, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .or(`email.eq.${email},phone_no.eq.${phone_no}`)
            .single();

        if (fetchError) {
            console.log("fetch error", fetchError);
            return res.status(400).json({ error: "User does not exist." });
        }

        // fetch avatar type and value from "sub_account_user_details" table if role is admin or superadmin
        if (user.role === "admin" || user.role === "superadmin") {
            const { data: subaccuser, error: fetchSubAccError } = await supabase
                .from("sub_account_user_details")
                .select("avatar_value,avatar_type")
                .eq("user_id", user.id)
                .single();
            if (fetchSubAccError) {
                console.log("sub_account_user_details fetch error (non-fatal):", fetchSubAccError);
                // Non-fatal: avatar will fallback to defaults in the response
            } else if (subaccuser) {
                user.avatar_type = subaccuser.avatar_type;
                user.avatar_value = subaccuser.avatar_value;
            }
        }

        // fetch avatar type and value from "member_user_details" table if role is Admin,Viewer,Agent,Campaigner
        if (
            user.role === "Admin" ||
            user.role === "Agent" ||
            user.role === "Viewer" ||
            user.role === "Campaigner"
        ) {
            const { data: subaccuser, error: fetchSubAccError } = await supabase
                .from("member_user_details")
                .select("avatar_value,avatar_type")
                .eq("user_id", user.id)
                .single();
            if (fetchSubAccError) {
                console.log("member_user_details fetch error (non-fatal):", fetchSubAccError);
                // Non-fatal: avatar will fallback to defaults in the response
            } else if (subaccuser) {
                user.avatar_type = subaccuser.avatar_type;
                user.avatar_value = subaccuser.avatar_value;
            }
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password." });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" } // Token expires in 24 hour
        );

        // Save the token to the `users` table
        const { error: updateError } = await supabase
            .from("users")
            .update({ token }) // Save token in the database
            .eq("id", user.id); // Update the specific user by ID

        if (updateError) {
            return res.status(500).json({
                error: "Failed to save token in the database.",
            });
        }

        res.status(200).json({
            message: "Login successful!",
            status: "SUCCESS",
            token, // Send token in response
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
                first_name: user.first_name,
                last_name: user.last_name,
                avatar_type: user?.avatar_type || "character",
                avatar_value:
                    user?.avatar_value ||
                    `${user?.first_name}${user?.last_name ? " " : ""}${
                        user?.last_name
                    }`,
                role: user.role,
            },
        });
    } catch (err) {
        console.log("login error", err);
        res.status(500).json({ error: "An error occurred during login." });
    }
};
