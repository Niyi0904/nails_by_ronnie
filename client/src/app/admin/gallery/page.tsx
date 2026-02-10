"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa';
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { openModal } from "@/redux/features/gallerySlice";

import AdminModal from "@/components/adminGallery/admin-modal";
import { FetchAllGallery } from "@/functions/galleryfunc/function";
import Loading from "@/app/(dashboard)/my-bookings/loading";

type GalleryItem = {
  id: string | number;
  name: string;
  description: string;
  imageUrl: string;
};

export default function AdminGalleryPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { user } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const res = await FetchAllGallery();
      setGalleries(res || []);
    } catch (err) {
      toast.error("Failed to fetch gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchGalleries();
  }, [user, router]);

  // Memoized filter for performance
  const filteredGallery = useMemo(() => {
    return galleries.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, galleries]);

  return (
    <div className="p-6 mt-16 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <IoArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">Manage Gallery</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-[250px] border border-gray-300 dark:border-gray-700 dark:bg-[#1A1A1A] rounded-lg focus:ring-2 focus:ring-[#943F54] outline-none transition-all"
            />
          </div>

          <button
            onClick={() => dispatch(openModal())}
            className="w-full sm:w-auto bg-[#943F54] text-white px-5 py-2 rounded-lg hover:bg-[#7a3445] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <FaPlus size={14} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <Loading />
      ) : filteredGallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div 
              key={item.id} 
              className="group relative h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
              onClick={() => setLightboxImage(item)}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg leading-tight">{item.name}</h3>
                <p className="text-gray-200 text-xs line-clamp-2 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No gallery items found.</p>
        </div>
      )}

      {/* Lightbox / Preview */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-10"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes size={28} />
            </button>
            
            <div className="relative flex-1 overflow-hidden rounded-t-2xl">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.name}
                className="w-full h-full object-contain bg-black/20"
              />
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-b-2xl">
              <h2 className="text-xl font-bold dark:text-white mb-2">{lightboxImage.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{lightboxImage.description}</p>
            </div>
          </div>
        </div>
      )}

      <AdminModal onAction={fetchGalleries} />
    </div>
  );
}