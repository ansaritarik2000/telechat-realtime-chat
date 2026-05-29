// Header ID, Entity ID, Approved on, Status

const columns = [
    { name: "Header ID", uid: "header_id" },
    { name: "DLT ID", uid: "dlt_id" },
    { name: "Entity Name", uid: "entity_name", sortable: true },
    { name: "Entity ID", uid: "entity_id", sortable: true },
    { name: "Approved on", uid: "created_on", sortable: true },
    { name: "Status", uid: "status", sortable: true },

    // { name: "Approved under", uid: "approvedUnder", sortable: true },
    // { name: "Template ID", uid: "templateId", sortable: true },
    // { name: "Type", uid: "type", sortable: true },
    // { name: "Preview", uid: "actions" },
    // { name: "Sender ID", uid: "senderId", sortable: true },
    // { name: "Content", uid: "content" },
];

const statusOptions = [
    { name: "Approved", uid: "approved" },
    { name: "Rejected", uid: "rejected" },
    { name: "Pending", uid: "pending" },
];

function getRandomSenderId() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function getRandomEntityId() {
    return Math.random().toString().slice(2, 14);
}

function getRandomTemplateId() {
    const idNumber = Math.floor(Math.random() * 10) + 3; // For SMS-Campaign-#3, SMS-Campaign-#4, etc.
    return `SMS-Campaign-#${idNumber}`;
}

const users = [
    {
        id: 1,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for OTP template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "approved",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 2,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for OTP template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "rejected",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 3,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for Educational template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "approved",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 4,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for OTP template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "pending",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 5,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for Marketing template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "approved",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 6,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for Fashion template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "approved",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 7,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for OTP template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "rejected",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 8,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for Marketing template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "approved",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 9,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for Sales template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "pending",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
    },
    {
        id: 10,
        date: formatDate(new Date()),
        approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        senderId: getRandomSenderId(),
        entityId: getRandomEntityId(),
        templateId: getRandomTemplateId(),
        content: "Sample content for OTP template.",
        createdOn: formatDate(new Date()),
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        status: "approved",
        actions: "Edit | Delete",
        templateName: Math.random().toString().slice(2, 8),
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
