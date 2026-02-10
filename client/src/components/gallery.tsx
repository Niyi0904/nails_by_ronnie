'use client';

import { FetchAllGallery } from '@/functions/galleryfunc/function';
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from "react-icons/io5";

type Gallery = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

const galleriesFallBack: Gallery[] = [
  { id: 1, name: 'Crystal Acrylics', description: 'Long-lasting luxury finish.', imageUrl: '/assets/slider1.jpg' },
  { id: 2, name: 'Modern French', description: 'Clean lines and classic tips.', imageUrl: '/assets/slider2.jpg' },
  { id: 3, name: 'Nude Elegance', description: 'Minimalist sophisticated shades.', imageUrl: '/assets/slider3.jpg' },
  { id: 4, name: 'Velvet Matte', description: 'Smooth texture for a bold look.', imageUrl: '/assets/slider4.jpg' },
  { id: 5, name: 'Marble Art', description: 'Hand-painted custom designs.', imageUrl: '/assets/slider2.jpg' },
  { id: 6, name: 'Ombre Dream', description: 'Seamless color transitions.', imageUrl: '/assets/slider4.jpg' },
  { id: 7, name: 'Chrome Shine', description: 'Futuristic high-gloss finish.', imageUrl: '/assets/slider3.jpg' },
  { id: 8, name: 'Floral Accents', description: 'Delicate botanical details.', imageUrl: '/assets/slider1.jpg' },
];

export default function GallerySection() {
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [lightboxImage, setLightboxImage] = useState<Gallery | null>(null);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const res = await FetchAllGallery();
      setGalleries(res || []);
    } catch (err) {
      throw new Error('unable to fetch gallery')
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchGalleries();
    }, []);

  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-[#D77A8B] font-bold tracking-widest uppercase text-xs mb-2">Our Work</h2>
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white">The Lookbook</h1>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          // Simple Skeleton Loader
          Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
          ))
        ) : (
          galleries.slice(0, 8).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setLightboxImage(item)}
              className="group relative cursor-zoom-in overflow-hidden rounded-2xl bg-gray-200 aspect-[3/4]"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Professional Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold text-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {item.name}
                </h3>
                <p className="text-white/80 text-xs translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-12">
        <Link
          href="/gallery"
          className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-[#D77A8B] rounded-full hover:bg-[#c46a7a] shadow-lg shadow-pink-200 dark:shadow-none"
        >
          View Full Gallery
        </Link>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            {/* Close Button - Positioned top right of screen */}
            <button 
              className="absolute top-8 right-8 text-white text-4xl p-2 hover:bg-white/10 rounded-full transition-all"
              onClick={() => setLightboxImage(null)}
            >
              <IoCloseOutline />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center max-w-4xl w-full"
            >
              {/* Image Container - Constrained height so text always fits */}
              <div className="relative w-full max-h-[70vh] flex justify-center">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Text Area - Clearly visible below the image */}
              <div className="mt-6 text-center px-4 max-w-2xl">
                <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                  {lightboxImage.name}
                </h2>
                <div className="h-0.5 w-12 bg-[#D77A8B] mx-auto my-3"></div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {lightboxImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}