import { axiosServerInstance } from "../../utils/axios/config";

// Function to get RCS campaigns
export const getRCSCampaigns = async (params) => {
  const response = await axiosServerInstance.get(`/rcs/getrcs`, {
    params: {
      ...params, // Pass any query parameters here
    },
  });
  return response.data;
};
