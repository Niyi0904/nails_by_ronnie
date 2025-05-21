'use client';

import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
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

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-white/90 dark:text-[#B3B3C3]">
            <li><a href="/" className="hover:text-[#E11D48] transition-colors">Home</a></li>
            <li><a href="/shop" className="hover:text-[#E11D48] transition-colors">Shop</a></li>
            <li><a href="/services" className="hover:text-[#E11D48] transition-colors">Services</a></li>
            <li><a href="/contact" className="hover:text-[#E11D48] transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Social Links with Motion */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Connect with us</h3>
          <div className="flex gap-4 text-2xl">
            {[
              { icon: <FaInstagram />, link: 'https://instagram.com' },
              { icon: <FaTwitter />, link: 'https://twitter.com' },
              { icon: <FaFacebookF />, link: 'https://facebook.com' },
              { icon: <MdEmail />, link: 'mailto:hello@nailsbyronnie.com' },
            ].map(({ icon, link }, i) => (
              <motion.a
                key={i}
                href={link}
                target="_blank"
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
