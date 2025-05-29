"use client"

import { useAppDispatch } from "@/hooks/useReduxHook"
import {  setStep, setNotes } from "@/redux/features/bookingSlice"
import { IoArrowBack} from "react-icons/io5";
import { useState } from "react"

export default function NotesStep() {
  const dispatch = useAppDispatch()
  // const { notes } = useAppSelector((state) => state.booking)
  const [noteText, setNoteText] = useState("");


  const handleBack = () => {
    dispatch(setStep(5))
  }

  const handleNext = () => {
    dispatch(setNotes(noteText))
    dispatch(setStep(7))
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-6">Additional Note</h3>

      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Write"
        className="min-h-[150px] border-2 border-gray-400 pt-3 rounded-md pl-5 text-base"
      />

      <div className="flex justify-between mt-8">
        <button onClick={handleBack}>
          <IoArrowBack className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#D77A8B] flex justify-center disabled:cursor-not-allowed items-center-safe hover:text-white bg-[#943F54] dark:bg-[#943F54] dark:hover:bg-[#D77A8B]"
        >
          Next
        </button>
      </div>
    </div>
  )
}

