// controllers/reviewController.js
const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

// ✅ Create a new review
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.userId; // ✅ extracted from token in middleware

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed the product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    // Create new review
    const review = new Review({
      productId,
      userId,
      rating,
      comment
    });

    await review.save();

    // Update average rating and review count on the product
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate('userId', 'name email') // Show user info
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Helper: update product's average rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId });

  if (reviews.length > 0) {
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatings / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviews.length
    });
  }
};

module.exports = {
  createReview,
  getProductReviews
};
