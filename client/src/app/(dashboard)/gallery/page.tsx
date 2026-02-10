'use client';

import { FetchAllGallery } from '@/functions/galleryfunc/function';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoCloseOutline } from "react-icons/io5";
import Loading from '../my-bookings/loading';
import { motion, AnimatePresence } from 'framer-motion';

type Gallery = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

// ... (galleriesFallBack remains same)
const galleriesFallBack: Gallery[] = [
  {
    id: 1,
    name: 'Acrylic Nail',
    description: 'High-quality long-lasting polish.',
    imageUrl: '/assets/slider1.jpg',
  },
  {
    id: 2,
    name: 'French Nail',
    description: 'Precision trimming for clean cuticles.',
    imageUrl: '/assets/slider2.jpg',
  },
  {
    id: 3,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    imageUrl: '/assets/slider3.jpg',
  },
    {
    id: 4,
    name: 'French Nail',
    description: 'Smooth and shape your nails easily.',
    imageUrl: '/assets/slider4.jpg',
  },
    {
    id: 5,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    imageUrl: '/assets/slider2.jpg',
  },
    {
    id: 6,
    name: 'French Nail',
    description: 'Smooth and shape your nails easily.',
    imageUrl: '/assets/slider4.jpg',
  },
    {
    id: 7,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    imageUrl: '/assets/slider3.jpg',
  },
    {
    id: 8,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    imageUrl: '/assets/slider1.jpg',
  },
];

export default function GalleryPage() {
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [lightboxImage, setLightboxImage] = useState<Gallery | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const res = await FetchAllGallery();
        setGalleries(res || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  const filteredGallery = (galleries.length > 0 ? galleries : galleriesFallBack).filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // Reverted to owner's choice: bg-[#FFF0F5]
    <section className="min-h-screen pt-32 pb-20 px-[5%] bg-[#F9D8DA]  dark:bg-[#1E1B23]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-[#1c1c1c] dark:text-white">Full Lookbook</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{filteredGallery.length} Designs Found</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D77A8B]" />
          <input
            type="text"
            placeholder="Search designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // Kept input style matching your theme
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1A1A1A] border border-pink-100 dark:border-none rounded-2xl focus:ring-2 focus:ring-[#D77A8B] outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loading /></div>
      ) : (
        <>
          {filteredGallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-zoom-in bg-white dark:bg-gray-800 shadow-sm"
                  onClick={() => setLightboxImage(item)}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <p className="text-white/80 text-xs line-clamp-1">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40">
              <h3 className="text-xl text-gray-500">No designs match your search.</h3>
              <button 
                onClick={() => setSearch('')}
                className="mt-4 text-[#D77A8B] font-semibold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox - Logic fixed, colors preserved */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6"
            onClick={() => setLightboxImage(null)}
          >
            <button className="absolute top-10 right-10 text-white text-4xl hover:bg-white/10 rounded-full transition-all">
              <IoCloseOutline />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.name}
                className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl"
              />
              <div className="mt-8 text-center max-w-xl">
                <h2 className="text-white text-3xl font-bold">{lightboxImage.name}</h2>
                <p className="text-gray-300 mt-3 text-lg">{lightboxImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}