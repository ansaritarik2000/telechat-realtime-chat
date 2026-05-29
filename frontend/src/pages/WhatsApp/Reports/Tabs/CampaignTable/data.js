// WhatsApp Reports > Campaign Name | Date | Type | Status | Submitted Credits | Delivered Credits | Actions (unchanged) |

import axios from "axios";
import { backend_base_url } from "../../../../../services/common";

const columns = [
    { name: "Campaign Name", uid: "campaignName" },
    { name: "Date & Time", uid: "created_at", sortable: true },
    { name: "Type", uid: "selectedTemplateTypeSend", sortable: true },
    { name: "Status", uid: "status", sortable: true },
    { name: "Submitted Credits", uid: "submittedCredits", sortable: true },
    { name: "Delivered Credits", uid: "deliveredCredits", sortable: true },
    { name: "Actions", uid: "actions" },

    // { name: "ID", uid: "id", sortable: true },
    // { name: "Route", uid: "route", sortable: true },
    // { name: "Header", uid: "header", sortable: true },
    // { name: "NAME", uid: "name", sortable: true },
    // { name: "ROLE", uid: "role", sortable: true },
    // { name: "TEAM", uid: "team" },
    // { name: "EMAIL", uid: "email" }
    
];

const statusOptions = [
    { name: "Delivered", uid: "delivered" },
    { name: "Failed", uid: "failed" },
    { name: "Pending", uid: "pending" },
    { name: "Scheduled", uid: "scheduled" }
];

const users = [
    {
        id: 1,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Tony Reichert",
        role: "CEO",
        team: "Management",
        status: "completed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "Panel",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com",
        campaignName: "Marketing",
    },
    {
        id: 2,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Zoey Lang",
        role: "Tech Lead",
        team: "Development",
        status: "failed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "API",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com",
        campaignName: "Sales",
    },
    {
        id: 3,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Jane Fisher",
        role: "Sr. Dev",
        team: "Development",
        status: "completed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "Panel",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com",
        campaignName: "Festival",
    },
    {
        id: 4,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "William Howard",
        role: "C.M.",
        team: "Marketing",
        status: "pending",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "API",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        email: "william.howard@example.com",
        campaignName: "Discount",
    },
    {
        id: 5,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Kristen Copper",
        role: "S. Manager",
        team: "Sales",
        status: "completed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "Panel",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com",
        campaignName: "Marketing",
    },
    {
        id: 6,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Brian Kim",
        role: "P. Manager",
        team: "Management",
        status: "completed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "Panel",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "brian.kim@example.com",
        campaignName: "Marketing",
    },
    {
        id: 7,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Michael Hunt",
        role: "Designer",
        team: "Design",
        status: "failed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "API",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
        email: "michael.hunt@example.com",
        campaignName: "Sales",
    },
    {
        id: 8,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Samantha Brooks",
        role: "HR Manager",
        team: "HR",
        status: "completed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "API",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
        email: "samantha.brooks@example.com",
        campaignName: "Festival",
    },
    {
        id: 9,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Frank Harrison",
        role: "F. Manager",
        team: "Finance",
        status: "pending",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "Panel",
        avatar: "https://i.pravatar.cc/150?img=4",
        email: "frank.harrison@example.com",
        campaignName: "Discount",
    },
    {
        id: 10,
        date: formatDate(new Date()),
        header: Math.random() < 0.5 ? "TELEPIE" : "TSGNAL",
        type: Math.random() < 0.5 ? "Transactional" : "Promotional",
        name: "Emma Adams",
        role: "Ops Manager",
        team: "Operations",
        status: "completed",
        submittedCredits: Math.floor(Math.random() * 10) * 2,
        deliveredCredits: [2, 4, 6][Math.floor(Math.random() * 3)],
        route: "API",
        avatar: "https://i.pravatar.cc/150?img=5",
        email: "emma.adams@example.com",
        campaignName: "Sales",
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
export const getCampaignDetails = async()=>{
    try {
         const response = await axios.get(`${backend_base_url}/whatsapp/template/campaign`)
         if(!response){
           return {
            message:"Campaign Not Found",
            status:false
           }
         }
         return {
            message:"Get Campaign Successfully",
            data:response
         }

    } catch (error) {
        // console.log(error.message)
        return {
            message:"Campaign Not Found",
            status:false
        }
    }
}

export { columns, users, statusOptions };
