import { axiosServerInstance } from "../../utils/axios/config";

// this service function is used for create contact
export const createContactService = async (contactData, token) => {
  try {
    const response = await axiosServerInstance.post(
      `/phonebook/contact/create`,
      contactData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return the response data on success
    return {
      status: response.data.status,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    // Handle and return error response
    return {
      status: "ERROR",
      message: error.response?.data?.message || "Failed to create contact",
      error: error.response?.data || error,
    };
  }
};

//  this service function is used for get contacts by logic filter
export const getContactsByLogicService = async (token, params) => {
  const response = await axiosServerInstance.get(
    `/phonebook/contacts/logicfilter`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    }
  );

  // Return the response data on success
  return {
    status: response.data.status,
    data: response.data.data,
    message: response.data.message,
  };
};

// this service function is used for create contact from excel
export const uploadContactsFromExcelService = async (file, token, bodyData) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Append other fields to the FormData object
    for (const [key, value] of Object.entries(bodyData)) {
      formData.append(key, value);
    }

    const response = await axiosServerInstance.post(
      `/phonebook/contacts/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return the response data on success
    return {
      status: response.data.status,
      message: response.data.message,
      validRowsCount: response.data.validRowsCount || 0,
      invalidRowsCount: response.data.invalidRowsCount || 0,
      invalidRows: response.data.invalidRows || [],
    };
  } catch (error) {
    // Handle and return error response
    return {
      status: "ERROR",
      message:
        error.response?.data?.message || "Failed to upload contacts from file",
      error: error.response?.data || error,
    };
  }
};

// this service function is used for get contacts
export const getContactsService = async (token, params) => {
  try {
    const response = await axiosServerInstance.get(`/phonebook/contacts/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    // Return the response data on success
    return {
      status: response.data.status,
      data: response.data.data,
      total: response.data.total,
      message: response.data.message,
    };
  } catch (error) {
    // Handle and return error response
    return {
      status: "ERROR",
      message: error.response?.data?.message || "Failed to get contacts",
      error: error.response?.data || error,
    };
  }
};

// this service function is used for delete contact
export const deleteContactService = async (token, id) => {
  try {
    const response = await axiosServerInstance.delete(
      `/phonebook/contact/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      }
    );

    // Return the response data on success
    return {
      status: response.data.status,
      message: response.data.message,
    };
  } catch (error) {
    // Handle and return error response
    return {
      status: "ERROR",
      message: error.response?.data?.message || "Failed to delete contact",
      error: error.response?.data || error,
    };
  }
};

// this service function is used for update  contact

export const updateContactService = async (token, contactData) => {
  try {
    const resposne = await axiosServerInstance.put(
      `/phonebook/contact/update`,
      contactData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Return the response data on success
    return {
      status: resposne.data.status,
      message: resposne.data.message,
    };
  } catch (error) {
    // Handle and return error response
    return {
      status: "ERROR",
      message: error.response?.data?.message || "Failed to update contact",
      error: error.response?.data || error,
    };
  }
};

// this service function is used for get tag options
export const getTagOptionsService = async () => {
  try {
    const response = await axiosServerInstance.get(
      `/phonebook/contact/get-tag-options`
    );

    // Return the response data on success
    return {
      status: response.data.status,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    // Handle and return error response
    return {
      status: "ERROR",
      message: error.response?.data?.message || "Failed to get tag options",
      error: error.response?.data || error,
    };
  }
};
