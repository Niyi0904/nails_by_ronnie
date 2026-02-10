'use client';

import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { addNewReview, FetchAllReviews } from '@/functions/reviewFunc/function';
import Loading from '@/app/(dashboard)/my-bookings/loading';

type Review = {
  id: string;
  name: string;
  description: string;
  stars: number;
};

const getInitials = (fullName: string) => {
  const names = fullName.trim().split(" ");
  const firstInitial = names[0]?.[0] ?? "";
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
  return (firstInitial + lastInitial).toUpperCase();
};

export default function ReviewSection() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [clientName, setClientName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await FetchAllReviews();
      setReviews(res || []);
    } catch (err) {
      toast.error("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async () => {
    if (!clientName || !reviewText || !rating) {
      toast.error('Please fill in all fields and provide a rating');
      return;
    }
    setLoading(true);
    try {
      await addNewReview({ name: clientName, description: reviewText, stars: rating });
      setClientName(""); setReviewText(""); setRating(0);
      fetchReviews();
      setOpen(false);
      toast.success('Thank you for your review!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-[#D77A8B] font-bold tracking-widest uppercase text-xs mb-2">Testimonials</h2>
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white">Client Stories</h1>
      </div>

      {/* Reviews Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {reviews.map((review, index) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="break-inside-avoid bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#943F54] to-[#D77A8B] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {getInitials(review.name)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white leading-none">{review.name}</h3>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-xs ${i < review.stars ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <FaQuoteLeft className="absolute -top-2 -left-2 text-gray-100 dark:text-gray-800 text-3xl -z-0" />
              <p className="relative z-10 text-gray-600 dark:text-gray-300 italic leading-relaxed">
                {review.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button 
          onClick={() => setOpen(true)}
          className="bg-[#943F54] hover:bg-[#D77A8B] text-white px-10 py-6 rounded-full text-lg shadow-lg transition-all duration-300 active:scale-95"
        >
          Share Your Experience
        </Button>
      </div>

      {/* Add Review Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Write a Review</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm font-medium text-gray-500">Your Rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-4xl transition-all ${star <= (hoverRating || rating) ? 'text-yellow-400 scale-110' : 'text-gray-200'}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Your Name</label>
              <Input 
                placeholder="How should we call you?" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="rounded-xl border-gray-200 focus:ring-[#D77A8B]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Your Story</label>
              <Textarea 
                placeholder="Tell us about your service..." 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="rounded-xl min-h-[100px] border-gray-200 focus:ring-[#D77A8B]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              disabled={loading}
              onClick={handleSubmit} 
              className="w-full py-6 bg-[#943F54] hover:bg-[#D77A8B] text-white rounded-xl font-bold"
            >
              {loading ? <Loading /> : 'Post Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}