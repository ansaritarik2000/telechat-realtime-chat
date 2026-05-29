import React from "react";
import axios from "axios";
import { backend_base_url } from "../../../../../../services/common";
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getTask = async()=>{
       try {
        const response = await axios.get(`${backend_base_url}/whatsapp/agentTask/details`);
        if(response.status){
          return response.data;
        }
       } catch (error) {
        throw error
       }
}

export const createTask = async(data)=>{
  try {
    const response = await axios.post(`${backend_base_url}/whatsapp/agentTask/create`,data,{
      headers:{
        "Content-Type":"application/json"
      }
    });
    if(response.status){
      return response.data;
    }
   } catch (error) {
    throw error
   }
}

export const getAgents = async(token)=>{
  try {
    const response = await axios.get(`${backend_base_url}/member/list`,{
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });

    if(response.status){
      return response.data;
    }
   
   } catch (error) {
    throw error
   }
}
export const getAgentsId = async(id)=>{
  try {
    const response = await axios.get(`${backend_base_url}/member/memberId/${id}`);
    if(response.data.status==='SUCCESS'){
      return response?.data?.data?.id;
    }
   
   } catch (error) {
    throw error
   }
}
// Delete the cards 
export const deleteCardBackend = async(id,userId)=>{
  try {
    const response = await axios.delete(`${backend_base_url}/whatsapp/agentTask/tasks/${id}`, {
      data: { userId }, 
      headers: {
        "Content-Type": "application/json",
      },
    });
      return response.data;
   } catch (error) {
    console.error("Axios error:", error.response?.data || error.message);
    return error.response?.data
   }
}

export const updateCardBackend = async (id, card) => {
  try {
    const response = await axios.patch(
      `${backend_base_url}/whatsapp/agentTask/tasks/${id}`,
      card,
      { headers: { "Content-Type": "application/json" } }
    );

    // console.log("Response received in frontend:", response.data); // Check this

    return response.data; // Ensure returning data
  } catch (error) {
    console.error("Axios error:", error.response?.data || error.message);
    return error.response?.data
  }
};



export const transformDate = (dateString) => {
  const [day, month, year] = dateString.split("-"); // Split DD-MM-YYYY
  return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
};
export const formatDateForduedate = (dateStr) => {
  // Check if the input is in "YYYY-MM-DD" format using a regex
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!regex.test(dateStr)) {
    return dateStr; // Return as is if the format doesn't match
  }

  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const isDecimal = (num)=>{
  return (num % 1) !== 0;
}

export const checkTaskPermissions = (task, userRole,userId,memberId) => {
  const isAdmin = ['admin', 'superadmin'].includes(userRole);
  const isAgent = userRole === 'agent';
  const isCardOwner = task.created_by === userId || 
                      (isAgent && task.assigned_to === memberId);

  return {
    canView: true,
    canEdit: isAdmin || isCardOwner,
    canDelete: isAdmin || isCardOwner,
    canCreate: isAdmin || isAgent
  };
};


