"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { FaSearch, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { openModal } from "@/redux/features/bookingSlice";
import { BookingStatus, Booking } from "@/types/booking";
import dynamic from 'next/dynamic';
import Loading from "./loading";
import Link from "next/link";
import { FetchBookings } from "@/functions/bookingfunc/fetchBookings";
import { useRouter } from "next/navigation";

const BookingsTable = dynamic(() => import("@/components/booking/bookings-table"), { ssr: false });
const BookingModal = dynamic(() => import('@/components/booking/booking-modal'), { ssr: false });

const TABS: { id: BookingStatus | "all"; label: string }[] = [
  { id: "all", label: "All Bookings" },
  { id: "confirmed", label: "Upcoming" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "History" },
  { id: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isModalOpen } = useAppSelector((state) => state.booking);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchUserBookings = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await FetchBookings(email);
      // Ensure we always have an array for the table
      const data = Array.isArray(response) ? response : [];
      setBookings(data);
      setPagination(prev => ({ ...prev, total: data.length }));
    } catch (err) {
      console.error('Fetch Error:', err);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchUserBookings(user.email);
  }, [user, isModalOpen]);

  return (
    <div className="min-h-screen mt-10 bg-gray-50/50 dark:bg-[#0F0E13]">
      <main className="pt-10 px-4 md:px-8 pb-20 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              My Appointments
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your beauty sessions with Ronnie.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#943F54] transition-colors" />
              <input
                type="text"
                placeholder="Search by service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-full sm:w-[280px] bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:ring-2 focus:ring-[#943F54]/20 focus:border-[#943F54] transition-all outline-none"
              />
            </div>
            
            <button
              onClick={() => router.push('/book')}
              className="bg-[#943F54] hover:bg-[#7a3345] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-100 dark:shadow-none transition-all active:scale-95"
            >
              <FaPlus size={14} /> New Booking
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Unauthenticated State */
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-20 h-20 bg-pink-50 dark:bg-[#943F54]/10 rounded-full flex items-center justify-center mb-6 text-[#943F54]">
              <FaCalendarAlt size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Login to view bookings</h2>
            <p className="text-gray-500 text-sm mb-8 text-center max-w-xs">
              Keep track of your appointments, reschedule, and view your service history.
            </p>
            <Link
              href='/login'
              className="bg-[#943F54] text-white font-bold py-3 px-10 rounded-2xl hover:bg-[#D77A8B] transition-all"
            >
              Sign In
            </Link>
          </div>
        ) : (
          /* Authenticated State */
          <div className="space-y-6">
            {/* Custom Tab Switcher */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? "bg-[#943F54] text-white shadow-md" 
                      : "bg-white dark:bg-[#1A1A1A] text-gray-400 border border-gray-100 dark:border-gray-800 hover:text-gray-600"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table/Content Area */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="py-20"><Loading /></div>
              ) : (
                <BookingsTable
                  activeTab={activeTab}
                  searchQuery={searchQuery}
                  bookings={bookings}
                  currentPage={pagination.page}
                  rowsPerPage={pagination.limit}
                  totalBookings={pagination.total}
                  onPageChange={(p: any) => setPagination(prev => ({ ...prev, page: p }))}
                  onRowsPerPageChange={(r: any) => setPagination(prev => ({ ...prev, limit: r, page: 1 }))}
                  message={bookings.length === 0 ? "No appointments found" : ""}
                />
              )}
            </div>
          </div>
        )}
      </main>
      <BookingModal />
    </div>
  );
}