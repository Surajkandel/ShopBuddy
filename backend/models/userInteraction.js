// backend/models/UserInteraction.js (Optional - for better recommendations)
const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  interactionType: {
    type: String,
    enum: ['view', 'search', 'purchase', 'cart', 'wishlist'],
    default: 'view'
  },
  searchQuery: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
userInteractionSchema.index({ userId: 1, timestamp: -1 });
userInteractionSchema.index({ productId: 1 });
userInteractionSchema.index({ interactionType: 1 });

module.exports = mongoose.model('UserInteraction', userInteractionSchema);