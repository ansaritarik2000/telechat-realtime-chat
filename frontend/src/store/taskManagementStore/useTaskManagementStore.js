import { create } from "zustand";

export const useTaskStore = create((set) => ({
  cards: [],
  agents: [],
  isDrawerOpen: false,
  selectedCard: null,
  userRole: localStorage.getItem("role"),
  userId: localStorage.getItem("user_id"),
  avatar_value : localStorage.getItem("avatar_value"),
  memberId: null,
  isEditDrawer:false,

  setIsEditDrawer: (edit) => set({ isEditDrawer: edit }),
  setMemberId: (memberid) => set({ memberId: memberid }),
  setCards: (newCards) => set({ cards: newCards }),
  setAgents: (newAgents) => set({ agents: newAgents }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setSelectedCard: (card) => set({ selectedCard: card }),
  addCard: (card) => set((state) => {
    const cardExists = state.cards.some((c) => c.id === card.id);
    return cardExists ? state : { cards: [...state.cards, card] };
  }), 
  updateCard: (updatedCard) =>
    set((state) => ({  

      cards: state.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    })),
    deleteCard: (cardId) =>
        set((state) => ({ 
          cards: state.cards.filter((card) => card.id !== cardId),
          selectedCard: state.selectedCard?.id === cardId ? null : state.selectedCard
        })),
    updateCardColumn: (cardId, newColumn) =>
            set((state) => ({
              cards: state.cards.map((card) =>
                card.id === cardId ? { ...card, task_column: newColumn } : card
              ),
            })),
}));