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
  openModal,
  closeModal,
  resetBooking,
  setDateType,
  setSelectedDate,
  setLocation
} = bookingSlice.actions

export default bookingSlice.reducer

