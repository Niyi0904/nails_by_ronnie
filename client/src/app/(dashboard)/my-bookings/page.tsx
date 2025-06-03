"use client";
import { useState, useEffect, useRef} from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {FaSearch, FaPlus } from 'react-icons/fa';
import { openModal } from "@/redux/features/bookingSlice";
import BookingModal from "@/components/booking/booking-modal";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { BookingStatus, Booking } from "@/types/booking";
import api from "@/utils/api";
import dynamic from 'next/dynamic';
import Loading from "./loading";
import Link from "next/link";

const BookingsTable = dynamic(() => import("@/components/booking/bookings-table"));

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const {user, isAuthenticated} = useSelector((state: AppState) => state.auth);

  const searchQuery = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<BookingStatus>("confirmed");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchBookings = async (id:string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/booking/mybookings/${id}`);
      console.log(response);
      setBookings(response.data.allBookings || []);
      setPagination((prev) => ({
          ...prev,
          total: response.data.allBookings.length || 0,
        }));


      if (response.data) {
        setBookings(response.data.allBookings || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
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

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  if (!user?.Userid) {
    console.log('no user found');
    return
  };

  console.log("USER FOUND", user);

  fetchBookings(user.Userid);
  
  }, [user]);

  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setPagination({
      page: 1,
      limit: Number(value),
      total: pagination.total,
    });
  };

  const handleOpenModel = () => {
    dispatch(openModal());
  }

  const counts = {
    confirmed: bookings.filter((b) => b.status?.toLowerCase() === "confirmed")
      .length,
    pending: bookings.filter((b) => b.status?.toLowerCase() === "pending")
      .length,
    completed: bookings.filter((b) => b.status?.toLowerCase() === "completed")
      .length,
    cancelled: bookings.filter((b) => b.status?.toLowerCase() === "cancelled")
      .length,
  };

  return (
    <div className="relative mt-15">
      <main className="pt-8 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold">Bookings</h1>


            <div className="flex flex-col md:flex-row gap-4 md:items-center ">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search"
                  value={searchQuery.current?.value}
                  className="pl-9 w-full border px-5 py-2 border-gray-400 rounded-lg md:w-[300px]"
                />
              </div>
              <button
                onClick={handleOpenModel}
                className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#943F54] flex justify-center items-center-safe hover:text-white primary"
              >
                <FaPlus className="h-4 w-4 mr-2" />
                Add New Booking
              </button>
            </div>
          </div>
          {
            !isAuthenticated ? 
            <div className="flex flex-col items-center justify-center pt-12 w-full space-y-8">
              <div className="flex items-center flex-col space-y-5">
                <p className="text-xl">Login to keep track of your appointment with us!</p>
              </div>

              <Link
                  href='/login'
                  className="w-[20%] primary text-white font-medium py-3 px-6 rounded-lg transition-colors flex justify-center"
                  >
                  Login
              </Link>
            </div> : 

            <div>
              {
                isLoading ? 
                <Loading/> :
                <BookingsTable
                  activeTab={activeTab}
                  searchQuery={searchQuery}
                  bookings={bookings}
                  currentPage={pagination.page}
                  rowsPerPage={pagination.limit}
                  totalBookings={pagination.total}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  message={error ? error : "No booking found"}
                />
              }
          </div>
          }
        </div>
      </main>
      <BookingModal />
    </div>
  );
}
