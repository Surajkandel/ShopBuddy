const Cart = require('../models/Cart'); // Adjust path as needed

async function clearCart(req, res) {
  try {
    const userId = req.userId;

    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
}

module.exports = clearCart;