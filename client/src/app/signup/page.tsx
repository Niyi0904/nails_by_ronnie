"use client"
import { motion } from "framer-motion";
import {FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";

import { useRef, useState } from "react";
import { useEffect } from "react";
import api from "../../utils/api"
import { AppState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { setUser } from "@/redux/features/authSlice";

export default function Signup() {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    err: unknown;
    message: string;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState({
    hasMinLength: false,
    hasSpecialChar: false,
    hasThreeNumbers: false,
  });

  const {user} = useSelector((state: AppState) => state.auth);
      const {theme} = useSelector((state: AppState) => state.theme);

  const router = useRouter();
  const dispatch = useAppDispatch()
  

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        router.push('/')
      }, 3000);
    }

    console.log(user);
  }, [user]);
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;
    
    if (password !== confirmPassword) {
      setSubmitStatus({
        success: false,
        err: null,
        message: 'Passwords dont match',
      });
      
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const body = {
      full_name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      address: addressRef.current?.value,
      phone_number: phoneRef.current?.value
    };



    try {
      const response = await api.post('/auth/signup', body);
      dispatch(setUser(response.data.user));
      setSubmitStatus({
        success: true,
        err: null,
        message: 'Check Email for verification Link',
      });
      formRef.current?.reset();
    } catch (err: any) {
      let errorMessage = 'Internal server error, please try again';

      if (err.response) {
        // Backend returned a non-2xx status code
        errorMessage = err.response.data?.error || err.response.data?.message || 'Something went wrong';
        console.error('Response Error:', err.response);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your internet or try again later.';
        console.error('Request Error:', err.request);
      } else {
        // Other errors (e.g., bad config)
        errorMessage = err.message || 'Unexpected error occurred.';
        console.error('General Error:', err.message);
      }
      setSubmitStatus({
        success: false,
        err: err,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = (password: string | undefined | null) => {
    const safepass = password ||'';
    return {
    hasMinLength: safepass.length >= 8,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(safepass),
    hasThreeNumbers: (safepass.match(/\d/g) || []).length >= 3,
  }
}
  

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const result = validatePassword(value);
    setValidation(result);
};

  return (
    <div className="relative flex justify-center pb-20 pt-6 mx-auto w-[98%] md:w-[50%] bg-[#F9D8DA] text-[#1E1B23] dark:bg-[#1E1B23] dark:text-[#F2F2F2]">
      <div className="container mx-auto px-4">
        {/* div Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center items-center  justify-center mb-8 flex flex-col"
        >
          <div className="mb-8 rounded-lg">
            {
            theme === 'dark' ? <Image 
              src='/assets/logo-dark.png'
              alt='logo-dark-mode'
              width={150}
              height={150}
              className="h-14 w-36 rounded-xl  object-cover"
            />

            :
            <Image 
              src='/assets/logo-white.png'
              alt='logo-light-mode'
              width={150}
              height={150}
              className="h-14 w-36 rounded-xl object-cover"
            />
            }
          </div>
          <h2 className="text-3xl md:text-4xl font-delugia italic mb-4">Sign
            <span className="text-[#E11D48]">Up </span>
          </h2>
          <p className="text-xl md:text-2xl font-delugia italic mb-2">Join the Ronnie B Empire Community</p>
          <p className="text-gray-600 dark:text-gray-400 mx-auto">
            create an account to book an appointments, explore exclusive nails styles, and stay updated with special offers.
          </p>
        </motion.div>

        <div>
          {/* Contact Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[#FCE4EC] dark:bg-[#2A262F] text-[#1E1B23] p-8 rounded-xl shadow-lg"
          >
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  ref={nameRef}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  ref={emailRef}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  ref={phoneRef}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="08123456789"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  ref={addressRef}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your address"
                  required
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2] mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : "password"}
                  id="password"
                  ref={passwordRef}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Password"
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-[65%] transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                </button>

                <div className="text-xs text-gray-500 flex gap-2 mt-1">
                  <span className={validation.hasMinLength ? "text-green-500" : ""}>✔ Min 8 characters</span>
                  <span className={validation.hasSpecialChar ? "text-green-500" : ""}>✔ 1 special character</span>
                  <span className={validation.hasThreeNumbers ? "text-green-500" : ""}>✔ 3 numbers</span>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2] mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : "password"}
                  id="confirm-password"
                  ref={confirmPasswordRef}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Confirm your Password"
                  required
                />

                <button
                  type="button"
                  className="absolute right-3 top-[65%] transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEye className="h-5 w-5" /> : <FaRegEyeSlash className="h-5 w-5" />}
                </button>
              </div>

              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 rounded-md ${
                    submitStatus.success
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {submitStatus.message}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || !validation.hasMinLength || !validation.hasSpecialChar || !validation.hasThreeNumbers}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full ${
                  isSubmitting
                    ? 'bg-[#D77A8B] cursor-not-allowed'
                    : 'primary'
                } text-white font-medium py-3 px-6 rounded-lg transition-colors`}
              >
                {isSubmitting ? <BiLoaderAlt  className="mx-auto text-2xl h-4 w-4 animate-spin"/> : 'Sign Up'}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
