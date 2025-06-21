import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { act } from "react"



export interface GalleryState {
  isModalOpen: boolean,
  name: string,
  description: string,
  image: File | undefined
}

const initialState: GalleryState = {
  isModalOpen: false,
  name: '',
  description: '',
  image: undefined
}

export const GallerySlice = createSlice({
  name: "Gallery",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
        state.name = action.payload
    },
    setDescription: (state, action: PayloadAction<string>) => {
        state.description = action.payload
    },
    setImage: (state, action: PayloadAction<File | undefined>) => {
        state.image = action.payload
    },
    openModal: (state) => {
      state.isModalOpen = true
    },
    closeModal: (state) => {
      state.isModalOpen = false
    },
  },
})

export const {
    setImage,
    setName,
    setDescription,
  openModal,
  closeModal,
} = GallerySlice.actions

export default GallerySlice.reducer

