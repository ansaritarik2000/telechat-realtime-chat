import { create } from "zustand";

// sub account store
export const useProfileStore = create((set) => {
    const initialState = {
        // company details and user details
        business_name: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_no: "",
        country_dial_code: "+91",
        role: "",
        rel_mng_name: "",
        rel_mng_phone: "",
        rel_mng_country_dial_code: "+91",
        rel_mng_email: "",
        avatar_value: "",
        avatar_type: "character",
        isPasswordChanged: false,
        isProfileChanged: false,
        profileData: {},
        organizationAddress: {
            address: "",
            city: "",
            state: "",
            pin: "",
            country: "",
        },
        billingAddress: {
            address: "",
            city: "",
            state: "",
            pin: "",
            country: "",
        },
    };

    return {
        ...initialState,

        // Setters for company details and user details
        setBusinessName: (name) =>
            set((state) => ({ ...state, business_name: name })),
        setEmail: (email) => set((state) => ({ ...state, email: email })),
        setFirstName: (first_name) =>
            set((state) => ({ ...state, first_name: first_name })),
        setLastName: (last_name) =>
            set((state) => ({ ...state, last_name: last_name })),
        setPhoneNo: (phone_no) =>
            set((state) => ({ ...state, phone_no: phone_no })),
        setCountryDialCode: (country_dial_code) =>
            set((state) => ({
                ...state,
                country_dial_code: country_dial_code,
            })),
        setRole: (role) => set((state) => ({ ...state, role: role })),
        setRelMngName: (rel_mng_name) =>
            set((state) => ({ ...state, rel_mng_name: rel_mng_name })),
        setRelMngPhone: (rel_mng_phone) =>
            set((state) => ({ ...state, rel_mng_phone: rel_mng_phone })),
        setRelMngCountryDialCode: (rel_mng_country_dial_code) =>
            set((state) => ({
                ...state,
                rel_mng_country_dial_code: rel_mng_country_dial_code,
            })),
        setRelMngEmail: (rel_mng_email) =>
            set((state) => ({ ...state, rel_mng_email: rel_mng_email })),
        setAvatarValue: (avatar_value) =>
            set((state) => ({ ...state, avatar_value: avatar_value })),
        setAvatarType: (avatar_type) =>
            set((state) => ({ ...state, avatar_type: avatar_type })),
        setIsPasswordChanged: (changed) =>
            set((state) => ({ ...state, isPasswordChanged: changed })),
        setIsProfileChanged: (changed) =>
            set((state) => ({ ...state, isProfileChanged: changed })),
        setProfileData: (data) =>
            set((state) => ({ ...state, profileData: data })),
        setOrganizationAddress: (data) =>
            set((state) => ({ ...state, organizationAddress: data })),
        setBillingAddress: (data) =>
            set((state) => ({ ...state, billingAddress: data })),

        // Reset function for all state
        resetSubAccounts: () => set(() => initialState),
    };
});
