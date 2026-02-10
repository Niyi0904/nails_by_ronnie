"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setStep } from "@/redux/features/bookingSlice";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

// Component Imports
import ServiceTypeStep from "@/components/booking/steps/service-type-step";
import ManicureStep from "@/components/booking/steps/manicureType";
import NotesStep from "@/components/booking/steps/notes-step";
import LocationStep from "@/components/booking/steps/location-step";
import BookingPreview from "@/components/booking/booking-preview";
import ProgressSteps from "@/components/booking/progress-steps";

const DateStep = dynamic(() => import('@/components/booking/steps/date-step'), { ssr: false });
const TimeStep = dynamic(() => import('@/components/booking/steps/time-step'), { ssr: false });

export default function BookingPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { step, serviceType } = useAppSelector((state) => state.booking);

    const renderStep = () => {
        switch (step) {
            case 1: return <ServiceTypeStep />;
            case 2: return <ManicureStep />;
            case 3: return <DateStep />;
            case 4: return <TimeStep />;
            case 5: return <LocationStep />;
            case 6: return <NotesStep />;
            case 7: return <BookingPreview />;
            default: return <ServiceTypeStep />;
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF5F8] dark:bg-[#0F0F0F] p-4 md:p-10 transition-colors duration-300">
            <div className="mx-auto max-w-7xl">
                
                {/* Top Navigation / Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#943F54] tracking-tight">Create a Booking</h1>
                        <p className="text-gray-500 font-medium">Follow the steps to secure your appointment.</p>
                    </div>
                    <button 
                        onClick={() => router.back()} 
                        className="self-start md:self-auto px-5 py-2 text-sm font-semibold text-gray-500 hover:text-[#943F54] flex items-center gap-2 border border-gray-200 bg-white dark:bg-[#1A1A1A] dark:border-gray-800 rounded-full transition-all shadow-sm"
                    >
                        <MdOutlineCancel className="text-lg" /> Cancel & Exit
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT: Step Container */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-[#121015] rounded-[2.5rem] shadow-2xl shadow-pink-100/20 dark:shadow-none border border-pink-50 dark:border-gray-800 p-6 md:p-12 min-h-[650px] flex flex-col">
                            
                            {/* Progress Header */}
                            <div className="mb-10">
                                <ProgressSteps />
                            </div>

                            {/* Active Step Content */}
                            <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {renderStep()}
                            </div>

                            {/* Navigation Footer */}
                            {step < 7 && (
                                <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                                    <button
                                        onClick={() => dispatch(setStep(Math.max(1, step - 1)))}
                                        disabled={step === 1}
                                        className="flex items-center gap-2 px-6 py-3 font-bold text-gray-400 hover:text-[#943F54] disabled:opacity-0 transition-all uppercase text-xs tracking-widest"
                                    >
                                        <IoArrowBack size={18}/> Previous
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (step === 1 && !serviceType) return;
                                            dispatch(setStep(step + 1));
                                        }}
                                        className="bg-[#D77A8B] hover:bg-[#943F54] text-white px-12 py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 dark:shadow-none transition-all flex items-center gap-2"
                                    >
                                        Next Step <IoArrowForward size={18}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Sticky Summary Sidebar */}
                    <aside className="lg:col-span-4 sticky top-10 space-y-6">
                        <div className="bg-white dark:bg-[#121015] rounded-[2rem] border border-pink-100 dark:border-gray-800 shadow-xl p-8 relative overflow-hidden">
                            {/* Brand Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D77A8B] to-[#943F54]" />
                            
                            <h3 className="text-xl font-bold text-[#943F54] mb-6 tracking-tight">Booking Summary</h3>
                            
                            {/* Render the summary. If step is 7, we might want to hide this to avoid double content */}
                            <div className={step === 7 ? "opacity-20 pointer-events-none" : ""}>
                                <BookingPreview />
                            </div>
                        </div>

                        {/* Aesthetic Note */}
                        <div className="p-6 bg-[#943F54]/5 dark:bg-white/5 rounded-[1.5rem] border border-[#943F54]/10 text-center">
                            <p className="text-xs text-[#943F54] dark:text-[#D77A8B] font-medium leading-relaxed italic">
                                "Beauty begins the moment you decide to be yourself."
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}