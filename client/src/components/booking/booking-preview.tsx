"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setStep, closeModal, resetBooking } from "@/redux/features/bookingSlice";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { IoArrowBack} from "react-icons/io5";
import Image from "next/image";
import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/app/(dashboard)/my-bookings/loading";


export default function BookingPreview() {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking);
  const authState = useAppSelector((state) => state.auth);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    err: unknown;
    message: string;
  } | null>(null);

  const {user} = useAppSelector(state => state.auth);

  const router = useRouter();
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const body = {
        email: user?.email,
        service_type: booking.serviceType?.name,
        sub_category: booking.subServiceType?.name,
        booking_date: booking.date.selectedDate,
        booking_time: booking.time,
        booking_location: booking.location
      };

      const response = await api.post('/booking/addBooking', body);
      console.log(response.data.user);
      console.log(response.data);

      setIsSubmitted(true);

      router.push('/my-bookings');

      toast.success('Added Booking');

      dispatch(resetBooking());
    } catch (err: any) {
      let errorMessage = 'Internal server error, please try again';

      if (err.response) {
        // Backend returned a non-2xx status code
        errorMessage = err.response.data?.error || err.response.data?.message || 'Something went wrong';
        console.error('Response Error:', err.response);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your internet or try again later.';
        console.error('Request Error:', err.request);
      } else {
        // Other errors (e.g., bad config)
        errorMessage = err.message || 'Unexpected error occurred.';
        console.error('General Error:', err.message);
      }
      setSubmitStatus({
        success: false,
        err: err,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    dispatch(setStep(6));
  };

  const handleGoToBookings = () => {
    dispatch(closeModal());
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <FaCheck className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Cleaning Request</h2>
        <h3 className="text-xl font-bold mb-4">Received Successfully.</h3>

        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for submitting your details. Our team has received your
          information and will review it shortly. An administrator will reach
          out to you for any additional documentation required to complete the
          process. We appreciate your cooperation and look forward to assisting
          you further.
        </p>

        <button
          onClick={handleGoToBookings}
          className="w-full max-w-md bg-blue-500 hover:bg-blue-600"
        >
          Go to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">See a preview of your booking</h3>
        <button
          onClick={() => dispatch(closeModal())}
          className="text-gray-400 hover:text-gray-600"
        >
          <MdOutlineCancel className="text-black h-5 w-5"/>
        </button>
      </div>

      <div className="space-y-6">
        {/* Service */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Service</p>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
              <Image
                src={booking.serviceType?.image || "/placeholder.svg"}
                alt={booking.serviceType?.name || "Service"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{booking.serviceType?.name}</p>
              <p className="text-sm">&#8358;{booking.serviceType?.price.toLocaleString()}+</p>
            </div>
          </div>
        </div>

        {/* Property */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Sub-Service</p>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
              <Image
                src={booking.subServiceType?.image || "/placeholder.svg"} // Display the selected property's image
                alt={booking.subServiceType?.name || "Sub-service"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-medium">{booking.subServiceType?.name}</p>
          </div>
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Date</p>
          <p className="font-medium">{booking.date.selectedDate}</p>
        </div>

        {/* Time */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Time</p>
          <p className="font-medium">{booking.time}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Location</p>
          <p className="font-medium">{booking.location}</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={handleBack}>
          <IoArrowBack className="w-5 h-5" />
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#D77A8B] flex justify-center disabled:cursor-not-allowed items-center-safe hover:text-white bg-[#943F54] dark:bg-[#943F54] dark:hover:bg-[#D77A8B]"
        >
          {isLoading ? <Loading/> : "Submit Request"}
        </button>
      </div>
    </div>
  );
}
