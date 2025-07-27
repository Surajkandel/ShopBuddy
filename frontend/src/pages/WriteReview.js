import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Context from '../context';
import summaryApi from '../common';
import { toast } from 'react-toastify';

const WriteReview = () => {
  const { productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const { fetchUserDetails, user } = useContext(Context);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const dataResponse = await fetch(summaryApi.createReview.url, {
        method: summaryApi.createReview.method,
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',  
        body: JSON.stringify({ rating, comment, productId })
      });

      const data = await dataResponse.json();

      if (data.success) {
        navigate(`/review/${productId}`);
        toast.message("Review updated")
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Write a Review</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl focus:outline-none"
                >
                  {star <= (hoverRating || rating) ? (
                    <IoStar className="text-yellow-400" />
                  ) : (
                    <IoStarOutline className="text-yellow-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReview;
