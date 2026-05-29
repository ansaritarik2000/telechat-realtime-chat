const generatedNumbers = new Set();
export const generateUniqueId = () => {
    let number = "";

    // Keep generating numbers until we find a unique one
    while (number === "" || generatedNumbers.has(number)) {
        number = Math.floor(10000 + Math.random() * 90000).toString(); // Generates a random 5-digit number
    }

    generatedNumbers.add(number);
    return number;
};
