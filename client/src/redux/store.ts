import { configureStore } from "@reduxjs/toolkit";
import { authReducer, contentReducer } from "./utils";
export const store = configureStore({
  reducer: {
    contents: contentReducer,
    auths: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
