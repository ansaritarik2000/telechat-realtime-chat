import emailValidator from "email-validator";
const allowedDomains = [".com", ".in", ".org", ".net", ".edu"];
const getValidUniqueEmails = (emailAddresses) => {
    const uniqueEmails = new Set();
    const invalidEmails = [];

    emailAddresses.forEach((email) => {
        // Validate the email
        // Validate the email and check if it ends with allowed domains
        // const isValidDomain = allowedDomains.some((domain) => formattedEmail.endsWith(domain)); && isValidDomain
        if (emailValidator.validate(email) ) {
            const formattedEmail = email.trim().toLowerCase(); // Normalize email
            uniqueEmails.add(formattedEmail);
        } else {
            invalidEmails.push(email); // Add invalid email to the array
        }
    });

    const validEmails = Array.from(uniqueEmails); // Convert the Set back to an array

    return { validEmails, invalidEmails };
};

export { getValidUniqueEmails };
