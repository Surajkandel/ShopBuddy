// routes/recommendations.js
const express = require('express');
const router = express.Router();
const recommendationService = require('../services/recommendationService');
const auth = require('../middleware/auth'); // Your auth middleware

// Get personalized "Recommended for You" section for user
router.get('/for-you/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 12 } = req.query;

    const recommendations = await recommendationService.getPersonalizedRecommendations(
      userId, 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: recommendations,
      type: 'personalized',
      title: 'Recommended for You',
      count: recommendations.length,
      message: recommendations.length === 0 
        ? 'Start browsing products to get personalized recommendations!'
        : 'Based on your activity and preferences'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching personalized recommendations',
      error: error.message
    });
  }
});

// Get user preference analysis
router.get('/preferences/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's interaction history for analysis
    const userHistory = await UserInteraction.find({ userId })
      .populate('productId')
      .sort({ timestamp: -1 })
      .limit(100);

    if (userHistory.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No interaction history found',
          suggestions: 'Start browsing and liking products to build your profile!'
        }
      });
    }

    // Analyze preferences using the service method
    const preferences = recommendationService.analyzeUserPreferences(userHistory);

    // Add some insights
    const insights = {
      totalInteractions: userHistory.length,
      mostActiveDay: this.getMostActiveDay(userHistory),
      averageSessionLength: this.calculateAverageSessionLength(userHistory),
      loyaltyScore: this.calculateLoyaltyScore(userHistory),
      recommendationReadiness: userHistory.length >= 10 ? 'high' : userHistory.length >= 5 ? 'medium' : 'low'
    };

    res.json({
      success: true,
      data: {
        preferences,
        insights,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user preferences',
      error: error.message
    });
  }
});

// Get hybrid recommendations for user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, type = 'hybrid' } = req.query;

    let recommendations = [];

    switch (type) {
      case 'collaborative':
        recommendations = await recommendationService.getCollaborativeRecommendations(userId, parseInt(limit));
        break;
      case 'popular':
        recommendations = await recommendationService.getPopularProducts(parseInt(limit));
        break;
      case 'hybrid':
      default:
        recommendations = await recommendationService.getHybridRecommendations(userId, { limit: parseInt(limit) });
        break;
    }

    res.json({
      success: true,
      data: recommendations,
      type,
      count: recommendations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
});

// Get content-based recommendations for a specific product
router.get('/product/:productId/similar', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;
    const { limit = 5 } = req.query;

    const recommendations = await recommendationService.getContentBasedRecommendations(
      userId, 
      productId, 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: recommendations,
      type: 'content-based',
      count: recommendations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching similar products',
      error: error.message
    });
  }
});

// Get category-based recommendations
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const { userId } = req.query;
    const { limit = 5 } = req.query;

    const recommendations = await recommendationService.getCategoryRecommendations(
      userId, 
      category, 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: recommendations,
      type: 'category-based',
      category,
      count: recommendations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category recommendations',
      error: error.message
    });
  }
});

// Get price-based recommendations
router.get('/price/:targetPrice', async (req, res) => {
  try {
    const { targetPrice } = req.params;
    const { category, limit = 5 } = req.query;

    const recommendations = await recommendationService.getPriceBasedRecommendations(
      parseFloat(targetPrice),
      category,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: recommendations,
      type: 'price-based',
      targetPrice: parseFloat(targetPrice),
      count: recommendations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching price-based recommendations',
      error: error.message
    });
  }
});

// Track user interaction
router.post('/interaction', auth, async (req, res) => {
  try {
    const { userId, productId, interactionType, rating } = req.body;

    if (!userId || !productId || !interactionType) {
      return res.status(400).json({
        success: false,
        message: 'userId, productId, and interactionType are required'
      });
    }

    const validInteractionTypes = ['view', 'like', 'purchase', 'cart', 'wishlist'];
    if (!validInteractionTypes.includes(interactionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interaction type'
      });
    }

    const interaction = await recommendationService.trackInteraction(
      userId, 
      productId, 
      interactionType, 
      rating
    );

    if (!interaction) {
      return res.status(500).json({
        success: false,
        message: 'Failed to track interaction'
      });
    }

    res.json({
      success: true,
      message: 'Interaction tracked successfully',
      data: interaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking interaction',
      error: error.message
    });
  }
});

// Get popular products
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const recommendations = await recommendationService.getPopularProducts(parseInt(limit));

    res.json({
      success: true,
      data: recommendations,
      type: 'popular',
      count: recommendations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular products',
      error: error.message
    });
  }
});

// Bulk recommendations for homepage with personalized section
router.get('/homepage/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const [
      personalizedForYou,
      popular,
      electronics,
      similarPrice
    ] = await Promise.all([
      recommendationService.getPersonalizedRecommendations(userId, 8),
      recommendationService.getPopularProducts(6),
      recommendationService.getCategoryRecommendations(userId, 'electronics', 6),
      recommendationService.getPriceBasedRecommendations(300, null, 6) // Products around $300
    ]);

    res.json({
      success: true,
      data: {
        forYou: {
          title: 'Recommended for You',
          subtitle: 'Based on your browsing and purchase history',
          products: personalizedForYou,
          type: 'personalized'
        },
        popular: {
          title: 'Popular Right Now',
          subtitle: 'What others are buying',
          products: popular,
          type: 'popular'
        },
        electronics: {
          title: 'Electronics You Might Like',
          subtitle: 'Trending in electronics',
          products: electronics,
          type: 'category'
        },
        similarPrice: {
          title: 'Great Deals',
          subtitle: 'Quality products at great prices',
          products: similarPrice,
          type: 'price-based'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching homepage recommendations',
      error: error.message
    });
  }
});

module.exports = router;