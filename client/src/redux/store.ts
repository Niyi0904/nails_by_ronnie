// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import counterReducer from "./features/counterSlice"
import ThemeReducer from './features/themeSlice'
import AuthReducer from './features/authSlice'
import BookingReducer from './features/bookingSlice'

export const makeStore =
  configureStore({
    reducer: {
      counter: counterReducer,
      theme: ThemeReducer,
      auth: AuthReducer,
      booking: BookingReducer
    },
  });

export type AppState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;