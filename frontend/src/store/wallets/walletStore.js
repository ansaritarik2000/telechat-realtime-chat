// wallet store
import { create } from "zustand";

export const useWalletStore = create((set) => {
    const initialState = {
        wallet_balance: 0,
    };

    return {
        ...initialState,
        setWalletBalance: (balance) =>
            set((state) => ({ ...state, wallet_balance: balance })),
        // Reset function for all state
        resetWallet: () => set(() => initialState),
    };
});
