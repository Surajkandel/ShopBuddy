// backend/services/recommendationService.js
const Product = require('../models/Product'); // Adjust path based on your structure

class RecommendationService {
  
  // Get recommendations based on user search/browsing history
  async getRecommendations(userId, limit = 8) {
    try {
      // Get user's search history and viewed products
      const userHistory = await this.getUserInteractionHistory(userId);
      
      if (!userHistory.length) {
        // If no history, return popular/trending products
        return await this.getPopularProducts(limit);
      }

      // Extract categories and brands from user history
      const userPreferences = this.analyzeUserPreferences(userHistory);
      
      // Get recommended products based on preferences
      const recommendations = await this.getProductsByPreferences(
        userPreferences, 
        userId, 
        limit
      );

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return await this.getPopularProducts(limit);
    }
  }

  // Get recommendations based on a specific product (for product detail page)
  async getSimilarProducts(productId, limit = 6) {
    try {
      const currentProduct = await Product.findById(productId);
      if (!currentProduct) return [];

      // Find similar products based on category, subcategory, and brand
      const similarProducts = await Product.find({
        _id: { $ne: productId },
        $or: [
          { 
            category: currentProduct.category,
            subcategory: currentProduct.subcategory 
          },
          { 
            category: currentProduct.category,
            brandName: currentProduct.brandName 
          },
          { 
            brandName: currentProduct.brandName 
          }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(limit);

      return similarProducts;
    } catch (error) {
      console.error('Error getting similar products:', error);
      return [];
    }
  }

  // Get recommendations based on search query
  async getSearchBasedRecommendations(searchQuery, limit = 8) {
    try {
      const searchTerms = searchQuery.toLowerCase().split(' ');
      
      // Create search conditions
      const searchConditions = searchTerms.map(term => ({
        $or: [
          { productName: { $regex: term, $options: 'i' } },
          { brandName: { $regex: term, $options: 'i' } },
          { category: { $regex: term, $options: 'i' } },
          { subcategory: { $regex: term, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } }
        ]
      }));

      const recommendations = await Product.find({
        $and: searchConditions
      })
      .sort({ 
        selling_price: 1, // Sort by price
        createdAt: -1 
      })
      .limit(limit);

      return recommendations;
    } catch (error) {
      console.error('Error getting search-based recommendations:', error);
      return [];
    }
  }

  // Analyze user preferences from history
  analyzeUserPreferences(userHistory) {
    const categories = {};
    const brands = {};
    const subcategories = {};

    userHistory.forEach(item => {
      // Count category preferences
      categories[item.category] = (categories[item.category] || 0) + 1;
      brands[item.brandName] = (brands[item.brandName] || 0) + 1;
      subcategories[item.subcategory] = (subcategories[item.subcategory] || 0) + 1;
    });

    // Get top preferences
    const topCategories = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    const topBrands = Object.entries(brands)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([brand]) => brand);

    const topSubcategories = Object.entries(subcategories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([subcategory]) => subcategory);

    return {
      categories: topCategories,
      brands: topBrands,
      subcategories: topSubcategories
    };
  }

  // Get products based on user preferences
  async getProductsByPreferences(preferences, userId, limit) {
    try {
      const query = {
        $or: [
          { category: { $in: preferences.categories } },
          { brandName: { $in: preferences.brands } },
          { subcategory: { $in: preferences.subcategories } }
        ]
      };

      const products = await Product.find(query)
        .sort({ 
          createdAt: -1,
          selling_price: 1 
        })
        .limit(limit * 2); // Get more to filter out viewed products

      // Filter out products user might have already viewed/purchased
      const viewedProductIds = await this.getUserViewedProducts(userId);
      const filteredProducts = products.filter(
        product => !viewedProductIds.includes(product._id.toString())
      );

      return filteredProducts.slice(0, limit);
    } catch (error) {
      console.error('Error getting products by preferences:', error);
      return [];
    }
  }

  // Get popular products as fallback
  async getPopularProducts(limit) {
    try {
      return await Product.find({})
        .sort({ 
          stock: -1, // Products with higher stock might be popular
          createdAt: -1 
        })
        .limit(limit);
    } catch (error) {
      console.error('Error getting popular products:', error);
      return [];
    }
  }

  // Mock function - replace with actual user interaction tracking
  async getUserInteractionHistory(userId) {
    // This should fetch from your user interaction collection
    // For now, returning empty array - implement based on your user tracking
    try {
      // Example: return await UserInteraction.find({ userId }).populate('productId');
      return [];
    } catch (error) {
      return [];
    }
  }

  // Mock function - replace with actual viewed products tracking
  async getUserViewedProducts(userId) {
    // This should return array of product IDs user has viewed
    // For now, returning empty array
    try {
      // Example: return await UserView.find({ userId }).distinct('productId');
      return [];
    } catch (error) {
      return [];
    }
  }

  // Track user interactions (call this when user views/searches products)
  async trackUserInteraction(userId, productId, interactionType = 'view') {
    try {
      // Implement user interaction tracking
      // Example structure for UserInteraction model:
      /*
      const interaction = new UserInteraction({
        userId,
        productId,
        interactionType, // 'view', 'search', 'purchase'
        timestamp: new Date()
      });
      await interaction.save();
      */
      console.log(`Tracked ${interactionType} interaction for user ${userId} on product ${productId}`);
    } catch (error) {
      console.error('Error tracking user interaction:', error);
    }
  }
}

module.exports = new RecommendationService();