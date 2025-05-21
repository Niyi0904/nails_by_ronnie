"use client"
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { FaMoon, FaSun, FaAngleDown, FaAngleRight, FaPhone} from 'react-icons/fa';
import { IoSettingsOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { changeTheme } from "@/redux/features/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/store";
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { logout } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';



export default function Header() {
    const {theme} = useSelector((state: AppState) => state.theme);
    const dispatch = useDispatch();
    const router = useRouter();
    const {isAuthenticated, user} = useSelector((state: AppState) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    console.log(user)
    const handleModal = () => {
      setIsMenuOpen(!isMenuOpen); 
    }

    const handleThemeToggle = () => {
        if (theme === 'light') {
            dispatch(changeTheme('dark'));
        } else if (theme === 'dark') {
            dispatch(changeTheme('light'));
        }
    }

  return (
    <nav className="fixed top-0 w-full z-40 p-4 flex items-center justify-between bg-white dark:bg-[#121212] shadow-lg">
    <h1 className="font-bold text-xl text-[#D77A8B]">Nailed_by_Ronnie</h1>
    <div className="hidden lg:flex space-x-6 text-sm">
      {isAuthenticated ? 
        (
          <div className='items-end'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 hover:text-[#D77A8B]">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarFallback className="bg-pink-100 text-[#D77A8B]">
                      NO
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block font-medium">
                    {user?.full_name}
                  </span>
                  <FaAngleDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className='space-y-3 border-b-2 border-gray-700'>
                  <DropdownMenuItem onClick={() => router.push('/')} className='flex justify-between'>Home  <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Profile    <FaAngleDown className="h-4 w-4" />
                  </DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Bookings <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Orders <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Favourites <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Saved Items <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Chat <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/shop')} className='flex justify-between'>Shop <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>
                </div>

                <div className='flex flex-col mt-10'>
                <DropdownMenuItem className='flex justify-between'><span className='flex gap-2 items-center'><IoSettingsOutline /> Settings 
                </span> <FaAngleDown className="h-4 w-4" />
                </DropdownMenuItem>

                <DropdownMenuItem className='flex justify-between'><span className='flex gap-2'><LuPhone /> Contact Us </span> <FaAngleDown className="h-4 w-4" />
                </DropdownMenuItem>
                
                <DropdownMenuItem className='flex justify-between'>About Us <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                </div>

                <DropdownMenuItem className='flex justify-between text-red-500'>
                <button onClick={() => dispatch(logout())}>
                  Logout 
                </button> <FaAngleRight className="h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className='space-x-6 flex items-center text-center align-middle'>
              <a href="/" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">Book</a>
              <button onClick={() => router.push('/shop')} className="hover:underline cursor-pointer">Shop</button>
              <a href="#" className="hover:underline">Chat</a>
              <span  className="hover:bg-roseAccent hover:underline px-3 py-1 rounded transition">
                    {isAuthenticated ? <button onClick={() => dispatch(logout())}>Logout</button> : <button onClick={() => router.push('/login')} className="hover:underline cursor-pointer">Login</button>
}
              </span>

              <span className="text-3xl font-bold text-blue-950 dark:text-white">
                  <button onClick={handleThemeToggle}>
                      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
                  </button>
              </span>
          </div>
        )
      }
      
    </div>
    <div className="lg:hidden flex relative text-4xl font-bold text-blue-950 dark:text-white items-center text-center align-middle mt-1 space-x-4">
        <button onClick={handleThemeToggle}>
            {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>

          <div className='flex flex-col space-y-4'>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button onClick={handleModal} className="text-3xl">
                  {isMenuOpen ? <HiX /> : <HiMenu />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className='space-y-3 border-b-2 border-gray-700'>
                  <DropdownMenuItem onClick={() => router.push('/')} className='flex justify-between'>Home  <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Profile <FaAngleDown className="h-4 w-4" />
                  </DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Bookings <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Orders <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Favourites <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Saved Items <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between'>Chat <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/shop')} className='flex justify-between'>Shop <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>
                </div>

                <div className='flex flex-col mt-10'>
                <DropdownMenuItem className='flex justify-between'><span className='flex gap-2 items-center'><IoSettingsOutline /> Settings 
                </span> <FaAngleDown className="h-4 w-4" />
                </DropdownMenuItem>

                <DropdownMenuItem className='flex justify-between'><span className='flex gap-2'><LuPhone /> Contact Us </span> <FaAngleDown className="h-4 w-4" />
                </DropdownMenuItem>
                
                <DropdownMenuItem className='flex justify-between'>About Us <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                </div>

                <DropdownMenuItem className='flex justify-between text-red-500'>
                {isAuthenticated ? <button onClick={() => dispatch(logout())}>Logout</button> : <button onClick={() => router.push('/login')}>Login</button>} <FaAngleRight className="h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
    </div>
  </nav>
  );
}
