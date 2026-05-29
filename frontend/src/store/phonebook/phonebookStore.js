import { avatar } from "@heroui/theme";
import { create } from "zustand";

// phonebook store
export const usePhoneBookStore = create((set) => {
    const initialState = {
        // company details and user details
        selectedKeys: new Set([]),
        contact_name: "",
        phone_no: "",
        email: "",
        selectedGroups: [],
        selectedChannels: [],
        selectedTags: [],
        avatar_type: "character",
        avatar_value: "",
        notes: "",
        isUpdateButtonDisabled: true,
        file: null,
        groupFile: null,
        countryCode: "+91",
        groupSortedBy: null,
        searchGroupText: "",
    };

    return {
        ...initialState,

        // Setters for company details and user details
        setContactName: (name) =>
            set((state) => ({ ...state, contact_name: name })),
        setPhoneNo: (phone_no) =>
            set((state) => ({ ...state, phone_no: phone_no })),
        setCountryCode: (countryCode) =>
            set((state) => ({ ...state, countryCode: countryCode })),
        setEmail: (email) => set((state) => ({ ...state, email: email })),
        setSelectedGroups: (groups) =>
            set((state) => ({ ...state, selectedGroups: groups })),
        setSelectedChannels: (channels) =>
            set((state) => ({ ...state, selectedChannels: channels })),
        setAssignedChannels: (channels) =>
            set((state) => ({ ...state, assignedChannels: channels })),
        setSelectedTags: (tags) =>
            set((state) => ({ ...state, selectedTags: tags })),
        setFile: (file) => set((state) => ({ ...state, file: file })),
        setAvatarType: (type) =>
            set((state) => ({ ...state, avatar_type: type })),
        setAvatarValue: (value) =>
            set((state) => ({ ...state, avatar_value: value })),
        setNotes: (notes) => set((state) => ({ ...state, notes: notes })),
        setIsUpdateButtonDisabled: (isDisabled) =>
            set((state) => ({ ...state, isUpdateButtonDisabled: isDisabled })),
        setGroupFile: (file) => set((state) => ({ ...state, groupFile: file })),
        setSelectedKeys: (keys) =>
            set((state) => ({ ...state, selectedKeys: keys })),
        setGroupSortedBy: (groupSortedBy) =>
            set((state) => ({ ...state, groupSortedBy: groupSortedBy })),
        setSearchGroupText: (searchGroupText) =>
            set((state) => ({ ...state, searchGroupText: searchGroupText })),
        // Reset function for all state
        resetPhonebookAccounts: () => set(() => initialState),
    };
});
