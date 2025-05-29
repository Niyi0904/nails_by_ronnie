"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook"; 
import {
  setStep,
  setSelectedDate,
} from "@/redux/features/bookingSlice";
import { IoArrowBack } from "react-icons/io5";
import { format } from "date-fns";
import Calendar from "./calendar";

export default function DateStep() {
  const dispatch = useAppDispatch();
  const { date } = useAppSelector((state) => state.booking);

  const handleBack = () => {
    dispatch(setStep(2));
  };

  const handleNext = () => {
    if (date.selectedDate) {
      dispatch(setStep(4));
    }
  };

  const getSelectedDateDisplay = () => {
    return date.selectedDate
      ? format(new Date(date.selectedDate), "d MMM yyyy, EEEE")
      : "--/--/--";
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-6">Choose a preferred date</h3>

      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 gap-6 h-full">
          <div>
            <p className="text-sm text-gray-600 mb-2">Selected date:</p>
            <p className="text-sm font-medium">{getSelectedDateDisplay()}</p>
          </div>

          <div className="min-h-[400px]">
            <Calendar
              type="one-time"
              onSelect={(date) => dispatch(setSelectedDate(date))}
              onRangeSelect={() => {}}
              selectedDate={date.selectedDate}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t">
        <button onClick={handleBack}>
          <IoArrowBack className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={!date.selectedDate}
          className={`${
            date.selectedDate ? "text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#D77A8B] flex justify-center items-center-safe hover:text-white bg-[#943F54] dark:bg-[#943F54] dark:hover:bg-[#D77A8B]" : "bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
