"use client";

import { useEffect, useState, useMemo } from "react";
import { Booking } from "@/types/booking";
import { toast } from "react-hot-toast";
import { FaSearch, FaRegCalendarAlt, FaPhoneAlt, FaMapMarkerAlt, FaFileDownload } from 'react-icons/fa';
import { IoArrowBack, IoClose, IoTrashOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { FetchAllBookings, updateBooking, deleteBooking } from "@/functions/bookingfunc/fetchBookings";
import { motion, AnimatePresence } from "framer-motion";

const statusOptions = ["confirmed", "pending", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { user } = useSelector((state: AppState) => state.auth);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await FetchAllBookings();
      const data = Array.isArray(res) ? res : [];
      setBookings(data);
      setPagination((prev) => ({ ...prev, total: data.length }));
    } catch (err) {
      toast.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  // --- CSV Export Logic ---
  const exportToCSV = (dataToExport: Booking[]) => {
    if (dataToExport.length === 0) return toast.error("No data to export");

    const headers = ["Name", "Email", "Phone", "Service", "Sub-Categories", "Date", "Time", "Location", "Status", "Notes"];
    
    const csvRows = dataToExport.map(b => [
      `"${b.name}"`,
      `"${b.email}"`,
      `"${b.phone}"`,
      `"${b.service_type}"`,
      `"${Array.isArray(b.sub_category) ? b.sub_category.map((s: any) => s.name).join(", ") : b.sub_category}"`,
      `"${b.booking_date}"`,
      `"${b.booking_time}"`,
      `"${b.booking_location}"`,
      `"${b.booking_status}"`,
      `"${b.additional_notes?.replace(/"/g, '""') || ""}"`
    ].join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success("Report downloaded successfully");
  };

  const updateStatus = async (bookingId: string, newStatus: string, bookingEmail: string) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      await updateBooking(bookingId, newStatus, bookingEmail);
      toast.success("Status updated", { id: loadingToast });
      fetchBookings();
    } catch (err) {
      toast.error("Update failed", { id: loadingToast });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    setIsBulkUpdating(true);
    const loadingToast = toast.loading(`Updating ${selectedIds.length} bookings...`);
    try {
      const updatePromises = selectedIds.map(id => {
        const booking = bookings.find(b => b.id === id);
        return updateBooking(id, newStatus, booking?.email || "");
      });
      await Promise.all(updatePromises);
      toast.success(`Updated ${selectedIds.length} bookings`, { id: loadingToast });
      setSelectedIds([]);
      fetchBookings();
    } catch (err) {
      toast.error("Some updates failed.", { id: loadingToast });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} bookings?`)) return;

    const loadingToast = toast.loading(`Deleting ${selectedIds.length} bookings...`);
    try {
      const deletePromises = selectedIds.map(id => {
        const booking = bookings.find(b => b.id === id);
        return deleteBooking(id, booking?.email || "");
      });
      await Promise.all(deletePromises);
      toast.success("Bookings deleted", { id: loadingToast });
      setSelectedIds([]);
      fetchBookings();
    } catch (err) {
      toast.error("Failed to delete some bookings.", { id: loadingToast });
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(b => b.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking: any) => {
      const query = searchQuery.toLowerCase();
      const name = booking.name?.toLowerCase() || "";
      const service = booking.service_type?.toLowerCase() || "";
      const location = booking.booking_location?.toLowerCase() || "";
      const subMatch = Array.isArray(booking.sub_category) 
        ? booking.sub_category.some((s: any) => s.name?.toLowerCase().includes(query))
        : booking.sub_category?.toLowerCase().includes(query);

      return name.includes(query) || service.includes(query) || location.includes(query) || subMatch;
    });
  }, [bookings, searchQuery]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchBookings();
  }, [user]);

  const totalPages = Math.ceil(filteredBookings.length / pagination.limit) || 1;
  const paginatedData = filteredBookings.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 bg-[#F9D8DA] dark:bg-[#0F0E13]">
      <div className="max-w-7xl mx-auto relative">

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 shadow-2xl px-6 py-4 rounded-[2rem] flex items-center gap-4"
            >
              <div className="flex items-center gap-3 pr-4 border-r border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 bg-[#943F54] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {selectedIds.length}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => handleBulkStatusUpdate(status)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 ${getStatusStyles(status)}`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-2" />

              <button 
                onClick={() => exportToCSV(bookings.filter(b => selectedIds.includes(b.id)))}
                className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-[#943F54] hover:text-white transition-all"
                title="Export Selected"
              >
                <FaFileDownload size={16} />
              </button>

              <button 
                onClick={handleBulkDelete}
                className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
              >
                <IoTrashOutline size={18} />
              </button>
              
              <button onClick={() => setSelectedIds([])} className="p-2 text-gray-400 hover:text-gray-600">
                <IoClose size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm hover:text-[#943F54] transition-colors">
              <IoArrowBack size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black dark:text-white tracking-tight">Booking Management</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{filteredBookings.length} Total Records</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#943F54] transition-colors" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 w-full md:w-[300px] bg-white dark:bg-[#1A1A1A] rounded-2xl border-none shadow-sm outline-none text-sm transition-all"
              />
            </div>
            <button 
              onClick={() => exportToCSV(filteredBookings)}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#1A1A1A] text-[#943F54] rounded-2xl font-bold text-sm shadow-sm hover:bg-[#943F54] hover:text-white transition-all"
            >
              <FaFileDownload />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-[#1F1F1F] text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-5 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-[#943F54] cursor-pointer"
                  />
                </th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Service Details</th>
                <th className="px-6 py-5">Schedule</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center animate-pulse">Loading Bookings...</td></tr>
              ) : paginatedData.map((booking: any) => (
                <tr key={booking.id} className={`hover:bg-gray-50/50 dark:hover:bg-[#252129] transition-colors group ${selectedIds.includes(booking.id) ? 'bg-[#943F54]/5' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(booking.id)}
                      onChange={() => toggleSelect(booking.id)}
                      className="w-4 h-4 rounded accent-[#943F54] cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 dark:text-gray-100">{booking.name}</div>
                    <div className="text-xs text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-[#943F54]">{booking.service_type}</div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[200px]">
                      {Array.isArray(booking.sub_category) ? booking.sub_category.map((s: any) => s.name).join(", ") : booking.sub_category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold dark:text-gray-300">{booking.booking_date}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1">
                      <FaRegCalendarAlt size={10} /> {booking.booking_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(booking.id, e.target.value, booking.email)}
                      className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg border-none focus:ring-0 cursor-pointer ${getStatusStyles(booking.status)}`}
                    >
                      {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedBooking(booking)} className="px-4 py-2 bg-[#943F54]/10 text-[#943F54] rounded-xl text-xs font-bold hover:bg-[#943F54] hover:text-white transition-all">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button 
              disabled={pagination.page === 1}
              onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
              className="p-2 disabled:opacity-20 hover:text-[#943F54]"
            ><IoArrowBack /></button>
            <span className="text-xs font-bold px-4">{pagination.page} / {totalPages}</span>
            <button 
              disabled={pagination.page === totalPages}
              onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
              className="p-2 disabled:opacity-20 hover:text-[#943F54] rotate-180"
            ><IoArrowBack /></button>
          </div>
          <select 
             onChange={(e) => setPagination(p => ({...p, limit: Number(e.target.value), page: 1}))}
             className="bg-transparent border-none text-xs font-bold outline-none"
          >
            {[10, 20, 50].map(n => <option key={n} value={n}>{n} rows</option>)}
          </select>
        </div>
      </div>

      {/* Sidebar Details */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#1A1A1A] z-[70] shadow-2xl p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black dark:text-white">Booking Snapshot</h2>
                <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <IoClose size={24} />
                </button>
              </div>
              <div className="space-y-8">
                <section>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3 block">Client Information</label>
                  <div className="p-4 bg-gray-50 dark:bg-[#252129] rounded-2xl">
                    <p className="font-bold text-lg dark:text-white">{selectedBooking.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2"><FaPhoneAlt size={12}/> {selectedBooking.phone}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1"><FaMapMarkerAlt size={12}/> {selectedBooking.booking_location}</div>
                  </div>
                </section>
                <section>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3 block">Service Summary</label>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-bold dark:text-gray-200">{selectedBooking.service_type}</span></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Treatments</span>
                      <span className="font-bold text-[#943F54] text-right">
                        {Array.isArray(selectedBooking.sub_category) ? selectedBooking.sub_category.map((s: any) => s.name).join(", ") : selectedBooking.sub_category}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 block">Notes</label>
                       <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-pink-50/30 dark:bg-pink-900/10 p-3 rounded-lg">"{selectedBooking.additional_notes || "No notes."}"</p>
                    </div>
                  </div>
                </section>
                <button onClick={() => setSelectedBooking(null)} className="w-full py-4 bg-[#943F54] text-white font-black rounded-2xl">Done</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
    case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400';
    default: return 'bg-gray-100 text-gray-700';
  }
}