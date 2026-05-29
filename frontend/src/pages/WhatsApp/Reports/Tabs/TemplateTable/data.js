// Template Name | Approved under | Sender ID | Entity ID | Template ID | Content | Created on | Type |
//  Status (Approved, Pending, Rejected) Actions ( View & Delete)

// Template Name, Template ID, Category , Language, Approved on, Status, View (Icon)

const columns = [
  { name: "Template Name", uid: "templateName" },
  { name: "Template Type", uid: "templateType", sortable: true },
  { name: "Template ID", uid: "id", sortable: true },
  { name: "Category", uid: "selectedCategory", sortable: false },
  { name: "Language", uid: "selectedCountryLable" },
  { name: "Approved on", uid: "created_at", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Preview", uid: "actions" },

  // { name: "Approved under", uid: "approvedUnder", sortable: true },
  // { name: "Sender ID", uid: "senderId", sortable: true },
  // { name: "Entity ID", uid: "entityId", sortable: true },
  // { name: "Type", uid: "type", sortable: true },
];

const statusOptions = [
  { name: "Approved", uid: "APPROVED" },
  { name: "Rejected", uid: "REJECTED" },
  { name: "Pending", uid: "PENDING" },
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
    language: "IND (+91)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "approved",
    actions: "Edit | Delete",
    templateName: "Marketing",
    category: "Marketing",
  },
  {
    id: 2,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "US (+1)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "rejected",
    actions: "Edit | Delete",
    templateName: "OTP",
    category: "Services",
  },
  {
    id: 3,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "NPL (+977)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "approved",
    actions: "Edit | Delete",
    templateName: "Educational",
    category: "Utility",
  },
  {
    id: 4,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "BGD (+880)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "pending",
    actions: "Edit | Delete",
    templateName: "OTP",
    category: "Authentication",
  },
  {
    id: 5,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "IND (+91)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "approved",
    actions: "Edit | Delete",
    templateName: "Marketing",
    category: "Marketing",
  },
  {
    id: 6,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "LKA (+94)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "approved",
    actions: "Edit | Delete",
    templateName: "Fashion",
    category: "Services",
  },
  {
    id: 7,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "BTN (+975)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "rejected",
    actions: "Edit | Delete",
    templateName: "OTP",
    category: "Utility",
  },
  {
    id: 8,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "IND (+91)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "approved",
    actions: "Edit | Delete",
    templateName: "Marketing",
    category: "Authentication",
  },
  {
    id: 9,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "US (+1)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "pending",
    actions: "Edit | Delete",
    templateName: "Sales",
    category: "Marketing",
  },
  {
    id: 10,
    date: formatDate(new Date()),
    approvedUnder: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
    senderId: getRandomSenderId(),
    entityId: getRandomEntityId(),
    templateId: getRandomTemplateId(),
    language: "IND (+91)",
    createdOn: formatDate(new Date()),
    type: Math.random() < 0.5 ? "Transactional" : "Promotional",
    status: "approved",
    actions: "Edit | Delete",
    templateName: "OTP",
    category: "Authentication",
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(date.getFullYear()).slice(-2);
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
}
const formatDateAndTime = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};
function formatDateInUnderScors(dateString) {
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(date.getFullYear()).slice(-2);
  
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedHours = String(hours).padStart(2, '0');

  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
}
const formatStatus = (status) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
};

export { columns, users, statusOptions, formatDate, formatStatus,formatDateInUnderScors,formatDateAndTime };
