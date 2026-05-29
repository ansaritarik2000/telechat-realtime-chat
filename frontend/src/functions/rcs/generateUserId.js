// generate random userId 6 digit
const generateUserId = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

export default generateUserId;
