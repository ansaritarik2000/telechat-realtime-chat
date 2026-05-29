import React from "react";
import { axiosServerInstance } from "../../../../../utils/axios/config";
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// delete the template from backend 
export const deleteTemplate = async (ids) => {
  try {
    const response = await axiosServerInstance.delete(`/whatsapp/template/delete-templates`, {
      data:{ids}
    });
    
    if (response.status) {
      return response.data
    }
    return response
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error
  }
};