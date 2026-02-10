"use client"
import { useAppSelector } from "@/hooks/useReduxHook"
import { FaCheck } from "react-icons/fa"

export default function ProgressSteps() {
    const { step } = useAppSelector((state) => state.booking)

    const steps = [
        { id: 1, name: "Service" },
        { id: 2, name: "Treatment" },
        { id: 3, name: "Date" },
        { id: 4, name: "Time" },
        { id: 5, name: "Location" },
        { id: 6, name: "Notes" },
    ]

    return (
        <div className="flex items-center justify-between w-full">
            {steps.map((s, index) => {
                const isActive = step === s.id
                const isCompleted = step > s.id

                return (
                    <div key={s.id} className="flex flex-1 items-center last:flex-none">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2 
                                ${isActive ? "bg-[#943F54] border-[#943F54] text-white shadow-xl shadow-pink-200 dark:shadow-none scale-110" : 
                                  isCompleted ? "bg-[#D77A8B] border-[#D77A8B] text-white" : 
                                  "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-300"}`}
                            >
                                {isCompleted ? <FaCheck size={12} /> : s.id}
                            </div>
                            
                            {/* Step Label */}
                            <span className={`absolute -bottom-7 whitespace-nowrap text-[10px] font-bold uppercase tracking-tighter transition-colors duration-300
                                ${isActive ? "text-[#943F54] dark:text-[#D77A8B]" : "text-gray-400"}`}>
                                {s.name}
                            </span>
                        </div>

                        {/* Connecting Line */}
                        {index !== steps.length - 1 && (
                            <div className="flex-1 h-[2px] mx-2 bg-gray-100 dark:bg-gray-800 relative">
                                <div 
                                    className="absolute inset-0 bg-[#D77A8B] transition-all duration-700 ease-in-out" 
                                    style={{ width: isCompleted ? "100%" : "0%" }}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}