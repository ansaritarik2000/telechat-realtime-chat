// components/uploads/utils.js

export const fileLimit = {
    image: 5 * 1024 * 1024, // 5MB
    video: 50 * 1024 * 1024, // 50MB
  };
  
  export const validateFile = (file, type) => {
    if (!file) return { isValid: false, message: "No file selected" };
  
    const allowedTypes =
      type === "image" ? ["image/jpeg", "image/png"] : ["video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, message: "Unsupported file type" };
    }
  
    if (file.size > fileLimit[type]) {
      return { isValid: false, message: `File size exceeds ${fileLimit[type]} bytes` };
    }
  
    return { isValid: true };
  };
  

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