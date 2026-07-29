"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setTime } from "@/redux/features/bookingSlice";
import { IoTimeOutline } from "react-icons/io5";

const timeSlots = [
  { start: "8:00 AM", end: "11:00 AM", icon: "🌅" },
  { start: "11:00 AM", end: "2:00 PM", icon: "☀️" },
  { start: "2:00 PM", end: "5:00 PM", icon: "🌤️" },
  { start: "5:00 PM", end: "8:00 PM", icon: "🌆" },
  { start: "8:00 PM", end: "11:00 PM", icon: "🌙" },
];

export default function TimeStep() {
  const dispatch = useAppDispatch();
  const { time: savedTime } = useAppSelector((state) => state.booking);
  const [selectedTime, setSelectedTime] = useState(savedTime || "");

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2 flex items-center gap-2">
          Select a Time Slot
        </h3>
        <p className="text-gray-500 text-sm">
          Each slot is a 3-hour appointment window.
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {timeSlots.map((slot) => (
          <button
            key={slot.start}
            onClick={() => { setSelectedTime(slot.start); dispatch(setTime(slot.start)); }}
            className={`w-full p-5 rounded-2xl text-left transition-all duration-200 border-2 flex items-center gap-4
              ${selectedTime === slot.start
                ? "bg-[#D77A8B] border-[#D77A8B] text-white shadow-md shadow-pink-200"
                : "bg-white dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#D77A8B]/50"}`}
          >
            <span className="text-2xl">{slot.icon}</span>
            <div>
              <p className="font-bold text-lg">{slot.start} – {slot.end}</p>
              <p className="text-sm opacity-70">{slot.start.includes("AM") ? "Morning" : slot.start.includes("2:00") ? "Afternoon" : slot.start.includes("5:00") ? "Evening" : "Night"} Session</p>
            </div>
          </button>
        ))}
      </div>

      {selectedTime && (
        <div className="mt-8 p-4 bg-[#943F54]/5 rounded-2xl border border-[#943F54]/10 flex items-center justify-center gap-3">
          <IoTimeOutline className="text-[#943F54]" size={20} />
          <p className="text-sm font-bold text-[#943F54]">
            Confirming for {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
}