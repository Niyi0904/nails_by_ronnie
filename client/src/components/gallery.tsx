'use client';

import Image from 'next/image';
import Link from "next/link";


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
    name: 'French Nail',
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
    name: 'Acrylic Nail',
    description: 'Smooth and shape your nails easily.',
    image: '/assets/slider4.jpg',
  },
    {
    id: 7,
    name: 'French Nail',
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

export default function GallerySection() {
  return (
    <section className="mt-25 text-[#1c1c1c] dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Our Gallery
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {galleries.map(gallery => (
          <div key={gallery.id} className='relative'>
            <div className='relative w-full h-52 aspect-auto rounded-xl'>
              <Image
                src={gallery.image}
                alt={gallery.name}
                fill
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
