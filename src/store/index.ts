import { configureStore } from "@reduxjs/toolkit";
import actionBlockReducer from "./slices/actionBlockSlice";
export const store = configureStore({
  reducer: {
    actionBlock: actionBlockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
