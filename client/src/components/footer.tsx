'use client';

import { FaInstagram, FaTwitter, FaFacebookF, FaArrowUp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLocationDot } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-[60] p-4 rounded-full bg-[#943F54] text-white shadow-2xl transition-colors hover:bg-[#D77A8B]"
        >
          <FaArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <ScrollToTopButton />
      <footer className="w-full bg-[#1A1A1A] text-gray-300 py-16 px-6 md:px-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Nailed by <span className="text-[#D77A8B]">Ronnie</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Elevating the art of nail care in Lagos. We combine precision artistry with a luxury experience to ensure your hands tell your story beautifully.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaInstagram />, link: 'https://instagram.com/nailed_by_ronnie', name: 'Instagram' },
                { icon: <FaTwitter />, link: 'https://x.com/ronkeowoyemi', name: 'Twitter' },
                { icon: <MdEmail />, link: 'mailto:Ronkeowoyemi@gmail.com', name: 'Email' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: '#D77A8B' }}
                  className="p-2 bg-gray-800 rounded-lg text-white transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Locations Column */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#D77A8B]">Our Studios</h3>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <FaLocationDot className="text-[#D77A8B] shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-semibold text-white">Magodo Phase II</p>
                  <p className="text-sm text-gray-400">No 64, Adekunle Banjo, beside Domino's Pizza, Lagos.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FaLocationDot className="text-[#D77A8B] shrink-0 mt-1" size={18} />
                <div>
                  <p className="font-semibold text-white">Ikeja Studio</p>
                  <p className="text-sm text-gray-400">No 29B, Afolabi Aina, Nelson's & Grills Plaza, Lagos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Column */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#D77A8B]">Booking</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <LuPhone className="text-gray-500 group-hover:text-[#D77A8B] transition-colors" />
                <a href="tel:+2348084515135" className="text-sm hover:text-white">+234 808 451 5135</a>
              </div>
              <div className="flex items-center gap-3 group">
                <LuPhone className="text-gray-500 group-hover:text-[#D77A8B] transition-colors" />
                <a href="tel:+2349057331175" className="text-sm hover:text-white">+234 905 733 1175</a>
              </div>
              <div className="pt-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">Opening Hours</p>
                <p className="text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
          <p>&copy; {currentYear} Nailed by Ronnie.</p>
          <div className="flex gap-6">
            <button className="hover:text-[#D77A8B]">Privacy Policy</button>
            <button className="hover:text-[#D77A8B]">Terms of Service</button>
          </div>
        </div>
      </footer>
    </>
  );
}