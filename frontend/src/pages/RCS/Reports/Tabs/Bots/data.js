// Template Name | Template ID | RCS Bot ID | Created on | Status | Error Description |
// Name | Bot ID | Client ID | Bot Type | Message Type | Status | Created at

const columns = [
    { name: "Bot Name", uid: "bot_name" },

    { name: "Bot & Client ID", uid: "bot_id", sortable: true },
    { name: "Bot Type", uid: "bot_type", sortable: true },
    { name: "Message Type", uid: "message_type", sortable: true },
    { name: "Status", uid: "status", sortable: true },
    { name: "Created on", uid: "created_at", sortable: true },
    { name: "Actions", uid: "actions" },

    // { name: "Error Description", uid: "errormsg" },
    // { name: "Actions", uid: "actions" },
    // { name: "Approved under", uid: "approvedUnder", sortable: true },
    // { name: "Sender ID", uid: "senderId", sortable: true },
];

const statusOptions = [
    { name: "active", uid: "active" },
    { name: "inactive", uid: "inactive" },
];

function getRandomSenderId() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function getRandomclientId() {
    return Math.random().toString().slice(2, 8);
}

function getRandombotId() {
    const idNumber = Math.floor(Math.random() * 100) + 3; // For SMS-Campaign-#3, SMS-Campaign-#4, etc.
    return `${idNumber}`;
}

const users = [
    {
        id: 1,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "active",
        actions: "Edit | Delete",
        botName: "Marketing Bot",
        botType: "Marketing",
    },
    {
        id: 2,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "Image aspect ratio invalid",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "active",
        actions: "Edit | Delete",
        botName: "Chat Bot",
        botType: "Chat",
    },
    {
        id: 3,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "active",
        actions: "Edit | Delete",
        botName: "Educational Bot",
        botType: "Educational",
    },
    {
        id: 4,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "inactive",
        actions: "Edit | Delete",
        botName: "Chat",
        botType: "Chat",
    },
    {
        id: 5,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "inactive",
        actions: "Edit | Delete",
        botName: "Marketing Bot",
        botType: "Marketing",
    },
    {
        id: 6,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "active",
        actions: "Edit | Delete",
        botName: "Fashion",
    },
    {
        id: 7,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "Image aspect ratio invalid",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "inactive",
        actions: "Edit | Delete",
        botName: "Chat",
    },
    {
        id: 8,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "active",
        actions: "Edit | Delete",
        botName: "Marketing",
    },
    {
        id: 9,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "active",
        actions: "Edit | Delete",
        botName: "Sales",
    },
    {
        id: 10,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        clientId: getRandomclientId(),
        botId: getRandombotId(),
        errormsg: "",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "active",
        actions: "Edit | Delete",
        botName: "Chat",
    },
];

function formatDate(date) {
    const options = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
}

export { columns, users, statusOptions };
