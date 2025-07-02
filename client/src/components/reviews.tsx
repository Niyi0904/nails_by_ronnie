'use client';

import { FaStar } from 'react-icons/fa';
import Link from "next/link";
import toast from 'react-hot-toast';


type Review = {
  id: number;
  name: string;
  description: string;
  stars: number;
};

const reviews: Review[] = [
  {
    id: 1,
    name: 'Niyi Owoyemi',
    description: 'They have the best services and their customer approach is the best, i rocommend this as the best nailtech in Lagos',
    stars: 5,
  },
];

    const getInitials = (fullName: string) => {
        const names = fullName.trim().split(" ");
        const firstInitial = names[0]?.[0] ?? "";
        const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
        return (firstInitial + lastInitial).toUpperCase();
    };

export default function ReviewSection() {
  return (
    <section className="mt-25 text-[#1c1c1c] dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Reviews
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {reviews.map(review => {
            const totalStars = 5;
        return (
            <div key={review.id} className='flex flex-col p-5 rounded-lg shadow-2xl'> 
                <div className='flex text-center space-x-3'>
                    <div className='bg-gray-400 flex justify-center text-lg items-center-safe rounded-full w-10 h-10'>
                        {getInitials(review.name)}
                    </div> 
                    <div key={review.id} className='relative flex flex-col pb-5'>
                        <h1 className='font-semibold text-lg'>{review.name}</h1>
                        <p className='flex'>
                            {Array.from({length: totalStars}, (_, index) => (
                                <FaStar
                                    key={index}
                                    className={`${index < review.stars ? 'text-yellow-500': 'text-gray-400'}`}
                                />
                            ))}

                            <span className='text-black pl-2'>({review.stars})</span>
                        </p>
                    </div>
                </div>
                <div>
                    <p>"{review.description}"</p>
                </div>
            </div>
        )})}
      </div>

      <div className='flex justify-center space-x-4'>
        <Link
          href="#"
          onClick={() => toast.error('Feature coming soon!')}
          className="text-white mt-3 px-5 py-2 rounded-lg primary flex justify-center w-[50%] sm:w-[35%] items-center-safe"
        >
          View all
        </Link>

        <button className='text-white mt-3 px-5 py-2 rounded-lg primary flex justify-center w-[50%] sm:w-[35%] items-center-safe' aria-label="add review" onClick={() => toast.error('Feature coming soon!')}>
            Add a Review
        </button>
      </div>
    </section>
  );
}
