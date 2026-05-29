// this function is used for formate rcs vi variables
export const formatRcsViVariables = (template) => {
    // Regex to match placeholders in the format {{var1}}
    const pattern = /{{(.*?)}}/g;
    // Replace the matched variable with [var1]
    return template.replace(pattern, (match, variable) => `[${variable}]`);
};

// this function is used to extract and store variables
export const extractAndStoreVariables = (template) => {
    // Regular expression to match variables inside {{...}}
    const regex = /{{(.*?)}}/g;
    const matches = [];
    let match;

    // Use regex.exec() to find all matches
    while ((match = regex.exec(template)) !== null) {
        matches.push({ name: match[0] }); // Push the full match (e.g., {{var1}})
    }

    return matches;
};
