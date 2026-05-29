import bcrypt from "bcrypt";

// Function to create a new user in the users table
export const createUser = async (
    email,
    password,
    first_name,
    last_name,
    phone_no,
    country_dial_code,
    role,
    supabase
) => {
    try {
        // Check if the email or phone number already exists
        const { data: existingUser, error: checkError } = await supabase
            .from("users")
            .select("id")
            .or(`email.eq.${email},phone_no.eq.${phone_no}`)
            .single();

        if (checkError && checkError.code !== "PGRST116") {
            // If there was an error other than "no rows found," throw it
            throw new Error("Failed to check for existing user.");
        }

        if (existingUser) {
            throw new Error(
                "User with this email or phone number already exists."
            );
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("country_dial_code", country_dial_code);

        // Insert the new user into the users table
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
                {
                    email,
                    password: hashedPassword,
                    first_name,
                    last_name,
                    phone_no,
                    country_dial_code,
                    role,
                },
            ])
            .select("id")
            .single();

        if (insertError) {
            throw new Error("Failed to create a new user.");
        }

        return newUser;
    } catch (err) {
        console.error("Error creating user:", err.message);
        throw err;
    }
};
