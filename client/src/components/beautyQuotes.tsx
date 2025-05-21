'use client';

import { useEffect, useState } from 'react';

type Quote = {
  text: string;
  author: string;
};

export default function BeautyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      const res = await fetch('/api/beauty-quotes');
      const data = await res.json();
      setQuote(data);
    }

    fetchQuote();
  }, []);

  return (
    <div className="mt-12 text-center bg-[#FCE4EC] dark:bg-[#1F1F1F] p-6 rounded-xl shadow-xl">
      {quote ? (
        <>
          <p className="text-lg md:text-2xl italic text-[#E11D48] dark:text-[#F9D8DA]">“{quote.text}”</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">– {quote.author}</p>
        </>
      ) : (
        <p className="text-sm text-gray-500">Loading quote...</p>
      )}
    </div>
  );
}
