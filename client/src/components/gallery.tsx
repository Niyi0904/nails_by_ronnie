'use client';

import { FetchAllGallery } from '@/functions/galleryfunc/function';
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from 'react';


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
            <div className='relative w-full h-52 aspect-auto rounded-xl'>
              <Image
                src={gallery.imageUrl}
                alt={gallery.name}
                fill
                className='object-cover rounded-xs'
              />
            </div>
            <div className='text-white w-full absolute top-[70%] left-1'>
              <h1>{gallery.name}</h1>
              <h1 className='text-xs '>{gallery.description}</h1>
            </div>
          </div>
        ))}
      </div>

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
