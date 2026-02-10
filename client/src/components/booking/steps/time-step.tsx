"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setStep, setTime } from "@/redux/features/bookingSlice";
import { IoTimeOutline } from "react-icons/io5";
import { LuSun, LuMoon } from "react-icons/lu";

const timeOptions = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
];

export default function TimeStep() {
  const dispatch = useAppDispatch();
  const { time: savedTime } = useAppSelector((state) => state.booking);
  const [selectedTime, setSelectedTime] = useState(savedTime || "");

  const handleNext = () => {
    if (selectedTime) {
      dispatch(setTime(selectedTime));
      dispatch(setStep(5)); // Next to Location
    }
  };

  // Grouping times for a better UX
  const morningTimes = timeOptions.filter(t => t.includes("AM") || t.startsWith("12:00 PM"));
  const afternoonTimes = timeOptions.filter(t => !morningTimes.includes(t));

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2 flex items-center gap-2">
          Select Arrival Time
        </h3>
        <p className="text-gray-500 text-sm">
          Please pick a time that works best for you.
        </p>
      </div>

      <div className="space-y-8 overflow-y-auto pr-2 max-h-[500px] custom-scrollbar">
        {/* Morning Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold text-xs uppercase tracking-widest">
            <LuSun size={16} /> Morning Sessions
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {morningTimes.map((time) => (
              <TimeChip 
                key={time} 
                time={time} 
                isActive={selectedTime === time} 
                onClick={() => { setSelectedTime(time); dispatch(setTime(time)); }} 
              />
            ))}
          </div>
        </div>

        {/* Afternoon Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <LuMoon size={16} /> Afternoon Sessions
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {afternoonTimes.map((time) => (
              <TimeChip 
                key={time} 
                time={time} 
                isActive={selectedTime === time} 
                onClick={() => { setSelectedTime(time); dispatch(setTime(time)); }} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Selected Time Indicator */}
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

// Sub-component for the chips to keep code clean
function TimeChip({ time, isActive, onClick }: { time: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 border-2
        ${isActive 
          ? "bg-[#D77A8B] border-[#D77A8B] text-white shadow-md shadow-pink-200" 
          : "bg-white dark:bg-[#1A1A1A] border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-[#D77A8B]/50"}`}
    >
      {time}
    </button>
  );
}