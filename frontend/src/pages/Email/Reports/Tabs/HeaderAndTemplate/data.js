// Template Name | Approved under | Sender ID | Entity ID | Template ID | Content | Created on | Type |
//  Status (Approved, Pending, Rejected) Actions ( View & Delete)

const columns = [
  { name: "Template Name", uid: "templateName" },
  { name: "Approved under", uid: "approvedUnder", sortable: true },
  { name: "Sender ID", uid: "senderId", sortable: true },
  { name: "Entity ID", uid: "entityId", sortable: true },
  { name: "Template ID", uid: "templateId", sortable: true },
  { name: "Content", uid: "content" },
  { name: "Created on", uid: "createdOn", sortable: true },
  { name: "Type", uid: "type", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Actions", uid: "actions" },
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
    templateName: "Marketing",
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
    templateName: "OTP",
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
    templateName: "Educational",
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
    templateName: "OTP",
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
    templateName: "Marketing",
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
    templateName: "Fashion",
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
    templateName: "OTP",
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
    templateName: "Marketing",
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
    templateName: "Sales",
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
    templateName: "OTP",
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
