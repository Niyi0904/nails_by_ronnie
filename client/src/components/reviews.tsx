'use client';

import { FaStar } from 'react-icons/fa';
import Link from "next/link";
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { addNewReview, FetchAllReviews } from '@/functions/reviewFunc/function';
import Loading from '@/app/(dashboard)/my-bookings/loading';


type Review = {
  id: string;
  name: string;
  description: string;
  stars: number;
};

// const reviews: Review[] = [
//   {
//     id: 1,
//     name: 'Niyi Owoyemi',
//     description: 'They have the best services and their customer approach is the best, i rocommend this as the best nailtech in Lagos',
//     stars: 5,
//   },
// ];

const getInitials = (fullName: string) => {
  const names = fullName.trim().split(" ");
  const firstInitial = names[0]?.[0] ?? "";
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
  return (firstInitial + lastInitial).toUpperCase();
};

export default function ReviewSection() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0); // 0 to 5
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
      toast.error("Failed to fetch gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    if (!clientName || !reviewText || !rating) {
      toast.error('All fields are required');
      return;
    }
    const reviewData = {
      name: clientName,
      description: reviewText,
      stars: rating,
    };
    try {
      console.log("Review submitted:", reviewData);
      // Call your API to save `reviewData` here
      const response = await addNewReview(reviewData);
      console.log(response);
      // Optional: reset form
      setClientName("");
      setReviewText("");
      setRating(0);
      fetchReviews();
      setOpen(false);
      toast.success('Gallery added successfuly');
    } catch (error) {
      toast.error('Something went wrong please try again');
      console.error(error);
      throw new Error('Something went wrong please try again')
    } finally {
      setLoading(false);
    }

};


  return (
    <section className="mt-25 text-[#1c1c1c] dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-8">
        Reviews
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {reviews.map(review => {
        const totalStars = 5;
        return (
          <div key={review.id} className="flex flex-col p-5 rounded-lg shadow-lg bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-400 flex justify-center items-center w-10 h-10 rounded-full font-bold text-white">
                {getInitials(review.name)}
              </div>
              <div className="flex flex-col">
                <h1 className="font-semibold text-lg text-gray-900 dark:text-white">{review.name}</h1>
                <div className="flex space-x-1" aria-label={`Rating: ${review.stars} out of ${totalStars} stars`}>
                  {Array.from({ length: totalStars }, (_, index) => (
                    <FaStar
                      key={index}
                      className={index < review.stars ? 'text-yellow-500' : 'text-gray-400'}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{review.description}</p>
          </div>
        )})}
      </div>

      <div className='flex justify-center space-x-4'>
        {/* <Link
          href="#"
          onClick={() => toast.error('Feature coming soon!')}
          className="text-white mt-3 px-5 py-2 rounded-lg primary flex justify-center w-[50%] sm:w-[35%] items-center-safe"
        >
          View all
        </Link> */}

        <button className='text-white mt-3 px-5 py-2 rounded-lg primary flex justify-center w-[50%] sm:w-[35%] items-center-safe' aria-label="add review" onClick={() => setOpen(true)}>
            Add a Review
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="space-y-4 max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>

          {/* Client Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Client Name</label>
            <Input
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          {/* Review */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Review</label>
            <Textarea
              placeholder="Write the review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>

          {/* Star Rating */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Stars</label>
            <div className="flex items-center gap-1 text-2xl cursor-pointer">
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  className={`transition-colors ${
                    star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className='cursor-pointer' onClick={() => setOpen(false)}>Cancel</Button>

            <Button type="submit" onClick={handleSubmit} className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#D77A8B] flex justify-center disabled:cursor-not-allowed cursor-pointer items-center-safe hover:text-white bg-[#943F54] dark:bg-[#943F54] dark:hover:bg-[#D77A8B]">{loading ? <Loading/> : 'Submit Review'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
