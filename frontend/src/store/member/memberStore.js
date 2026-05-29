import { create } from "zustand";

// member store
export const useMemberStore = create((set) => {
    const initialState = {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_no: "",
        country_dial_code: "+91",
        role: "",
        status: "",
        avatar_value: undefined,
        avatar_type: "character",
    };

    return {
        ...initialState,
        setEmail: (email) => set((state) => ({ ...state, email: email })),
        setPassword: (password) =>
            set((state) => ({ ...state, password: password })),
        setFirstName: (first_name) =>
            set((state) => ({ ...state, first_name: first_name })),
        setLastName: (last_name) =>
            set((state) => ({ ...state, last_name: last_name })),
        setPhoneNo: (phone_no) =>
            set((state) => ({ ...state, phone_no: phone_no })),
        setRole: (role) => set((state) => ({ ...state, role: role })),
        setStatus: (status) => set((state) => ({ ...state, status: status })),
        setAvatarValue: (value) =>
            set((state) => ({ ...state, avatar_value: value })),
        setAvatarType: (type) =>
            set((state) => ({ ...state, avatar_type: type })),
        setCountryDialCode: (country_dial_code) =>
            set((state) => ({
                ...state,
                country_dial_code: country_dial_code,
            })),
        // Reset function for all state
        resetMembers: () => set(() => initialState),
    };
});
