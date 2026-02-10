"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setStep, setSelectedDate } from "@/redux/features/bookingSlice";
import { IoCalendarOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { format } from "date-fns";
import Calendar from "./calendar";

export default function DateStep() {
  const dispatch = useAppDispatch();
  const { date } = useAppSelector((state) => state.booking);

  const getSelectedDateDisplay = () => {
    return date.selectedDate
      ? format(new Date(date.selectedDate), "EEEE, do MMMM yyyy")
      : "No date selected yet";
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2">
          Pick a Date
        </h3>
        <p className="text-gray-500 text-sm">
          Select a convenient day for your session. We're open Monday - Saturday.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 flex-1">
        {/* Date Display Card */}
        <div className={`p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4
          ${date.selectedDate 
            ? "border-[#D77A8B] bg-pink-50/30 dark:bg-[#D77A8B]/5 shadow-sm" 
            : "border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent"}`}>
          
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
            ${date.selectedDate ? "bg-[#943F54] text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-400"}`}>
            <IoCalendarOutline size={24} />
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">
              Appointment Date
            </p>
            <p className={`text-sm font-bold ${date.selectedDate ? "text-[#943F54] dark:text-[#D77A8B]" : "text-gray-400"}`}>
              {getSelectedDateDisplay()}
            </p>
          </div>

          {date.selectedDate && (
            <FaRegCheckCircle className="ml-auto text-[#D77A8B] animate-bounce-short" size={20} />
          )}
        </div>

        {/* Calendar Wrapper */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-100 dark:border-gray-800 p-2 md:p-6 shadow-sm">
          <Calendar
            type="one-time"
            onSelect={(selected) => dispatch(setSelectedDate(selected))}
            onRangeSelect={() => {}}
            selectedDate={date.selectedDate}
          />
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-6 flex items-start gap-2 px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D77A8B] mt-1.5 flex-shrink-0" />
        <p className="text-[11px] text-gray-400 leading-tight">
          Note: Bookings must be made at least 24 hours in advance. For emergency/same-day bookings, please call the studio directly.
        </p>
      </div>
    </div>
  );
}