import jwt from 'jsonwebtoken'

import dotenv from 'dotenv';
import bcrypt from "bcrypt"
dotenv.config();
import { SESClient,SendEmailCommand} from "@aws-sdk/client-ses";
// Configure AWS SES
 const sesClient = new SESClient({
    region:  process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // or your hardcoded value (not recommended)
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // or your hardcoded value (not recommended)
    }
  });
export const forgatePasswordController = async(req,res,supabase)=>{
    const { email } = req.body;
    
    try {
      // Check if user exists
      const { data: users, error } = await supabase.from("users").select("*").eq("email", email);
      if (error || users.length === 0) return res.status(404).send("User not found");
      
      // Create a reset token
      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const resetLink = `http://localhost:5173/auth/reset-password?token=${resetToken}`;
  
      // Send email
      const params = {
        Destination: {
          ToAddresses:[email],
        },
        Message: { 
          Body: {
            Html: { Data: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`},
          }, 
          Subject: { Data:"Reset Your Password"},
        },
        Source: process.env.EMAIL_USER
       // Replace with your verified sender email address
    };
      const data = await sesClient.send(new SendEmailCommand(params));
      console.log("Email sent successfully:", data);
      res.status(200).send(`Password ${resetLink} sent`);
    } catch (err) {
      console.log(err)
      res.status(500).send({message:"Error sending email",error: err.message});
    }
}


export const resetPassword = async(req,res,supabase)=>{
    const { password, confirmPassword } = req.body;
    const { token } = req.query;
    console.log("Received token:", token);
    if (password !== confirmPassword) return res.status(400).send("Passwords do not match");
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
        if (decoded.exp < currentTimestamp) {
          return res.status(401).send("Expired token");
        }
    
        const { email } = decoded;
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
       console.log(hashedPassword)
      // Update password in Supabase
      const { error } = await supabase.from("users").update({ password: hashedPassword }).eq("email", email);
      if (error) return res.status(500).send("Error resetting password");
  
      res.status(200).send("Password reset successfully");
    } catch (err) {
      res.status(401).send("Invalid or expired token");
    }
}