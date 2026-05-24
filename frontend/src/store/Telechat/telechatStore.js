import {create} from "zustand";
export const useFavouriteChatStore = create((set) => ({
  favouriteChats: [],
  toggleFavourite: (chatId) =>
    set((state) => {
      const isFavourite = state.favouriteChats.includes(chatId);
      return {
        favouriteChats: isFavourite
          ? state.favouriteChats.filter((id) => id !== chatId)
          : [...state.favouriteChats, chatId],
      };
    }),
}));

