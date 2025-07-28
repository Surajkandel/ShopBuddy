import React, { useState, useEffect, useCallback } from 'react';

const RecommendationSection = ({
  userId,
  title = "Recommended for You",
  type = "user", // 'user', 'similar', 'search'
  productId = null,
  searchQuery = null,
  limit = 8,
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let url = '';

      switch (type) {
        case 'user':
          url = `/api/recommendations/user/${userId}?limit=${limit}`;
          break;
        case 'similar':
          url = `/api/recommendations/similar/${productId}?limit=${limit}`;
          break;
        case 'search':
          url = `/api/recommendations/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}`;
          break;
        default:
          url = `/api/recommendations/user/${userId}?limit=${limit}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load recommendations');
      }

      setRecommendations(data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  }, [userId, productId, searchQuery, type, limit]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const trackInteraction = async (productId, interactionType = 'view') => {
    try {
      await fetch('/api/recommendations/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, interactionType }),
      });
    } catch (err) {
      console.error('Interaction tracking failed:', err);
    }
  };

  const handleProductClick = (product) => {
    trackInteraction(product._id, 'view');
    window.location.href = `/product/${product._id}`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
        {title}
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="border rounded-md p-4 animate-pulse bg-white"
            >
              <div className="h-40 bg-gray-200 mb-4 rounded"></div>
              <div className="h-4 bg-gray-300 mb-2 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded text-sm">
          {error}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded text-sm">
          No kkkrecommendations available.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product)}
              className="cursor-pointer border rounded-md hover:shadow-lg transition p-3 bg-white"
            >
              <div className="relative">
                <img
                  src={product.productImage?.[0] || '/placeholder-image.jpg'}
                  alt={product.productName}
                  className="w-full h-40 object-contain mb-2"
                />
                {product.price > product.selling_price && (
                  <div className="absolute top-2 left-2 text-xs px-2 py-1 bg-red-500 text-white rounded">
                    {Math.round(
                      ((product.price - product.selling_price) / product.price) *
                        100
                    )}
                    % OFF
                  </div>
                )}
              </div>

              <h3 className="text-sm font-medium text-gray-800 truncate">
                {product.productName}
              </h3>
              <p className="text-xs text-gray-500">{product.brandName}</p>

              <div className="mt-1 flex items-center space-x-2">
                <span className="text-green-600 font-semibold text-sm">
                  {formatPrice(product.selling_price)}
                </span>
                {product.price > product.selling_price && (
                  <span className="text-gray-400 text-xs line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>{product.category}</span>
                <span>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;
