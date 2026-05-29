import { addToast } from "@heroui/toast";
import { useQuery } from "@tanstack/react-query";
import { axiosServerInstance } from "../utils/axios/config";

const useRcsInbox = () => {
  const {
    data: inboxInfo,
    isError,
    error,
  } = useQuery({
    queryKey: ["rcs-inbox-contacts"],
    queryFn: async () => {
      const res = await axiosServerInstance.get("/rcs/inbox");

      return res.data.result;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isError) {
    addToast({
      title: error.name,
      description: error.message,
    });
  }

  return inboxInfo;
};

export default useRcsInbox;
