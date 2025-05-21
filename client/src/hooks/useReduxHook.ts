import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppState, AppDispatch } from "../redux/store"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

