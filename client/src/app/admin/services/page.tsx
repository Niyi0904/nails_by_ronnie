"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { addServiceCategory, fetchCategories, addNewService, fetchAllServices } from "@/functions/servicesFunc/function";
import { FaLayerGroup, FaTag, FaClock } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function ServiceManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [catName, setCatName] = useState("");
  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: 0,
    durationHours: "0",
    durationMinutes: "30",
    description: "",
    categoryId: ""
  });

  const loadData = async () => {
    try {
      const cats = await fetchCategories();
      const servs = await fetchAllServices();
      setCategories(Array.isArray(cats) ? cats : []);
      setServices(Array.isArray(servs) ? servs : []);
    } catch (error) {
      console.error("Load error:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return toast.error("Category name is required");
    setLoading(true);
    try {
      await addServiceCategory(catName);
      toast.success("Category Created!");
      setCatName("");
      loadData();
    } catch (err) { toast.error("Error creating category"); }
    setLoading(false);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.categoryId) return toast.error("Select a category");
    if (!serviceForm.name) return toast.error("Service name is required");

    setLoading(true);
    const finalDuration = `${serviceForm.durationHours}hr ${serviceForm.durationMinutes}m`;
    
    try {
      await addNewService({
        name: serviceForm.name,
        price: serviceForm.price,
        duration: finalDuration,
        description: serviceForm.description,
        categoryId: serviceForm.categoryId
      });
      toast.success("Service Added!");
      setServiceForm({ 
        name: "", price: 0, durationHours: "0", durationMinutes: "30", description: "", categoryId: "" 
      });
      loadData();
    } catch (err) { toast.error("Error adding service"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 bg-[#F9D8DA] dark:bg-[#0F0E13]">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm hover:text-[#943F54] transition-colors border border-gray-100 dark:border-gray-800"
          >
            <IoArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black dark:text-white tracking-tight">Service Management</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Update your offerings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category Creation */}
          <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-[2rem] shadow-sm h-fit">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <FaLayerGroup className="text-[#943F54]" /> New Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <input 
                type="text" placeholder="Category Name (e.g. Manicure)" 
                value={catName} onChange={(e) => setCatName(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 ring-[#943F54]/20 transition-all" 
              />
              <button disabled={loading} className="w-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-[#943F54] transition-all disabled:opacity-50">
                Create Category
              </button>
            </form>
          </div>

          {/* Service Creation */}
          <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-[2rem] shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <FaTag className="text-[#943F54]" /> Add New Service
            </h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <select 
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none cursor-pointer"
                onChange={(e) => setServiceForm({...serviceForm, categoryId: e.target.value})}
                value={serviceForm.categoryId}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <input 
                type="text" placeholder="Service Name" 
                value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 ring-[#943F54]/20" 
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">₦</span>
                  <input 
                    type="number" placeholder="Price" 
                    className="w-full pl-8 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none" 
                    onChange={(e) => setServiceForm({...serviceForm, price: Number(e.target.value)})} 
                    value={serviceForm.price || ""}
                  />
                </div>

                {/* Duration Picker Group */}
                <div className="flex gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-1">
                  <select 
                    className="w-1/2 bg-transparent p-3 text-sm font-bold outline-none cursor-pointer"
                    value={serviceForm.durationHours}
                    onChange={(e) => setServiceForm({...serviceForm, durationHours: e.target.value})}
                  >
                    {[0, 1, 2, 3, 4, 5].map(h => <option key={h} value={h}>{h}h</option>)}
                  </select>
                  <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-700 my-auto" />
                  <select 
                    className="w-1/2 bg-transparent p-3 text-sm font-bold outline-none cursor-pointer"
                    value={serviceForm.durationMinutes}
                    onChange={(e) => setServiceForm({...serviceForm, durationMinutes: e.target.value})}
                  >
                    {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}m</option>)}
                  </select>
                </div>
              </div>

              <textarea 
                placeholder="Service Description" 
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 h-24 border-none outline-none resize-none"
                onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                value={serviceForm.description}
              />

              <button disabled={loading} className="w-full py-4 bg-[#943F54] text-white font-bold rounded-2xl hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? "Processing..." : "Add Service"}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-12 bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black">Active Service Menu</h2>
              <span className="px-4 py-1 bg-[#943F54]/10 text-[#943F54] text-xs font-bold rounded-full">
                {services.length} Total Services
              </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length === 0 ? (
                <p className="col-span-full text-center py-10 text-gray-400 font-medium italic">No services added yet.</p>
              ) : (
                services.map(s => (
                  <div key={s.id} className="group p-5 bg-gray-50 dark:bg-[#252129] border border-transparent hover:border-[#943F54]/30 rounded-[1.5rem] transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#943F54]">
                        {categories.find(c => c.id === s.categoryId)?.name || 'Uncategorized'}
                      </p>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <FaClock size={10} />
                        {s.duration}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1 dark:text-white">{s.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{s.description || "No description provided."}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="font-black text-[#943F54]">₦{s.price?.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}