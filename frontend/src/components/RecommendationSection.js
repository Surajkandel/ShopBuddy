// components/RecommendationSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const RecommendationSection = ({ 
  userId, 
  title, 
  type = 'hybrid', 
  limit = 6,
  productId = null,
  category = null,
  targetPrice = null 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [userId, type, productId, category, targetPrice]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let url = '';
      
      switch (type) {
        case 'similar':
          url = `/api/recommendations/product/${productId}/similar?userId=${userId}&limit=${limit}`;
          break;
        case 'category':
          url = `/api/recommendations/category/${category}?userId=${userId}&limit=${limit}`;
          break;
        case 'price':
          url = `/api/recommendations/price/${targetPrice}?limit=${limit}`;
          break;
        case 'popular':
          url = `/api/recommendations/popular?limit=${limit}`;
          break;
        default:
          url = `/api/recommendations/user/${userId}?type=${type}&limit=${limit}`;
      }

      const response = await axios.get(url);
      setRecommendations(response.data.data);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Recommendation fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const trackInteraction = async (productId, interactionType) => {
    try {
      await axios.post('/api/recommendations/interaction', {
        userId,
        productId,
        interactionType
      });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  if (loading) {
    return (
      <div className="recommendation-section">
        <h2 className="section-title">{title}</h2>
        <div className="loading-container">
          <div className="loading-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="loading-card">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text short"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-section">
        <h2 className="section-title">{title}</h2>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchRecommendations} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendation-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <button 
          onClick={fetchRecommendations}
          className="refresh-button"
          title="Refresh recommendations"
        >
          ↻
        </button>
      </div>
      
      <div className="products-grid">
        {recommendations.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onView={() => trackInteraction(product._id, 'view')}
            onLike={() => trackInteraction(product._id, 'like')}
            onAddToCart={() => trackInteraction(product._id, 'cart')}
          />
        ))}
      </div>
    </div>
  );
};

// components/RecommendedForYou.jsx
const RecommendedForYou = ({ userId, limit = 12, showTitle = true }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);

  useEffect(() => {
    fetchPersonalizedRecommendations();
    fetchUserPreferences();
  }, [userId]);

  const fetchPersonalizedRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/recommendations/for-you/${userId}?limit=${limit}`);
      setRecommendations(response.data.data);
    } catch (err) {
      setError('Failed to load personalized recommendations');
      console.error('Personalized recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(`/api/recommendations/preferences/${userId}`);
      setUserPreferences(response.data.data);
    } catch (err) {
      console.error('Failed to fetch user preferences:', err);
    }
  };

  const trackInteraction = async (productId, interactionType) => {
    try {
      await axios.post('/api/recommendations/interaction', {
        userId,
        productId,
        interactionType
      });
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  if (loading) {
    return (
      <div className="recommended-for-you">
        {showTitle && (
          <div className="section-header">
            <h2 className="section-title">Recommended for You</h2>
            <div className="skeleton skeleton-subtitle"></div>
          </div>
        )}
        <div className="loading-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="loading-card">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommended-for-you">
        {showTitle && <h2 className="section-title">Recommended for You</h2>}
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchPersonalizedRecommendations} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="recommended-for-you">
        {showTitle && <h2 className="section-title">Recommended for You</h2>}
        <div className="empty-recommendations">
          <div className="empty-icon">🛍️</div>
          <h3>Building Your Recommendations</h3>
          <p>Start browsing and liking products to get personalized recommendations tailored just for you!</p>
          <button 
            onClick={() => window.location.href = '/products'} 
            className="browse-button"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommended-for-you">
      {showTitle && (
        <div className="section-header-enhanced">
          <div className="title-group">
            <h2 className="section-title">
              <span className="title-icon">✨</span>
              Recommended for You
            </h2>
            <p className="section-subtitle">
              Based on your browsing history and preferences
            </p>
          </div>
          
          {userPreferences && (
            <div className="preferences-badge">
              <span className="preference-item">
                💝 {userPreferences.preferences?.preferredCategories?.[0] || 'Electronics'}
              </span>
              {userPreferences.preferences?.priceRange?.preferred && (
                <span className="preference-item">
                  💰 ~${Math.round(userPreferences.preferences.priceRange.preferred)}
                </span>
              )}
            </div>
          )}
          
          <button 
            onClick={fetchPersonalizedRecommendations}
            className="refresh-button"
            title="Refresh recommendations"
          >
            ↻
          </button>
        </div>
      )}
      
      <div className="products-grid personalized-grid">
        {recommendations.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            onView={() => trackInteraction(product._id, 'view')}
            onLike={() => trackInteraction(product._id, 'like')}
            onAddToCart={() => trackInteraction(product._id, 'cart')}
            isPersonalized={true}
            recommendationRank={index + 1}
          />
        ))}
      </div>
      
      {recommendations.length >= limit && (
        <div className="view-more-section">
          <button 
            onClick={fetchPersonalizedRecommendations}
            className="view-more-button"
          >
            See More Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced ProductCard with personalization indicators
const ProductCard = ({ 
  product, 
  onView, 
  onLike, 
  onAddToCart, 
  isPersonalized = false, 
  recommendationRank = null 
}) => {
  const [liked, setLiked] = useState(false);
  
  const handleView = () => {
    onView && onView();
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    onLike && onLike();
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart();
  };

  const discountPercentage = Math.round(((product.price - product.selling_price) / product.price) * 100);

  return (
    <div className="product-card" onClick={handleView}>
      <div className="product-image-container">
        <img 
          src={product.productImage[0]} 
          alt={product.productName}
          className="product-image"
          loading="lazy"
        />
        <button 
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ♡
        </button>
        {discountPercentage > 0 && (
          <div className="discount-badge">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.productName}</h3>
        <p className="brand-name">{product.brandName}</p>
        
        <div className="price-container">
          <span className="selling-price">${product.selling_price}</span>
          {product.price > product.selling_price && (
            <span className="original-price">${product.price}</span>
          )}
        </div>
        
        <div className="stock-info">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock ({product.stock})</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
        
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

// components/HomePage.jsx
const HomePage = ({ userId }) => {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageRecommendations();
  }, [userId]);

  const fetchHomepageRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/recommendations/homepage/${userId}`);
      setHomepageData(response.data.data);
    } catch (error) {
      console.error('Failed to load homepage recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading recommendations...</div>;
  }

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Discover Products You'll Love</h1>
        <p>Personalized recommendations just for you</p>
      </div>

      {homepageData && (
        <div className="recommendations-container">
          {Object.entries(homepageData).map(([key, section]) => (
            <RecommendationSection
              key={key}
              userId={userId}
              title={section.title}
              type="custom"
              recommendations={section.products}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// components/ProductDetailPage.jsx
const ProductDetailPage = ({ productId, userId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Track product view
    trackProductView();
  }, [productId, userId]);

  const trackProductView = async () => {
    try {
      await axios.post('/api/recommendations/interaction', {
        userId,
        productId,
        interactionType: 'view'
      });
    } catch (error) {
      console.error('Failed to track product view:', error);
    }
  };

  return (
    <div className="product-detail-page">
      {/* Product details content */}
      
      {/* Similar products section */}
      <RecommendationSection
        userId={userId}
        title="Similar Products"
        type="similar"
        productId={productId}
        limit={6}
      />
      
      {/* You might also like section */}
      <RecommendationSection
        userId={userId}
        title="You Might Also Like"
        type="hybrid"
        limit={8}
      />
    </div>
  );
};

// Enhanced ProductCard with personalization indicators
const ProductCard = ({ 
  product, 
  onView, 
  onLike, 
  onAddToCart, 
  isPersonalized = false, 
  recommendationRank = null 
}) => {
  const [liked, setLiked] = useState(false);
  
  const handleView = () => {
    onView && onView();
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    onLike && onLike();
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart && onAddToCart();
  };

  const discountPercentage = Math.round(((product.price - product.selling_price) / product.price) * 100);

  return (
    <div className={`product-card ${isPersonalized ? 'personalized-card' : ''}`} onClick={handleView}>
      <div className="product-image-container">
        <img 
          src={product.productImage[0]} 
          alt={product.productName}
          className="product-image"
          loading="lazy"
        />
        <button 
          className={`like-button ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ♡
        </button>
        {discountPercentage > 0 && (
          <div className="discount-badge">
            {discountPercentage}% OFF
          </div>
        )}
        {isPersonalized && recommendationRank <= 3 && (
          <div className="personalized-badge">
            <span className="badge-icon">✨</span>
            #{recommendationRank} Pick
          </div>
        )}
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.productName}</h3>
        <p className="brand-name">{product.brandName}</p>
        
        <div className="price-container">
          <span className="selling-price">${product.selling_price}</span>
          {product.price > product.selling_price && (
            <span className="original-price">${product.price}</span>
          )}
        </div>
        
        <div className="stock-info">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock ({product.stock})</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
        
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

// components/UserInsightsBanner.jsx
const UserInsightsBanner = ({ userId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInsights();
  }, [userId]);

  const fetchUserInsights = async () => {
    try {
      const response = await axios.get(`/api/recommendations/preferences/${userId}`);
      setInsights(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !insights || !insights.preferences) return null;

  const { preferences, insights: userInsights } = insights;

  return (
    <div className="user-insights-banner">
      <div className="insights-content">
        <h3>Your Shopping Profile</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <span className="insight-icon">📱</span>
            <div>
              <strong>Favorite Category</strong>
              <p>{preferences.preferredCategories[0] || 'Not set yet'}</p>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-icon">💰</span>
            <div>
              <strong>Price Range</strong>
              <p>${Math.round(preferences.priceRange.min)} - ${Math.round(preferences.priceRange.max)}</p>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-icon">❤️</span>
            <div>
              <strong>Preferred Brand</strong>
              <p>{preferences.preferredBrands[0] || 'Exploring options'}</p>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-icon">🎯</span>
            <div>
              <strong>Recommendation Quality</strong>
              <p className={`quality-${userInsights?.recommendationReadiness}`}>
                {userInsights?.recommendationReadiness === 'high' ? 'Excellent' : 
                 userInsights?.recommendationReadiness === 'medium' ? 'Good' : 'Building...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/HomePage.jsx - Updated with personalized section
const HomePage = ({ userId }) => {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageRecommendations();
  }, [userId]);

  const fetchHomepageRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/recommendations/homepage/${userId}`);
      setHomepageData(response.data.data);
    } catch (error) {
      console.error('Failed to load homepage recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading your personalized experience...</div>;
  }

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Discover Products You'll Love</h1>
        <p>Personalized recommendations powered by your preferences</p>
      </div>

      <UserInsightsBanner userId={userId} />

      {homepageData && (
        <div className="recommendations-container">
          {/* Personalized "For You" section - Priority placement */}
          <div className="featured-section">
            <RecommendedForYou userId={userId} limit={8} />
          </div>

          {/* Other recommendation sections */}
          {Object.entries(homepageData)
            .filter(([key]) => key !== 'forYou') // Skip forYou since we're using RecommendedForYou component
            .map(([key, section]) => (
              <RecommendationSection
                key={key}
                userId={userId}
                title={section.title}
                subtitle={section.subtitle}
                type={section.type}
                recommendations={section.products}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export { RecommendationSection, ProductCard, HomePage, ProductDetailPage, RecommendedForYou, UserInsightsBanner };