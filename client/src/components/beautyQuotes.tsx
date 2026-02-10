'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BeautyQuote() {
  const [quote, setQuote] = useState<{text: string, author: string} | null>(null);

  useEffect(() => {
    fetch('/api/beauty-quotes').then(res => res.json()).then(data => setQuote(data));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="mt-16 text-center max-w-2xl mx-auto"
    >
      {quote ? (
        <div className="relative pt-8">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl text-[#D77A8B]/20 font-serif">“</span>
          <p className="text-xl md:text-2xl font-light text-gray-800 dark:text-gray-200 tracking-wide leading-relaxed">
            {quote.text}
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#D77A8B]">
            — {quote.author}
          </p>
        </div>
      ) : (
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse mx-auto rounded-full" />
      )}
    </motion.div>
  );
}