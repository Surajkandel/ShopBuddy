// backend/routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const recommendationService = require('../services/recommendationService');

// Get personalized recommendations for user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 8 } = req.query;
    
    const recommendations = await recommendationService.getRecommendations(
      userId, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: recommendations,
      message: 'Recommendations fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
});

// Get similar products for a specific product
router.get('/similar/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 6 } = req.query;
    
    const similarProducts = await recommendationService.getSimilarProducts(
      productId, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: similarProducts,
      message: 'Similar products fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching similar products',
      error: error.message
    });
  }
});

// Get recommendations based on search query
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 8 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const recommendations = await recommendationService.getSearchBasedRecommendations(
      query, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: recommendations,
      message: 'Search-based recommendations fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching search recommendations',
      error: error.message
    });
  }
});

// Track user interaction with products
router.post('/track', async (req, res) => {
  try {
    const { userId, productId, interactionType = 'view' } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'userId and productId are required'
      });
    }
    
    await recommendationService.trackUserInteraction(userId, productId, interactionType);
    
    res.json({
      success: true,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking interaction',
      error: error.message
    });
  }
});

module.exports = router;