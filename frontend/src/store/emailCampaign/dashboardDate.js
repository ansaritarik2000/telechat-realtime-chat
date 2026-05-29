
import { create } from "zustand";

const useEmailDashStore = create((set) => ({
    emailDashboardDate: new Date(), // Default date is today
    EmailDashboard: {},
  
    setEmailDashboardDate: (date) =>
      set((state) => ({ ...state, emailDashboardDate: date })),
  
    setEmailDashboard: (data) =>
      set((state) => ({ ...state, EmailDashboard: data })),
  }));                        

export { useEmailDashStore };