"use client";

import { useState } from "react";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { setStep, setTime } from "@/redux/features/bookingSlice";
import { FaPlus, FaBackward, FaAngleDown } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

interface TimeSlot {
  id: string;
  startTime: string;
}

export default function TimeStep() {
  const dispatch = useAppDispatch();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ id: "1", startTime: "7:30 AM" }]);

  const handleBack = () => {
    dispatch(setStep(3));
  };

  const handleNext = () => {
    // Save the time slot information to the Redux store
    const formattedTime = timeSlots.map((slot) => slot.startTime).join(", ");
    dispatch(setTime(formattedTime));
    dispatch(setStep(5)); // Go to preview
  };

  const updateTimeSlot = (id: string, field: "startTime", value: string) => {
    const updatedSlots = timeSlots.map((slot) =>
      slot.id === id ? { ...slot, [field]: value } : slot
    );
    setTimeSlots(updatedSlots);
  };

  const addTimeSlot = () => {
    // Generate a unique ID
    const newId = Date.now().toString();
    setTimeSlots([...timeSlots, { id: newId, startTime: "7:30 AM" }]);
  };

  const removeTimeSlot = (id: string) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    }
  };

  const isNextEnabled = () => {
    return timeSlots.every((slot) => slot.startTime);
  };

  const timeOptions = [
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
  ];

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-6">Choose time</h3>

      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Time:</p>
              <div className="relative">
                <select
                  value={slot.startTime}
                  onChange={(e) => updateTimeSlot(slot.id, "startTime", e.target.value)}
                  className="w-full p-2 pr-10 border border-pink-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {timeOptions.map((time) => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <FaAngleDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={handleBack}>
          <IoArrowBack className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          disabled={!isNextEnabled()}
          className={`${isNextEnabled() ? "text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg primary flex justify-center items-center-safe" : "bg-gray-200"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}