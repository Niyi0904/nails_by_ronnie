"use client";
import { useState } from "react";
import { FaBackward, FaForward } from "react-icons/fa";
import { Booking} from "@/types/booking";

// interface BookingsTableProps {
//   activeTab: BookingStatus;
//   searchQuery: string;
//   bookings: Booking[];
//   currentPage: number;
//   rowsPerPage: number;
//   totalBookings: number;
//   onPageChange: (page: number) => void;
//   onRowsPerPageChange: (value: number) => void; 
// }

export default function BookingsTable({
  activeTab,
  searchQuery,
  bookings,
  currentPage,
  rowsPerPage,
  totalBookings,
  onPageChange,
  onRowsPerPageChange,
  message
}: any) {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const filteredBookings = bookings.filter(
    (booking: any) =>
      booking.booking_status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.sub_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
       booking.booking_location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedBookings(
      checked ? filteredBookings.map((booking: any) => booking._id) : []
    );
  };

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    setSelectedBookings(
      checked
        ? [...selectedBookings, bookingId]
        : selectedBookings.filter((id) => id !== bookingId)
    );
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeSidebar = () => {
    setSelectedBooking(null);
  };


  const showCheckboxes = activeTab === "pending";
  const totalPages = Math.ceil(totalBookings / rowsPerPage);
  const hasData = totalBookings > 0;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalBookings);

  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 relative">
      {selectedBookings.length > 0 && showCheckboxes && (
        <div className="mb-4">
          <button 
            onClick={() => setCancelModalOpen(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 px-3 py-1.5 rounded border border-red-200 hover:bg-red-50 transition-colors"
          >
            <FaBackward className="h-4 w-4" /> Cancel Selected ({selectedBookings.length})
          </button>
        </div>
      )}

      <div className="min-w-[1000px]">
        <table className="w-full border-collapse">
          <thead className="rounded-xl overflow-hidden">
            <tr className="bg-[#943F54] dark:bg-[#1F1F1F] rounded-tl-xl">
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left rounded-tl-md">
                Service Type
              </th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">
                Sub-Service Type
              </th>
              <th className="p-3 sm:p-4 text-white dark:text-[#F9D8DA] font-semibold border-x text-left border-gray-400 dark:border-gray-600">
                Address
              </th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">
                Date
              </th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">
                Time
              </th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left rounded-tr-md">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              filteredBookings.map((booking: any, index: any) => (
                <tr key={booking.id} className={`${index % 2 === 0 ? "bg-pink-50 dark:bg-[#2A262F]" : "bg-pink-100 dark:bg-[#3b3642]"} hover:bg-pink-200`}>
                  <td className="p-3 sm:p-4 rounded-bl-md border-gray-400 dark:border-gray-700">
                      {booking.service_type || "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">
                    {booking.sub_category || "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">
                    {booking.booking_location || "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">
                    {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">
                    {booking.booking_time || "N/A"}
                  </td>
                  <td className="p-3 sm:p-4 rounded-br-md border-gray-400 dark:border-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.booking_status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.booking_status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showCheckboxes ? 7 : 6}
                  className="p-4 text-center text-gray-500"
                >
                  {message}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
            disabled={!hasData}
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>
            {hasData 
              ? `Showing ${startRow}-${endRow} of ${totalBookings}`
              : 'No records available'}
          </span>
        </div>

        {hasData && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaBackward className="h-4 w-4" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-9 h-9 rounded-md text-sm flex items-center justify-center ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FaForward className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* {selectedBooking && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-50 z-40"></div>
          <BookingDetailsSidebar
            booking={selectedBooking}
            onClose={closeSidebar}
          />
        </>
      )} */}
    </div>
  );
}