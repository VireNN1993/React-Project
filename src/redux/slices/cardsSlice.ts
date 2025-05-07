import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardType } from "../../types/Card";

export type CardsState = {
  allCards: CardType[];
  favoriteCards: CardType[];
};

const initialState: CardsState = {
  allCards: [],
  favoriteCards: [],
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setAllCards(state, action: PayloadAction<CardType[]>) {
      state.allCards = action.payload;
    },
    toggleLike(
      state,
      action: PayloadAction<{ cardId: string; userId: string }>,
    ) {
      const card = state.allCards.find((c) => c._id === action.payload.cardId);
      if (card) {
        const index = card.likes.indexOf(action.payload.userId);
        if (index === -1) {
          card.likes.push(action.payload.userId);
        } else {
          card.likes.splice(index, 1);
        }
      }
    },
    setFavoriteCards(state, action: PayloadAction<CardType[]>) {
      state.favoriteCards = action.payload;
    },
  },
});

export const { setAllCards, toggleLike, setFavoriteCards } = cardsSlice.actions;
export default cardsSlice.reducer;
