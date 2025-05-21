"use client"
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { useRef, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../../utils/api"
import { AppState } from "@/redux/store";
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { setUser } from "@/redux/features/authSlice";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    err: unknown;
    message: string;
  } | null>(null);
  const {user} = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch()
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const body = {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
    };
    
    const isChecked = checkboxRef.current?.checked;

    try {
      const response = await api.post('/auth/login', body);
      console.log(response.data.user);

      if(isChecked) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      dispatch(setUser(response.data.user));

      router.push('/');

      toast.success('Login successfull');

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

  
  return (
    <div className="relative flex justify-center items-center pt-6 mx-auto w-[98%] md:w-[50%] bg-[#F9D8DA] text-[#1E1B23] dark:bg-[#1E1B23] dark:text-[#F2F2F2]">
      <div className="container mt-[5%] mx-auto px-4">
        {/* div Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-delugia italic mb-4">Log
            <span className="text-blue-500">in</span>
          </h2>
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

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2] mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : "password"}
                  id="password"
                  ref={passwordRef}
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
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full ${
                  isSubmitting
                    ? 'bg-[#D77A8B] cursor-not-allowed'
                    : 'bg-[#E11D48] hover:bg-[#D77A8B]'
                } text-white font-medium py-3 px-6 rounded-lg transition-colors`}
              >
                {isSubmitting ? <BiLoaderAlt className="mx-auto text-2xl h-4 w-4 animate-spin"/> : 'Login'}
              </motion.button>
            </div>
            <div className="flex mt-4 space-x-2 items-center text-center align-middle">
                <input
                    type='checkbox'
                    id='remember-me'
                    className="checked:bg-pink-500"
                    ref={checkboxRef}
                />
                <label htmlFor="remember-me" className="text-sm font-medium text-[#1E1B23] dark:text-[#F2F2F2]">
                    Remember me
                </label>
            </div>
          </motion.form>

            <div className="text-center mt-5 space-y-4">
                <p>Dont have an account ?</p>
                <div className="w-full flex justify-end">
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-[50%] bg-[#E11D48] hover:bg-[#D77A8B] dark:bg-[#943F54] text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                        SignUp
                    </motion.button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
