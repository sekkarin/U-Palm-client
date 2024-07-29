import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web
import { combineReducers } from "redux";
import authReducer from "./features/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  // whitelist: [], // only navigation will be persisted
  // blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore actions with these paths in their payload
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
          // Ignore these paths in the state
          ignoredPaths: ["register"],
        },
      }),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

// Infer the types of the store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
