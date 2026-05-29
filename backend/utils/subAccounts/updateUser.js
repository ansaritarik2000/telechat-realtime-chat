import bcrypt from "bcrypt";

// Function to update an existing user in the users table
export const updateUser = async (
    id,
    {
        email,
        password,
        first_name,
        last_name,
        phone_no,
        country_dial_code,
        role,
    },
    supabase
) => {
    try {
        // Check if the user exists by ID
        const { data: userExists, error: userCheckError } = await supabase
            .from("users")
            .select("id")
            .eq("id", id)
            .single();

        if (userCheckError) {
            throw new Error("User with the specified ID does not exist.");
        }

        // Check if the email or phone number is already used by another user
        if (email || phone_no) {
            const filters = [];
            if (email) filters.push(`email.eq.${email}`);
            if (phone_no) filters.push(`phone_no.eq.${phone_no}`);
            const { data: conflictUser, error: conflictError } = await supabase
                .from("users")
                .select("id")
                .or(filters.join(","))
                .neq("id", id)
                .single();

            if (conflictError && conflictError.code !== "PGRST116") {
                throw new Error("Failed to check for conflicting user.");
            }

            if (conflictUser) {
                throw new Error(
                    "Another user with this email or phone number already exists."
                );
            }
        }

        // Prepare updated fields
        const updatedFields = {};
        if (email) updatedFields.email = email;
        if (first_name) updatedFields.first_name = first_name;
        if (last_name) updatedFields.last_name = last_name;
        if (phone_no) updatedFields.phone_no = phone_no;
        if (country_dial_code)
            updatedFields.country_dial_code = country_dial_code;

        // Hash the password if it is being updated
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        }
        if (role) {
            updatedFields.role = role;
        }

        // Update the user in the users table
        const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update(updatedFields)
            .eq("id", id)
            .select("id")
            .single();

        if (updateError) {
            console.log("updateError", updateError);
            throw new Error("Failed to update the user.");
        }

        return updatedUser;
    } catch (err) {
        console.error("Error updating user:", err.message);
        throw err;
    }
};
