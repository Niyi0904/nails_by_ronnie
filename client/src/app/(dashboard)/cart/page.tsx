'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  totalPrice: number
};

type CartPageProps = {
  initialCart?: Product[];
};

export default function CartPage({ initialCart = [] }: CartPageProps) {
  // For demo, we'll keep cart in state. 
  // In a real app, you'd get cart from context, redux, or localStorage.
  const [cart, setCart] = useState<Product[]>(initialCart);

  // Example: Load cart from localStorage on mount (optional)
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage on change (optional)

  const removeFromCart = (id: String) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success('Item removed from cart!');
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  return (
    <section className="mt-20 mx-[5%] text-[#1c1c1c] dark:text-white max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          Your cart is empty.
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center md:justify-between bg-[#FFF0F5] dark:bg-[#2a2a2a] rounded-xl p-4 shadow"
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#E11D48] dark:text-[#F9D8DA]">
                    {item.name}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-6">
                <p className="text-xl font-bold">{item.price}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="text-red-600 hover:text-red-800 transition p-2 rounded-lg"
                >
                  <FaTrash className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}

          <div className="text-right text-3xl font-bold mt-8">
            Total: <span className="text-[#E11D48] dark:text-[#F9D8DA]">&#8358;{totalPrice.toLocaleString()}</span>
          </div>

          {/* Optional: Checkout button */}
          <div className="text-right mt-6">
            <button className="bg-[#E11D48] text-white py-3 px-6 rounded-lg text-lg hover:bg-pink-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
