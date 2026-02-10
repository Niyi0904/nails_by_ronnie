"use client";

import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setSubServiceType, removeSubServiceType } from "@/redux/features/bookingSlice";
import { FaPlus, FaClock, FaTag } from "react-icons/fa";
import { MdRemove, MdCheckCircle } from "react-icons/md";
import { fetchCategories, fetchAllServices } from "@/functions/servicesFunc/function";
import Image from "next/image";

export default function ManicureStep() {
  const [categories, setCategories] = useState<any[]>([]);
  const [servicesGrouped, setServicesGrouped] = useState<Record<string, any[]>>({});
  const [activeSection, setActiveSection] = useState("");
  const [loading, setLoading] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { subServiceType } = useAppSelector((state) => state.booking);

  useEffect(() => {
    const loadBookingData = async () => {
      setLoading(true);
      try {
        const fetchedCats = await fetchCategories();
        const fetchedServs = await fetchAllServices();

        setCategories(fetchedCats);

        // Group services by categoryId for easy rendering
        const grouped = fetchedServs.reduce((acc: any, service: any) => {
          const catId = service.categoryId;
          if (!acc[catId]) acc[catId] = [];
          acc[catId].push(service);
          return acc;
        }, {});

        setServicesGrouped(grouped);
        console.log(grouped)
        if (fetchedCats.length > 0) setActiveSection(fetchedCats[0].id);
      } catch (error) {
        console.error("Error loading booking data:", error);
      }
      setLoading(false);
    };

    loadBookingData();
  }, []);

  // Intersection Observer for Scroll-Spy
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: scrollContainerRef.current, threshold: 0.5 }
    );

    const sections = document.querySelectorAll(".service-section");
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, [loading]);

  const isSelected = (id: string) => subServiceType.some((s) => s.id === id);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-[#943F54] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Menu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Category Navigation - Sticky */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#121015] pb-4 border-b border-gray-50 dark:border-gray-800 mb-6">
        <div className="flex p-1 bg-gray-50 dark:bg-gray-900 rounded-2xl w-fit mx-auto overflow-x-auto no-scrollbar max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                activeSection === cat.id
                  ? "bg-[#943F54] text-white shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-12 scroll-smooth custom-scrollbar"
        style={{ maxHeight: 'calc(100vh - 400px)' }}
      >
        {categories.map((cat) => {
          const services = servicesGrouped[cat.id] || [];
          if (services.length === 0) return null; // Don't show empty categories

          return (
            <section key={cat.id} id={cat.id} className="service-section">
              <div className="flex items-center gap-3 mb-4">
                 <h3 className="text-xl font-bold text-[#1c1c1c] dark:text-white capitalize">{cat.name}</h3>
                 <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`group relative flex items-center p-3 rounded-2xl border-2 transition-all duration-300
                      ${isSelected(service.id) 
                        ? "border-[#D77A8B] bg-pink-50/20 dark:bg-[#D77A8B]/5" 
                        : "border-gray-100 dark:border-gray-800 hover:border-[#D77A8B]/30 bg-white dark:bg-[#1A1A1A]"}`}
                  >
                    {/* Service Icon Placeholder (since we removed static images) */}
                    <div className="relative h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {service.imageUrl ? (
                        <Image src={service.imageUrl} alt={service.name} fill className="object-cover" />
                      ) : (
                        <FaTag className="text-gray-300 dark:text-gray-600 text-xl" />
                      )}
                      {isSelected(service.id) && (
                        <div className="absolute inset-0 bg-[#943F54]/40 flex items-center justify-center">
                          <MdCheckCircle className="text-white text-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#1c1c1c] dark:text-white group-hover:text-[#943F54] transition-colors">
                          {service.name}
                        </h4>
                        <span className="text-sm font-bold text-[#943F54]">
                          ₦{service.price.toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">{service.description}</p>
                      
                      <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                          <FaClock className="text-[#D77A8B]" /> {service.duration}
                        </div>
                      </div>
                    </div>

                    {/* Add/Remove Action */}
                    <button
                      onClick={() => {
                        if (isSelected(service.id)) {
                          dispatch(removeSubServiceType(service.id));
                        } else {
                          // ONLY dispatch the fields defined in your SubServiceType interface
                          dispatch(setSubServiceType({
                            id: service.id,
                            name: service.name,
                            price: service.price,
                            description: service.description,
                            image: service.imageUrl || "" // Ensure this matches your Redux interface key
                          }));
                        }
                      }}
                      className={`ml-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${isSelected(service.id)
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-50 hover:text-red-500"
                          : "bg-[#943F54] text-white shadow-lg shadow-pink-200 dark:shadow-none hover:scale-105"}`}
                    >
                      {isSelected(service.id) ? <MdRemove size={20} /> : <FaPlus size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}