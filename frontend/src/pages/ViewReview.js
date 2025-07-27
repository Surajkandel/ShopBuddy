import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoStar, IoStarOutline } from 'react-icons/io5';
import Context from '../context';
import summaryApi from '../common';

const ViewReview = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const { fetchUserDetails, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
    fetchUserDetails();
  }, [productId]);

 const fetchReviews = async () => {
  try {
    const response = await fetch(`${summaryApi.getProductReviews.url}/${productId}`, {
      credentials: 'include', // Send cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      setReviews(data.data);
    } else {
      setError(data.message || 'Failed to fetch reviews');
    }
  } catch (err) {
    setError(err.message || 'Failed to fetch reviews');
    console.error('Fetch error:', err);
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const response = await fetch(summaryApi.createReview.url, {
        method: summaryApi.createReview.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // For cookie-based auth
        body: JSON.stringify({ 
          productId, 
          rating, 
          comment 
        })
      });

      const data = await response.json();

      if (data.success) {
        setRating(0);
        setComment('');
        await fetchReviews(); // Refresh reviews after submission
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    }
  };

  if (loading) return <div className="text-center py-10">Loading reviews...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Product Reviews</h1>
      
      {/* Write Review Section - Only show if user is logged in */}
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
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
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. {user ? 'Be the first to review!' : 'Login to leave a review.'}</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      {star <= review.rating ? <IoStar /> : <IoStarOutline />}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold">
                {review.userId?.name || 'Anonymous'}
                {review.userId?._id === user?._id && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Your review
                  </span>
                )}
              </h3>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewReview;