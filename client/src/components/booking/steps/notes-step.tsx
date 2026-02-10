"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook"
import { setStep, setNotes } from "@/redux/features/bookingSlice"
import { IoChatbubbleEllipsesOutline, IoSparklesOutline } from "react-icons/io5";
import { useState } from "react"

const QUICK_TIPS = [
  "Quiet appointment please",
  "Repairing a broken nail",
  "Nail art inspiration ready",
  "Sensitive skin/allergies",
];

export default function NotesStep() {
  const dispatch = useAppDispatch();
  const { notes: savedNotes } = useAppSelector((state) => state.booking);
  const [noteText, setNoteText] = useState(savedNotes || "");

  const handleNext = () => {
    dispatch(setNotes(noteText));
    dispatch(setStep(7)); // Move to Preview
  };

  const addQuickTip = (tip: string) => {
    setNoteText(prev => prev ? `${prev}. ${tip}` : tip);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2 flex items-center gap-2">
          Special Requests
        </h3>
        <p className="text-gray-500 text-sm">
          Anything Ronnie should know before your appointment?
        </p>
      </div>

      {/* Quick Selection Tags */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
          <IoSparklesOutline className="text-[#D77A8B]" /> Popular Notes
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TIPS.map((tip) => (
            <button
              key={tip}
              onClick={() => addQuickTip(tip)}
              className="px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-xs font-semibold text-gray-600 dark:text-gray-400 hover:border-[#D77A8B] hover:text-[#943F54] transition-all active:scale-95 shadow-sm"
            >
              + {tip}
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Area */}
      <div className="relative flex-1">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="e.g. Please bring extra rhinestones, or let me know if you have any special requirements..."
          className="w-full min-h-[200px] p-6 bg-white dark:bg-[#1A1A1A] border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] focus:border-[#D77A8B] focus:ring-0 transition-all outline-none text-sm leading-relaxed placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none shadow-inner"
        />
        <div className="absolute right-6 bottom-6 text-gray-300 dark:text-gray-700 pointer-events-none">
          <IoChatbubbleEllipsesOutline size={24} />
        </div>
      </div>

      {/* Aesthetic Bottom Note */}
      <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
        <p className="text-[11px] text-gray-400 leading-relaxed italic text-center">
          "Your comfort is our priority. Every note is read personally by our team before your session."
        </p>
      </div>
    </div>
  );
}