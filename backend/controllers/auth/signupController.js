import bcrypt from "bcrypt";

export const signupController = async (req, res, supabase) => {
  try {
    const { first_name, last_name, phone_no, role, email, password } = req.body;

    // Check if email already exists in the database
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // Supabase returns PGRST116 if no data is found
      console.log("CHECK ERROR:", checkError); // ye add karo

      return res.status(500).json({ error: "Error checking user existence." });
    }

    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user with hashed password into the database
    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          first_name,
          last_name,
          phone_no,
          role,
        },
      ])
      .select("id, email, created_at")
      .single();

    if (insertError) {
      console.log("user createion error", insertError);
      return res.status(500).json({ error: "Error creating user." });
    }

    res.status(201).json({ message: "Signup successful!", user });
  } catch (err) {
    console.log("user createion error", err);
    res.status(500).json({ error: "An error occurred during signup." });
  }
};
