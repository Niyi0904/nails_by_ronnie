'use client';

import { FetchAllGallery } from '@/functions/galleryfunc/function';
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { MdCancel } from "react-icons/md";



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
    name: 'French Nail',
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
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    imageUrl: '/assets/slider4.jpg',
  },
    {
    id: 7,
    name: 'French Nail',
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

type Gallery = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

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
    <section className="mt-25 text-[#1c1c1c] dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Our Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {(galleries.slice(0, 10) || galleriesFallBack).map(gallery => (
          <div key={gallery.id} className='relative'>
            <div className='relative w-full h-52 aspect-auto rounded-xl' onClick={() => setLightboxImage(gallery)}>
              <Image
                src={gallery.imageUrl}
                alt={gallery.name}
                fill
                className='object-cover rounded-sm'
              />
            </div>
            <div className='text-white w-full absolute top-[70%] left-1'>
              <h1>{gallery.name}</h1>
              <h1 className='text-xs '>{gallery.description}</h1>
            </div>
          </div>
        ))}
      </div>

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

      <div className='flex justify-center'>
        <Link
          href="/gallery"
          className="text-white mt-3 px-5 py-2 rounded-lg primary flex justify-center w-[50%] sm:w-[35%] items-center-safe"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
