"use client";

import { useEffect, useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import { Booking } from "@/types/booking";

export default function BookingsTable({
  activeTab,
  searchQuery,
  bookings,
  message
}: any) {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  // Filter logic memoized for performance
  const filteredBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    
    return bookings.filter((booking: any) => {
      // 1. Filter by Tab Status (The logic: Is it the "all" tab? OR does the status match?)
      const matchesTab = activeTab === "all" || booking.status === activeTab;
      
      // If it doesn't match the tab criteria, skip this booking immediately
      if (!matchesTab) return false;

      // 2. Filter by Search Query
      const query = searchQuery.toLowerCase();
      
      // Check if query exists in location, service, or sub-categories
      const matchesLocation = booking.booking_location?.toLowerCase().includes(query);
      const matchesService = booking.service_type?.toLowerCase().includes(query);
      const matchesSub = booking.sub_category?.some((sub: any) => 
        sub.name.toLowerCase().includes(query)
      );

      // Final result: Must match tab (from step 1) AND (Search Query must be empty OR match a field)
      return !searchQuery || matchesLocation || matchesService || matchesSub;
    });
  }, [bookings, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredBookings.length / pagination.limit) || 1;
  const paginatedData = filteredBookings.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <th className="px-6 py-4 text-left">Service & Treatments</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Schedule</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedData.length > 0 ? (
              paginatedData.map((booking: any) => (
                <tr 
                  key={booking.id} 
                  className="bg-white dark:bg-[#1E1B23] group hover:shadow-md transition-all duration-200"
                >
                  {/* Service Column */}
                  <td className="px-6 py-5 rounded-l-[1.5rem] border-y border-l border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-gray-800 dark:text-gray-100">{booking.service_type}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {booking.sub_category?.map((sub: any, i: number) => (
                        <span key={i} className="text-[10px] text-[#943F54] bg-[#943F54]/5 px-2 py-0.5 rounded-md font-medium">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Location Column */}
                  <td className="px-6 py-5 border-y border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaMapMarkerAlt className="text-[#D77A8B]" size={12} />
                      <span className="truncate max-w-[150px]">{booking.booking_location || "Studio"}</span>
                    </div>
                  </td>

                  {/* Date/Time Column */}
                  <td className="px-6 py-5 border-y border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A"}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <FaRegClock size={10} /> {booking.booking_time}
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-5 rounded-r-[1.5rem] border-y border-r border-gray-100 dark:border-gray-800 text-center">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-gray-400 italic">
                  {message || "No records found for this category."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">View</label>
          <select
            value={pagination.limit}
            onChange={(e) => setPagination({ page: 1, limit: Number(e.target.value) })}
            className="bg-transparent border-b-2 border-gray-200 dark:border-gray-800 text-sm font-bold focus:border-[#943F54] outline-none transition-colors px-1"
          >
            {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-[#1A1A1A] px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
            className="p-2 text-gray-400 hover:text-[#943F54] disabled:opacity-20 transition-colors"
          >
            <FaChevronLeft size={14} />
          </button>
          
          <span className="text-xs font-black text-gray-600 dark:text-gray-300 min-w-[80px] text-center uppercase tracking-widest">
            {pagination.page} / {totalPages}
          </span>

          <button
            disabled={pagination.page === totalPages}
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
            className="p-2 text-gray-400 hover:text-[#943F54] disabled:opacity-20 transition-colors"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-component for badges
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    pending: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    completed: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    cancelled: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  };

  return (
    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}