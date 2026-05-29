// this function calculate message count

export const calculateMessageCount = (charCount) => {
    if (charCount <= 120) {
        return 1;
    } else if (charCount <= 240) {
        return 2;
    } else if (charCount <= 360) {
        return 3;
    } else {
        // For messages longer than 360 characters
        return Math.ceil(charCount / 120); // Each additional 120 characters count as another message
    }
};
