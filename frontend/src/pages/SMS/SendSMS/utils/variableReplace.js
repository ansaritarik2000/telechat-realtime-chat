// preview for template variable message
export const replaceMessageVars = (template, validRows) => {
    const updatedMessages = validRows.map((row) => {
        let message = template.message;
        // Loop through message_vars and replace with value
        template.message_vars.forEach((variable) => {
            message = message.replace(variable.name, row[variable.value]);
        });

        // Return the updated message
        return {
            phone_number: row.phonenumber,
            message: message,
        };
    });

    return updatedMessages;
};
