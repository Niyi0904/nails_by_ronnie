'use client';

import Image from 'next/image';
import { use, useState } from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import sampleProducts from '@/components/shopData/shopData';
import api from '@/utils/api';


type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
};

const galleries: Product[] = [
  {
    id: 1,
    name: 'Acrylic Nail',
    description: 'High-quality long-lasting polish.',
    image: '/assets/slider1.jpg',
  },
  {
    id: 2,
    name: 'French Nail',
    description: 'Precision trimming for clean cuticles.',
    image: '/assets/slider2.jpg',
  },
  {
    id: 3,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    image: '/assets/slider3.jpg',
  },
    {
    id: 4,
    name: 'French Nail',
    description: 'Smooth and shape your nails easily.',
    image: '/assets/slider4.jpg',
  },
    {
    id: 5,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    image: '/assets/slider2.jpg',
  },
    {
    id: 6,
    name: 'French Nail',
    description: 'Smooth and shape your nails easily.',
    image: '/assets/slider4.jpg',
  },
    {
    id: 7,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    image: '/assets/slider3.jpg',
  },
    {
    id: 8,
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    image: '/assets/slider1.jpg',
  },
];


export default function ReviewPage() {
  const [search, setSearch] = useState<string>('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const filteredGallery = galleries.filter(gallery => gallery.name.toLowerCase().includes(search.toLowerCase()));


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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredGallery.map(gallery => (
            <div key={gallery.id} className='relative'>
            <div className='relative w-full h-52 rounded-xl'>
                <Image
                src={gallery.image}
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
    </section>
  );
}
