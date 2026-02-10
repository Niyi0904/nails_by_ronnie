"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { 
  setEmail, 
  setLocation, 
  setName, 
  setPhone, 
  setStep, 
  loadUserDetails 
} from "@/redux/features/bookingSlice";
import { IoPersonOutline, IoCallOutline, IoMailOutline, IoLocationOutline } from "react-icons/io5";

export default function LocationStep() {
  const dispatch = useAppDispatch();
  const { location, serviceType, email, phone, name } = useAppSelector((state) => state.booking);
  const { user } = useAppSelector((state) => state.auth);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      dispatch(loadUserDetails({
        email: user.email,
        phone: user.phone_number,
        name: user.full_name
      }));
    }
  }, [user, dispatch]);

  const isFormValid = () => {
    const baseValid = name && phone && email;
    if (serviceType === "Home Service") {
      return baseValid && location;
    }
    return baseValid;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2">
          Contact Details
        </h3>
        <p className="text-gray-500 text-sm">
          {serviceType === "Home Service" 
            ? "Tell us where to meet you and how to reach you." 
            : "Confirm your details for the studio appointment."}
        </p>
      </div>

      <div className="space-y-5">
        {/* Name Input */}
        <div className="group">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">
            Full Name*
          </label>
          <div className="relative">
            <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D77A8B] transition-colors" />
            <input
              type="text"
              value={name}
              onChange={(e) => dispatch(setName(e.target.value))}
              placeholder="e.g. Jane Doe"
              className="w-full h-14 pl-12 pr-5 bg-white dark:bg-[#1A1A1A] border-2 border-gray-100 dark:border-gray-800 rounded-2xl focus:border-[#D77A8B] focus:ring-0 transition-all outline-none text-sm font-medium"
            />
          </div>
        </div>

        {/* Two Column Row for Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">
              Phone Number*
            </label>
            <div className="relative">
              <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D77A8B] transition-colors" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => dispatch(setPhone(e.target.value))}
                placeholder="0801 234 5678"
                className="w-full h-14 pl-12 pr-5 bg-white dark:bg-[#1A1A1A] border-2 border-gray-100 dark:border-gray-800 rounded-2xl focus:border-[#D77A8B] focus:ring-0 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="group">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">
              Email Address*
            </label>
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D77A8B] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
                placeholder="jane@example.com"
                className="w-full h-14 pl-12 pr-5 bg-white dark:bg-[#1A1A1A] border-2 border-gray-100 dark:border-gray-800 rounded-2xl focus:border-[#D77A8B] focus:ring-0 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Conditional Location Input */}
        {serviceType === "Home Service" && (
          <div className="group animate-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-bold uppercase tracking-widest text-[#943F54] mb-2 block ml-1">
              Residential Address*
            </label>
            <div className="relative">
              <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D77A8B] transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => dispatch(setLocation(e.target.value))}
                placeholder="House No, Street Name, Area"
                className="w-full h-14 pl-12 pr-5 bg-pink-50/30 dark:bg-[#D77A8B]/5 border-2 border-pink-100 dark:border-gray-800 rounded-2xl focus:border-[#D77A8B] focus:ring-0 transition-all outline-none text-sm font-medium"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">
              Please include landmarks to help Ronnie find you faster.
            </p>
          </div>
        )}
      </div>

      {/* Trust Message */}
      <div className="mt-auto pt-8 flex items-center gap-3 text-gray-400">
        <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Secure Booking</span>
        <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}