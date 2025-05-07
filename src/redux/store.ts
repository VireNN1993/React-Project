import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import cardsReducer from "./slices/cardsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    cards: cardsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
