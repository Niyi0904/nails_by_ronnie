"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api"; // Axios instance with baseURL & auth token
import { Booking } from "@/types/booking"; // Your Booking type
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";


const statusOptions = ["confirmed", "pending", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {user, isAuthenticated} = useSelector((state: AppState) => state.auth);

  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/booking/allBookings");
      setBookings(res.data.allBookings || []);
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
    useEffect(() => {
    if (!user || user.role !== "admin") {
        router.push("/");

        return;
    }
    fetchBookings();
    }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Manage Bookings</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Customer</th>
              <th className="p-3">Service</th>
              <th className="p-3">Sub-Service</th>
              <th className="p-3">Location</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-3">{booking.name || "N/A"}</td>
                <td className="p-3">{booking.service_type}</td>
                <td className="p-3">{booking.sub_category}</td>
                <td className="p-3">{booking.booking_location}</td>
                <td className="p-3">{booking.phone}</td>
                <td className="p-3">{booking.booking_date}</td>
                <td className="p-3">{booking.booking_time}</td>
                <td className="p-3 capitalize">{booking.booking_status}</td>
                <td className="p-3">
                  <select
                    className="border p-1 rounded"
                    value={booking.booking_status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
