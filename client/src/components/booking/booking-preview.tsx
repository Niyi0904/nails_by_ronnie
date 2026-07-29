"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setStep, resetBooking } from "@/redux/features/bookingSlice";
import { FaCheck, FaRegCalendarCheck, FaMapMarkerAlt, FaUserEdit, FaCalendarPlus } from "react-icons/fa";
import { IoArrowBack, IoSparklesSharp } from "react-icons/io5";
import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "@/app/(dashboard)/my-bookings/loading";
import { useRouter } from "next/navigation";
import { serverTimestamp } from "firebase/firestore";
import { addNewBooking } from "@/functions/bookingfunc/addNewBooking";
import { generateICS } from "@/lib/generateICS";

export default function BookingPreview() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const booking = useAppSelector((state) => state.booking);
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const body = {
        email: booking.email,
        service_type: booking.serviceType,
        sub_category: booking.subServiceType,
        booking_date: booking.date.selectedDate,
        booking_time: booking.time,
        booking_location: booking.location,
        additional_notes: booking.notes,
        name: booking.name,
        phone: booking.phone,
        createdAt: serverTimestamp(),
        status: "pending",
      };

      await addNewBooking(body);
      toast.success('Booking added successfully');
      setSuccess(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToHome = () => {
    dispatch(resetBooking());
    router.push('/');
  };

  const handleBack = () => {
    dispatch(setStep(6));
  };

  const handleDownloadICS = () => {
    const icsContent = generateICS({
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      service_type: booking.serviceType,
      sub_category: booking.subServiceType,
      booking_date: booking.date.selectedDate || '',
      booking_time: booking.time,
      booking_location: booking.location,
      additional_notes: booking.notes,
    });
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nails-by-ronnie-${booking.date.selectedDate}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in zoom-in-95 duration-500">
        <div className="h-24 w-24 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-8 relative">
          <FaCheck className="h-10 w-10 text-green-500" />
          <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Request Sent!</h2>
        <p className="text-gray-500 mb-10 max-w-sm leading-relaxed">
          Ronnie has received your request. We'll send a confirmation to <span className="font-bold text-[#943F54]">{booking.phone}</span> shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={handleDownloadICS}
            className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-[#1A1A1A] border-2 border-[#943F54] text-[#943F54] px-6 py-4 rounded-2xl font-bold hover:bg-[#943F54] hover:text-white transition-all"
          >
            <FaCalendarPlus /> Add to Calendar
          </button>
          <button
            onClick={handleGoToHome}
            className="flex-1 bg-[#943F54] text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#D77A8B] transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2">Final Review</h3>
        <p className="text-gray-500 text-sm italic">Double check your details before confirming.</p>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
        
        {/* Date & Time Card (Hero) */}
        <div className="bg-gradient-to-br from-[#943F54] to-[#D77A8B] rounded-[2rem] p-6 text-white shadow-xl shadow-pink-100 dark:shadow-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
              <FaRegCalendarCheck size={24} />
            </div>
            <div>
              <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest">Appointment Slot</p>
              <h4 className="text-lg font-bold">{booking.date.selectedDate} at {booking.time}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-black/10 w-fit px-4 py-2 rounded-full border border-white/10">
            <FaMapMarkerAlt size={12} />
            {booking.serviceType === "Home Service" ? booking.location : booking.serviceType}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Info */}
          <div className="p-5 bg-white dark:bg-[#1A1A1A] border-2 border-gray-50 dark:border-gray-800 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Client Info</p>
              <button onClick={() => dispatch(setStep(5))} className="text-[#D77A8B]"><FaUserEdit size={16}/></button>
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{booking.name}</p>
            <p className="text-xs text-gray-500 mt-1">{booking.phone}</p>
            <p className="text-xs text-gray-500">{booking.email}</p>
          </div>

          {/* Services Info */}
          <div className="p-5 bg-white dark:bg-[#1A1A1A] border-2 border-gray-50 dark:border-gray-800 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter mb-4">Selected Treatments</p>
            <div className="flex flex-wrap gap-2">
              {booking.subServiceType.map((sub, i) => (
                <span key={i} className="px-3 py-1 bg-pink-50 dark:bg-[#943F54]/10 text-[#943F54] text-[11px] font-bold rounded-full border border-pink-100 dark:border-pink-900/30">
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Notes Section */}
        {booking.notes && (
          <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter mb-2">My Note to Ronnie</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{booking.notes}"</p>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-[#943F54] font-bold text-xs uppercase transition-all"
        >
          <IoArrowBack size={18} /> Go Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="relative overflow-hidden bg-[#943F54] hover:bg-[#7a3345] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              Confirm & Book <IoSparklesSharp />
            </>
          )}
        </button>
      </div>
    </div>
  );
}