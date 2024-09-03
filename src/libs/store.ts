import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cart/cartSclice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      cart: cartSlice
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
