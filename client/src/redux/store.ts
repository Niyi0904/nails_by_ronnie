// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import ThemeReducer from './features/themeSlice';
import AuthReducer from './features/authSlice';
import BookingReducer from './features/bookingSlice';
import GalleryReducer from './features/gallerySlice';

// REMOVED: counterSlice — was unused throughout the entire codebase
// REMOVED: next-redux-wrapper createWrapper — not needed for client-side Redux

export const makeStore = configureStore({
  reducer: {
    theme: ThemeReducer,
    auth: AuthReducer,
    booking: BookingReducer,
    gallery: GalleryReducer,
  },
});

export type AppState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;