// Utility to extract variables from the text
export const extractVariables = (message) => {
    const regex = /\{\{(.*?)\}\}/g;
    let variables = [];
    let match;

    while ((match = regex.exec(message)) !== null) {
        variables.push(`{{${match[1]}}}`);
    }
    return variables;
};
