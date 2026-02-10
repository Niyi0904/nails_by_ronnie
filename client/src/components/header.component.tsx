"use client"
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added AvatarImage
import { FaMoon, FaSun, FaAngleDown } from 'react-icons/fa';
import { changeTheme } from "@/redux/features/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../redux/store";
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { logout } from '@/redux/features/authSlice';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { auth } from '@/lib/Firebase/firebaseUtils';

export default function Header() {
  const { theme } = useSelector((state: AppState) => state.theme);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: AppState) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    dispatch(changeTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout());
      toast.success('See you soon!');
      setIsMenuOpen(false);
    } catch (err) {
      toast.error('Logout failed.');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/50 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="transition-transform hover:scale-105 rounded-xl">
          <Image 
            src={theme === 'dark' ? '/assets/logo-dark.png' : '/assets/logo-white.png'}
            alt="Logo"
            width={100}
            height={80}
            className="h-16 w-20 rounded-xl object-cover"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/my-bookings">Bookings</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
          
          <div className="flex items-center pl-4 border-l border-gray-200 dark:border-gray-700 space-x-4">
            <button onClick={handleThemeToggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'light' ? <FaMoon className="text-gray-600" /> : <FaSun className="text-yellow-400" />}
            </button>

            {isAuthenticated ? (
              <UserMenu user={user} handleLogout={handleLogout} />
            ) : (
              <Link href="/login" className="bg-[#D77A8B] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#c46a7a] transition-all shadow-md">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-2xl p-2 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#121212] border-b px-6 py-6 flex flex-col space-y-4 animate-in slide-in-from-top dark:text-gray-200">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/my-bookings" onClick={() => setIsMenuOpen(false)}>Bookings</Link>
          <Link href="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          
          {/* Mobile Admin Link */}
          {isAuthenticated && user?.role === "admin" && (
            <Link 
              href="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className="font-bold text-[#D77A8B] flex items-center gap-2"
            >
              Admin Dashboard
            </Link>
          )}

          <hr className="border-gray-100 dark:border-gray-800" />

          <button onClick={handleThemeToggle} className="flex items-center space-x-2">
            {theme === 'light' ? <><FaMoon /> <span>Dark Mode</span></> : <><FaSun className="text-yellow-400" /> <span>Light Mode</span></>}
          </button>
          
          {!isAuthenticated ? (
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[#D77A8B] font-bold text-center py-3 bg-pink-50 dark:bg-pink-50/5 rounded-xl">
              Login
            </Link>
          ) : (
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profilePicture} alt={user?.full_name} />
                    <AvatarFallback className="bg-pink-50 text-[#D77A8B]">
                      {user?.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-sm">{user?.full_name}</span>
               </div>
               <button onClick={handleLogout} className="text-red-500 text-left font-medium">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#D77A8B] dark:hover:text-[#D77A8B] transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D77A8B] transition-all group-hover:w-full"></span>
    </Link>
  );
}

function UserMenu({ user, handleLogout }: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center space-x-2 group">
          <Avatar className="h-9 w-9 ring-2 ring-[#D77A8B]/20 transition-all group-hover:ring-[#D77A8B]/50">
            {/* Prioritize User Image */}
            <AvatarImage src={user?.profilePicture} alt={user?.full_name} className="object-cover" />
            <AvatarFallback className="bg-pink-50 text-[#D77A8B]">
              {user?.full_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <FaAngleDown className="text-gray-400 text-xs transition-transform group-data-[state=open]:rotate-180" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-2 mt-2">
        <div className="px-2 py-2 mb-2 border-b border-gray-50 dark:border-gray-800">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
          <p className="text-sm font-bold truncate dark:text-white">{user?.full_name || 'User'}</p>
        </div>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/my-bookings">My Bookings</Link>
        </DropdownMenuItem>
        
        {user?.role === "admin" && (
          <DropdownMenuItem asChild className="cursor-pointer font-bold text-[#D77A8B] focus:text-[#D77A8B]">
            <Link href="/admin">Admin Dashboard</Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}