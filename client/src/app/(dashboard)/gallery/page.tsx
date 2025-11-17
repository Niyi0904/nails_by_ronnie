'use client';

import { FetchAllGallery } from '@/functions/galleryfunc/function';
import Image from 'next/image';
import {useEffect, useState } from 'react';
import {FaSearch } from 'react-icons/fa';
import Loading from '../my-bookings/loading';



type Gallery = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

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
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const filteredGallery = (galleries || galleriesFallBack).filter(gallery => gallery.name.toLowerCase().includes(search.toLowerCase()));


  return (
    <section className="mt-20 mx-[5%] text-[#1c1c1c] dark:text-white">
        <div className='flex flex-col md:flex-row justify-between mb-7'>
            <h2 className="text-3xl font-bold mb-8 md:mb-0">
                Gallery
            </h2>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-[50%] transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border bg-[#FFF0F5] dark:bg-[#2a2a2a] rounded-lg w-full"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                />
              </div>
            </div>
        </div>

        {
          loading ? (
            <Loading/>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredGallery.map(gallery => (
                <div key={gallery.id} className='relative'>
                <div className='relative w-full h-52 rounded-xl' onClick={() => setLightboxImage(gallery)}>
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
    </section>
  );
}
