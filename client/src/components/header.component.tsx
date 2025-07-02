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
import Image from 'next/image';
import api from '@/utils/api';
import toast from 'react-hot-toast';



export default function Header() {
    const {theme} = useSelector((state: AppState) => state.theme);
    const dispatch = useDispatch();
    const router = useRouter();
    const {isAuthenticated, user} = useSelector((state: AppState) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    const firstInitial = names[0]?.[0] ?? "";
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

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

    const handleLogout = async () => {
      try {
        await api.post('/auth/logout'); // this clears the cookie on the server
        dispatch(logout());             // this clears Redux state
        toast.success('Logged out successfully');
      } catch (err) {
        toast.error('Logout failed. Please try again.');
      }
    };


  return (
    <nav className="fixed top-0 w-full z-40 py-1 flex items-center justify-between bg-white dark:bg-[#121212] shadow-lg">
    <div>{
      theme === 'dark' ? <Image 
        src='/assets/logo-dark.png'
        alt='logo-dark-mode'
        width={150}
        height={150}
        className="h-14 w-36 object-cover"
      />

      :
      <Image 
        src='/assets/logo-white.png'
        alt='logo-light-mode'
        width={150}
        height={150}
        className="h-14 w-36 object-cover"
      />
      }
    </div>
    <div className="hidden lg:flex space-x-6 text-sm">
      {isAuthenticated ? 
        (
          <div className='items-end flex'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 hover:text-[#D77A8B]" aria-label="user menu">
                  <span className="sr-only">Open user menu</span>
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarFallback className="bg-pink-100 text-[#D77A8B]">
                      {user?.full_name ? getInitials(user.full_name) : "NA"}
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
                  <DropdownMenuItem asChild>
                    <Link href='/' className='flex justify-between'>
                        Home  <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between cursor-not-allowed text-gray-400'>Profile    <FaAngleDown className="h-4 w-4" />
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>  
                    <Link href="/my-bookings" className="flex justify-between">
                          Bookings <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between cursor-not-allowed text-gray-400'>Orders <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between cursor-not-allowed text-gray-400'>Favourites <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href='/cart' className='flex justify-between'>
                      Carts <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className='flex justify-between cursor-not-allowed text-gray-400'>Saved Items <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  {/* <DropdownMenuItem className='flex justify-between cursor-not-allowed text-gray-400'>Chat <FaAngleRight className="h-4 w-4" /></DropdownMenuItem> */}

                  <DropdownMenuItem asChild>
                    <Link href='/shop' className='flex justify-between'>
                    Shop <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>
                </div>

                {/* <div className='flex flex-col mt-10'>
                <DropdownMenuItem className='flex justify-between cursor-not-allowed text-gray-400'><span className='flex gap-2 items-center'><IoSettingsOutline /> Settings 
                </span> <FaAngleDown className="h-4 w-4" />
                </DropdownMenuItem>

                <DropdownMenuItem className='flex justify-between'>
                  <Link href='/contact' className='flex justify-between'>
                    <span className='flex gap-2'><LuPhone /> Contact Us </span> <FaAngleDown className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem className='flex justify-between'>About Us <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                </div> */}

                <DropdownMenuItem className='flex justify-between text-red-500'>
                <button onClick={handleLogout} aria-label="Logout">
                  Logout 
                </button> <FaAngleRight className="h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-3xl font-bold pl-3 text-blue-950 space-x-4 dark:text-white">
              <button onClick={handleThemeToggle} aria-label="Change theme">
                  {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>
              {user?.role === "admin" && (
              <Link href="/admin" className="text-sm pr-4 text-blue-950 dark:text-white hover:underline">
                Admin
              </Link>
              )}
            </span>
          </div>
        ) : (
          <div className='space-x-6 flex items-center text-center align-middle'>
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/my-bookings" className="hover:underline">Bookings</Link>
              <Link href='/shop' className="hover:underline cursor-pointer">Shop</Link>
              <Link href='/gallery' className="hover:underline cursor-pointer">Gallery</Link>
              <span>
                <Link href='/login' className="hover:underline cursor-pointer">
                  Login
                </Link>
              </span>

              <span className="text-3xl font-bold text-blue-950 dark:text-white">
                  <button onClick={handleThemeToggle} aria-label="Change theme">
                      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
                  </button>
              </span>
          </div>
        )
      }
      
    </div>
    <div className="lg:hidden flex relative text-4xl font-bold text-blue-950 dark:text-white items-center text-center align-middle mt-1 space-x-3">
        <button onClick={handleThemeToggle} aria-label="Change theme">
            {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
        </button>

        {user?.role === "admin" && (
          <Link href="/admin" className="text-lg pl-3 text-blue-950 dark:text-white hover:underline">
            Admin
          </Link>
        )}

          <div className='flex flex-col space-y-4'>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button onClick={handleModal} aria-label="User menu" className="text-3xl pr-2">
                  {isMenuOpen ? <HiX /> : <HiMenu />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className='space-y-3 pb-8 border-b border-gray-700'>
                  <DropdownMenuItem asChild>
                    <Link href='/' className='flex justify-between'>
                        Home  <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className={`justify-between hidden ${isAuthenticated ? 'flex text-gray-400' : ''}`}>Profile <FaAngleDown className="h-4 w-4" />
                  </DropdownMenuItem> 

                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings" className="relative w-full justify-between flex">
                          Bookings <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className={`justify-between hidden ${isAuthenticated ? 'flex text-gray-400' : ''}`}>Orders <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem className={`justify-between hidden ${isAuthenticated ? 'flex text-gray-400' : ''}`}>Favourites <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href='/cart' className='relative w-full flex justify-between'>
                      Carts <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className={`justify-between hidden ${isAuthenticated ? 'flex text-gray-400' : ''}`}>Saved Items <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                  {/* <DropdownMenuItem className='flex justify-between text-gray-400'>Chat <FaAngleRight className="h-4 w-4" /></DropdownMenuItem> */}

                  <DropdownMenuItem asChild>
                    <Link href='/shop' className='flex justify-between'>
                        Shop  <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href='/gallery' className='flex justify-between'>
                        Gallery  <FaAngleRight className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>
                </div>

                {/* <div className='flex flex-col mt-7'>
                <DropdownMenuItem className='flex justify-between text-gray-400'><span className='flex gap-2 items-center'><IoSettingsOutline /> Settings 
                </span> <FaAngleDown className="h-4 w-4" />
                </DropdownMenuItem>

                <DropdownMenuItem className='flex justify-between text-gray-400'><span className='flex gap-2'><LuPhone /> Contact Us </span> <FaAngleDown className="h-4 w-4" />
                </DropdownMenuItem>
                
                <DropdownMenuItem className='flex justify-between text-gray-400'>About Us <FaAngleRight className="h-4 w-4" /></DropdownMenuItem>

                </div> */}

                <DropdownMenuItem className='flex justify-between text-red-500'>
                {isAuthenticated ? <button onClick={handleLogout}>Logout</button> : <Link href='/login'>Login</Link>} <FaAngleRight className="h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
    </div>
  </nav>
  );
}
