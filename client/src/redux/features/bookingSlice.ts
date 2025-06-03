import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { act } from "react"



export interface BookingState {
  step: number
  serviceType: {
    id:string,
    name: string
    image: string
    price: number
  } | null
  subServiceType: {
    id: string
    name: string
    image: string
  } | null
  date: {
    selectedDate?: string
  },
  notes: string
  location: string
  time: string
  email: string
  phone: string
  name: string
  // notes: string
  isModalOpen: boolean
}

const initialState: BookingState = {
  step: 1,
  serviceType: null,
  subServiceType: null,
  date: {
    selectedDate:''
  },
  notes: '',
  location: '',
  time: "",
  email: '',
  phone:'',
  name: '',
  // notes: "",
  isModalOpen: false,
}

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setServiceType: (state, action: PayloadAction<BookingState["serviceType"]>) => {
      state.serviceType = action.payload
    },
    setSubServiceType: (state, action: PayloadAction<BookingState["subServiceType"]>) => {
      state.subServiceType = action.payload
    },
    setEmail: (state, action:PayloadAction<string>) => {
      state.email = action.payload
    },
    loadUserDetails: (
      state,
      action: PayloadAction<{ email: string; phone: string; name: string }>
    ) => {
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.name = action.payload.name;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date.selectedDate = action.payload
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload
    },
    setLocation: (state, action: PayloadAction<string>) => {
        state.location = action.payload
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload
    },
    // setNotes: (state, action: PayloadAction<string>) => {
    //   state.notes = action.payload
    // },
    openModal: (state) => {
      state.isModalOpen = true
    },
    closeModal: (state) => {
      state.isModalOpen = false
      state.step = 1
      state.serviceType = null
      state.subServiceType= null
      state.time = ""
      state.date.selectedDate=''
      // state.notes = ""
    },
    resetBooking: () => initialState,
    setDateType: (state, action: PayloadAction<string>) => {
      state.date.selectedDate = undefined
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.date.selectedDate = action.payload
    },

  },
})

export const {
  setStep,
  setServiceType,
  setSubServiceType,
  setDate,
  setTime,
  setNotes,
  setName,
  setPhone,
  setEmail,
  loadUserDetails,
  openModal,
  closeModal,
  resetBooking,
  setDateType,
  setSelectedDate,
  setLocation
} = bookingSlice.actions

export default bookingSlice.reducer

