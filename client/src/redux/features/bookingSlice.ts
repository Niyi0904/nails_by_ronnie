// redux/features/bookingSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// REMOVED: import { act } from 'react'  ← was a test utility, never used in production

export interface SubServiceType {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
}

export interface BookingState {
  step: number;
  serviceType: string;      // Stores the selected location name — renamed for clarity
  subServiceType: SubServiceType[];
  date: {
    selectedDate?: string;
  };
  notes: string;
  location: string;
  time: string;
  email: string;
  phone: string;
  name: string;
  isModalOpen: boolean;
}

const initialState: BookingState = {
  step: 1,
  serviceType: '',
  subServiceType: [],
  date: {
    selectedDate: '',
  },
  notes: '',
  location: '',
  time: '',
  email: '',
  phone: '',
  name: '',
  isModalOpen: false,
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },

    setServiceType: (state, action: PayloadAction<string>) => {
      state.serviceType = action.payload;
    },

    setSubServiceType: (state, action: PayloadAction<SubServiceType>) => {
      const exists = state.subServiceType.find(s => s.id === action.payload.id);
      if (!exists) {
        state.subServiceType.push(action.payload);
      }
    },

    removeSubServiceType: (state, action: PayloadAction<string>) => {
      state.subServiceType = state.subServiceType.filter(s => s.id !== action.payload);
    },

    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },

    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },

    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    loadUserDetails: (
      state,
      action: PayloadAction<{ email: string; phone: string; name: string }>
    ) => {
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.name = action.payload.name;
    },

    setDate: (state, action: PayloadAction<string>) => {
      state.date.selectedDate = action.payload;
    },

    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.date.selectedDate = action.payload;
    },

    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },

    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },

    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },

    openModal: (state) => {
      state.isModalOpen = true;
    },

    closeModal: (state) => {
      state.isModalOpen = false;
      state.step = 1;
      state.serviceType = '';
      state.subServiceType = [];
      state.time = '';
      state.date.selectedDate = '';
    },

    resetBooking: () => initialState,

    // REMOVED: setDateType — was broken (accepted string payload but used undefined)
    // Use setSelectedDate or resetBooking instead
  },
});

export const {
  setStep,
  setServiceType,
  setSubServiceType,
  removeSubServiceType,
  setDate,
  setSelectedDate,
  setTime,
  setNotes,
  setName,
  setPhone,
  setEmail,
  loadUserDetails,
  openModal,
  closeModal,
  resetBooking,
  setLocation,
} = bookingSlice.actions;

export default bookingSlice.reducer;