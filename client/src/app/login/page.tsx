"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppState } from "@/redux/store";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { setUser, User } from "@/redux/features/authSlice";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { GetUserData } from "@/functions/getUserData/getUserData";
import { auth, db } from "@/lib/Firebase/firebaseUtils";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const { user } = useSelector((state: AppState) => state.auth);
  const { theme } = useSelector((state: AppState) => state.theme);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      const userAuth = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', userAuth.user.email as string);
      
      // Update last login
      await updateDoc(docRef, {
        lastLogin: serverTimestamp(),
      });

      const userDataFromDb = await GetUserData(docRef);
      
      const userData: User = {
        userId: userDataFromDb?.UserId!,
        full_name: userDataFromDb?.full_name!,
        email: userDataFromDb?.email!,
        phone_number: userDataFromDb?.phoneNumber!,
        address: userDataFromDb?.address!,
        role: userDataFromDb?.role!,
        profilePicture: userDataFromDb?.profilePicture,
      };
      dispatch(setUser(userData));
      toast.success('Welcome back!');
      router.push('/');
      
    } catch (err: any) {
      console.error(err);
      let errorMessage = 'Invalid email or password';
      
      if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9D8DA] dark:bg-[#0F0E13] px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative h-16 w-40 mb-6">
            <Image 
              src={theme === 'dark' ? '/assets/logo-dark.png' : '/assets/logo-white.png'}
              alt='Brand Logo'
              fill
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-delugia italic text-[#1E1B23] dark:text-white">
            Log<span className="text-[#943F54]">in</span>
          </h2>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#1A1A1A] p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-1">
                Email Address
              </label>
              <input
                type="email"
                ref={emailRef}
                className="w-full h-14 px-5 bg-gray-50 dark:bg-[#2A262F] border-2 border-transparent focus:border-[#943F54] rounded-2xl outline-none transition-all text-sm font-medium dark:text-white"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[10px] text-[#943F54] font-bold hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : "password"}
                  ref={passwordRef}
                  className="w-full h-14 px-5 bg-gray-50 dark:bg-[#2A262F] border-2 border-transparent focus:border-[#943F54] rounded-2xl outline-none transition-all text-sm font-medium dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#943F54]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-[#943F54] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#943F54] hover:bg-[#7a3345] text-white font-bold rounded-2xl shadow-lg shadow-pink-200 dark:shadow-none transition-all flex items-center justify-center disabled:opacity-70 active:scale-[0.98]"
            >
              {isSubmitting ? <BiLoaderAlt className="animate-spin text-xl"/> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-400 font-medium">
              New here?{" "}
              <Link href="/signup" className="text-[#943F54] font-black hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}