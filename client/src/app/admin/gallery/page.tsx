"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utils/api"; // Axios instance with baseURL & auth token
import { toast } from "react-hot-toast";
import {FaSearch, FaPlus } from 'react-icons/fa';
import { openModal } from "@/redux/features/gallerySlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import { useRef } from "react";
import AdminModal from "@/components/adminGallery/admin-modal";
import { FetchAllGallery } from "@/functions/galleryfunc/function";
import Loading from "@/app/(dashboard)/my-bookings/loading";


type Gallery = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

// const galleries: Gallery[] = [
//   {
//     id: 1,
//     name: 'Acrylic Nail',
//     description: 'High-quality long-lasting polish.',
//     image: '/assets/slider1.jpg',
//   },
//   {
//     id: 2,
//     name: 'French Nail',
//     description: 'Precision trimming for clean cuticles.',
//     image: '/assets/slider2.jpg',
//   },
//   {
//     id: 3,
//     name: 'Acrylic Nail',
//     description: 'Smooth and shape your nails easily.',
//     image: '/assets/slider3.jpg',
//   },
//     {
//     id: 4,
//     name: 'French Nail',
//     description: 'Smooth and shape your nails easily.',
//     image: '/assets/slider4.jpg',
//   },
//     {
//     id: 5,
//     name: 'Acrylic Nail',
//     description: 'Smooth and shape your nails easily.',
//     image: '/assets/slider2.jpg',
//   },
//     {
//     id: 6,
//     name: 'French Nail',
//     description: 'Smooth and shape your nails easily.',
//     image: '/assets/slider4.jpg',
//   },
//     {
//     id: 7,
//     name: 'Acrylic Nail',
//     description: 'Smooth and shape your nails easily.',
//     image: '/assets/slider3.jpg',
//   },
//     {
//     id: 8,
//     name: 'Acrylic Nail',
//     description: 'Smooth and shape your nails easily.',
//     image: '/assets/slider1.jpg',
//   },
// ];


export default function AdminBookingsPage() {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const {user, isAuthenticated} = useSelector((state: AppState) => state.auth);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [lightboxImage, setLightboxImage] = useState<Gallery | null>(null);


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
  }, [user]);




  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const handleBack = () => {
      router.back();
  };

  const handleOpenModel = () => {
    dispatch(openModal());
  }
      
  const filteredGallery = galleries.filter(gallery => gallery.name.toLowerCase().includes(search.toLowerCase()));
  

  return (
    <div className="p-6 mt-15">
      <div>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-3">
              <div className="text-2xl font-bold mb-4 flex gap-2">
                  <button onClick={handleBack}
                  >
                  <IoArrowBack />
                  </button>
                  <h1 >Manage Gallery</h1>
              </div>
              <div className="relative flex items-center gap-4">
                <div>
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                  type="text"
                  autoFocus
                  placeholder="Search"
                  value={search}
                  className="pl-9 w-full border px-5 py-2 border-gray-400 rounded-lg md:w-[300px]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                  />
                </div>

                <button
                  onClick={handleOpenModel}
                  className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#943F54] flex justify-center items-center-safe hover:text-white primary"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Add to gallery
                </button>
              </div>
          </div>
          
          {
            loading? (
              <Loading/>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGallery.map(gallery => (
                    <div key={gallery.id} className='relative'>
                    <div className='relative w-full h-52 rounded-xl' onClick={() => setLightboxImage(gallery)}
>
                      <Image
                      src={gallery.imageUrl}
                      alt={gallery.name}
                      fill
                      className='rounded-xl'
                      />
                    </div>
                    <div className='text-white w-full absolute top-[70%] left-1'>
                        <h1>{gallery.name}</h1>
                        <h1 className='text-xs '>{gallery.description}</h1>
                    </div>
                    </div>
                ))}
              </div>
            )
          }

          {lightboxImage && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setLightboxImage(null)}
            >
              <div
                className="relative max-w-3xl w-full animate-zoom"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={lightboxImage.imageUrl}
                  alt="Image preview"
                  className="w-full h-auto rounded-xl shadow-2xl"
                />

                <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm p-4 rounded-b-xl text-center">
                  <h2 className="text-white text-lg md:text-xl font-semibold text-center mb-1">
                    {lightboxImage.name || 'Untitled'}
                  </h2>

                  <p className="text-white/90 text-sm md:text-base text-center">
                    {lightboxImage.description || 'No description available.'}
                  </p>
                </div>

                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute -top-6 right-0 text-white text-3xl"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
      </div>
      <AdminModal onAction={fetchGalleries}/>
    </div>
  );
}
