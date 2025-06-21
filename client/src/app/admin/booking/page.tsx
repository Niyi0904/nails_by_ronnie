"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api"; // Axios instance with baseURL & auth token
import { Booking } from "@/types/booking"; // Your Booking type
import { toast } from "react-hot-toast";
import {FaSearch, FaPlus } from 'react-icons/fa';
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useRef } from "react";


const statusOptions = ["confirmed", "pending", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState("");



  const router = useRouter();
  const {user, isAuthenticated} = useSelector((state: AppState) => state.auth);

  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/allBookings");
      setBookings(res.data.allBookings || []);
      setPagination((prev) => ({ ...prev, total: res.data.allBookings.length || 0 }));

      console.log(res.data.allBookings)
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
};

const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const patch = await api.patch(`booking/${bookingId}/status`, {
        status: newStatus,
      });
      console.log(patch.data);
      toast.success("Booking status updated!");
      fetchBookings();
    } catch (err) {
        console.error(err);
        toast.error("Failed to update booking.");
    }
};

const handleBack = () => {
    router.back();
};



const filteredBookings = bookings.filter(
(booking) =>
    booking.booking_status?.toLowerCase().includes(searchQuery.toLowerCase()) || booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.service_type.toLowerCase().includes(searchQuery.toLowerCase()) || booking.sub_category.toLowerCase().includes(searchQuery.toLowerCase())
);

useEffect(() => {
if (!user || user.role !== "admin") {
    router.push("/");

    return;
}
fetchBookings();
}, [user, pagination.page, pagination.limit]);

const totalPages = Math.ceil(pagination.total / pagination.limit);


  return (
    <div className="p-6 mt-15">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-3">
            <div className="text-2xl font-bold mb-4 flex gap-2">
                <button onClick={handleBack}
                >
                <IoArrowBack />
                </button>
                <h1 >Manage Bookings</h1>
            </div>
            <div className="relative flex items-center">
                <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                type="text"
                autoFocus
                placeholder="Search"
                value={searchQuery}
                className="pl-9 w-full border px-5 py-2 border-gray-400 rounded-lg md:w-[300px]"
                onChange={(e) => setSearchQuery(e.target.value)}

                />
            </div>
        </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead className="rounded-xl overflow-hidden">
            <tr className="bg-[#943F54] dark:bg-[#1F1F1F] rounded-tl-xl">
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left rounded-tl-md">Customer</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">Service</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">Sub-Service</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">Location</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">Phone</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">Date</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">Time</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left border-x border-gray-400 dark:border-gray-600">Status</th>
              <th className="p-3 sm:p-4 font-semibold text-white dark:text-[#F9D8DA] text-left rounded-tr-md">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <tr key={booking.id} className={`${index % 2 === 0 ? "bg-pink-50 dark:bg-[#2A262F]" : "bg-pink-100 dark:bg-[#3b3642]"} hover:bg-pink-200`}>
                <td className="p-3 sm:p-4 rounded-bl-md border-gray-400 dark:border-gray-700">{booking.name || "N/A"}</td>
                <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">{booking.service_type}</td>
                <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">{booking.sub_category}</td>
                <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">{booking.booking_location}</td>
                <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">{booking.phone}</td>
                <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">{booking.booking_date}</td>
                <td className="p-3 sm:p-4 border-x border-gray-400 dark:border-gray-700">{booking.booking_time}</td>
                <td className={`p-3 border-x border-gray-400 dark:border-gray-700 ${
                      booking.booking_status === 'confirmed' ? ' text-green-800' :
                      booking.booking_status === 'pending' ? ' text-yellow-500' :
                      booking.booking_status === 'completed' ? ' text-blue-800' :
                      ' text-red-800'
                    }`}>{booking.booking_status}</td>
                <td className="p-3 sm:p-4  rounded-br-md border-gray-400 dark:border-gray-700">
                    <select
                        className="border p-1 rounded dark:bg-[#1E1B23]"
                        value={booking.booking_status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                            {status}
                            </option>
                        ))}
                    </select>
                    <button
                        className="text-white mt-2 px-3 py-2 rounded-lg primary ml-3 disabled:cursor-not-allowed items-center-safe"
                        onClick={() => setSelectedBooking(booking)}
                    >
                        View
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex gap-4 items-center">
        <button
          disabled={pagination.page === 1}
          onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.page} of {totalPages}
        </span>
        <button
          disabled={pagination.page === totalPages}
          onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
        <select
          value={pagination.limit}
          onChange={(e) => setPagination({ ...pagination, page: 1, limit: Number(e.target.value) })}
          className="ml-4 border dark:bg-[#1E1B23] p-1 rounded"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FCE4EC] dark:bg-[#1E1B23] space-y-4 rounded-lg shadow p-6 w-full max-w-md">
            <h2 className="text-lg text-center font-semibold mb-6">Booking Details</h2>
            <p><strong>Customer:</strong> {selectedBooking.name}</p>
            <p><strong>Date:</strong> {selectedBooking.booking_date}</p>
            <p><strong>Time:</strong> {selectedBooking.booking_time}</p>
            <p><strong>Service:</strong> {selectedBooking.service_type}</p>
            <p><strong>Status:</strong> {selectedBooking.booking_status}</p>
            <p><strong>Location:</strong> {selectedBooking.booking_location}</p>
            <p><strong>Notes:</strong> {selectedBooking.additional_notes}</p>

            <button
              className="text-white px-3 py-2 rounded-lg primary ml-3 disabled:cursor-not-allowed items-center-safe"
              onClick={() => setSelectedBooking(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
