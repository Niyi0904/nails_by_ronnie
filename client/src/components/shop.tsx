'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';


type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Nail Polish',
    description: 'High-quality long-lasting polish.',
    price: '$8',
    image: '/recommend/nail-rain.jpg',
  },
  {
    id: 2,
    name: 'Cuticle Nippers',
    description: 'Precision trimming for clean cuticles.',
    price: '$12',
    image: '/recommend/nail-rain.jpg',
  },
  {
    id: 3,
    name: 'Nail File',
    description: 'Smooth and shape your nails easily.',
    price: '$5',
    image: '/recommend/nail-rain.jpg',
  },
];

export default function ShopSection() {
    const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [savedItems, setSavedItems] = useState<Product[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
    
    if (favorites.includes(id)) {
        toast.success(`removed from favorites!`);
    } else {
        toast.success(`added to favorites!`);
    }
  };

  const bookmark = (product: Product) => {
    setSavedItems((prev) => 
        prev.includes(product) ? prev.filter((prod) => prod !== product) : [...prev, product]
    );

    if (savedItems.includes(product)) {
        toast.success(`${product.name} has been removed from saved items`);
    } else {
        toast.success(`${product.name} has been saved`);
    }
  }

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    toast.success(`${product.name} added to cart!`);
};

  return (
    <section className="mt-25 text-[#1c1c1c] dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Shop Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {sampleProducts.map((product) => {
            const isFavorite = favorites.includes(product.id);
            const isBookmarked = savedItems.includes(product);
            return (
          <div
            key={product.id}
            className="bg-[#FFF0F5] dark:bg-[#2a2a2a] rounded-2xl p-4 shadow-md transition hover:shadow-lg"
          >
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-[#E11D48] dark:text-[#F9D8DA] mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
            <p className="font-bold text-lg mb-3">{product.price}</p>
            <div className='flex justify-between gap-10'>
                <button
                onClick={() => addToCart(product)}
                className="bg-[#E11D48] text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition"
                >
                Add to Cart
                </button>

                <div>
                    <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label="Toggle favorite"
                    >
                    {isFavorite ? (
                        <FaHeart className="text-pink-600 w-5 h-5" />
                    ) : (
                        <FaRegHeart className="text-pink-600 w-5 h-5" />
                    )}
                    </button>

                    <button
                    onClick={() => bookmark(product)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label="Save product"
                    >
                    {isBookmarked ? (
                        <FaBookmark className="text-pink-600 w-5 h-5" />
                    ) : (
                        <FaRegBookmark className="text-pink-600 w-5 h-5" />
                    )}
                    </button>
                </div>
            </div>
          </div>
        )})}
      </div>
    </section>
  );
}
