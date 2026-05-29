import { create } from "zustand";

//  flow store
export const useFlowStore = create((set) => {
  const initialState = {
    flowName: "",
    saveFlowModalVisible: false,
    selectedRcsAction: "reply",
  };
  return {
    ...initialState,
    setFlowName: (bot) => set((state) => ({ ...state, flowName: bot })),
    setSaveFlowModalVisible: (open) =>
      set((state) => ({ ...state, saveFlowModalVisible: open })),
    setSelectedRcsAction: (select) =>
      set((state) => ({ ...state, selectedRcsAction: select })),
    resetFlowStore: () => set(() => initialState), //reset all state
  };
});
