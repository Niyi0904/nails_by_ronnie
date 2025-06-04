'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { AppState } from '@/redux/store';
import { useSelector, UseSelector } from 'react-redux';
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

export default function CartPage() {
  // For demo, we'll keep cart in state. 
  // In a real app, you'd get cart from context, redux, or localStorage.

  const cart = useSelector((state: AppState) => state.auth.user?.cart);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(cart);
  })
  // Example: Load cart from localStorage on mount (optional)
  // useEffect(() => {
  //   const savedCart = sessionStorage.getItem('cart');
  //   if (savedCart) {
  //     setCart(JSON.parse(savedCart));
  //   }
  // }, []);

  // Save cart to localStorage on change (optional)

  // const removeFromCart = (id: String) => {
  //   setCart((prev) => prev.filter((item) => item.id !== id));
  //   toast.success('Item removed from cart!');
  // };

  // const totalPrice = cart.reduce((sum, item) => {
  //   return sum + item.price;
  // }, 0);

  return (
    <section className="mt-20 mx-[5%] text-[#1c1c1c] dark:text-white max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Shopping Cart</h1>

      
    </section>
  );
}
