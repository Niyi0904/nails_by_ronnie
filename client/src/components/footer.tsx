'use client';

import { FaInstagram, FaTwitter, FaFacebookF} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLocationDot } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scroll is past 300px
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return isVisible ? (
    <motion.button
      onClick={scrollToTop}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Move to top"
      initial={{ opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#E11D48] text-white shadow-lg hover:bg-[#b7153a] dark:bg-[#F9D8DA] dark:text-[#E11D48] transition-all"
    >
      <FaArrowUp />
    </motion.button>
  ) : null;
}


export default function footer() {
  return (
    <>
    <ScrollToTopButton />
    <footer className="relative top-54 w-full bg-gradient-to-r from-[#D77A8B] to-[#FCE4EC] dark:from-[#1F1F1F] dark:to-[#2E2E2E] text-white dark:text-[#F9D8DA] py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Description */}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-extrabold text-white dark:text-[#F9D8DA]">Nails by Ronnie</h2>
          <p className="text-sm text-white/90 dark:text-[#B3B3C3]">
            Embrace beauty in every detail. Nails by Ronnie offers elegant nail treatments and personalized designs to match every vibe and weather.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <div className='space-y-2'>
            <div className="flex gap-4">
              <LuPhone className="h-5 w-5"/> +2348084515135
            </div>
            <div className="flex gap-4">
              <LuPhone className="h-5 w-5"/> +2349057331175
            </div>
            <div className="flex gap-4">
              <FaLocationDot className="h-7 w-7"/>No 64, Adekunle banjo Magodo, beside domino pizza
            </div>
            <div className="flex gap-4">
              <FaLocationDot className="h-7 w-7"/>No 97, Allen avenue beside glo office ikeja Lagos
            </div>
          </div>
        </div>

        {/* Social Links with Motion */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Connect with us</h3>
          <div className="flex gap-4 text-2xl">
            {[
              { icon: <FaInstagram />, link: 'https://instagram.com', name: 'Instagram' },
              { icon: <FaTwitter />, link: 'https://twitter.com', name: 'Twitter' },
              { icon: <FaFacebookF />, link: 'https://facebook.com', name: 'Facebook' },
              { icon: <MdEmail />, link: 'mailto:hello@nailsbyronnie.com', name: 'Email' },
            ].map(({ icon, link, name }, i) => (
              <motion.a
                key={i}
                href={link}
                target="_blank"
                aria-label={`Follow us on ${name}`}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: '#E11D48' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-white dark:text-[#F9D8DA]"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-white/30 dark:border-[#444] pt-4 text-center text-sm text-white/70 dark:text-[#999]">
        &copy; {new Date().getFullYear()} Nails by Ronnie. All rights reserved.
      </div>
    </footer>
    </>
  );
}
