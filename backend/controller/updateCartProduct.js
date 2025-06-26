const mongoose = require('mongoose');
const addToCartModel = require("../models/cartProduct");

const updateCartProduct = async (req, res) => {
  try {
    const currentUser = req.userId;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.json({
        message: "Quantity must be at least 1",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid productId",
        error: true,
        success: false,
      });
    }

    const updatedProduct = await addToCartModel.findOneAndUpdate(
      {
        userId: currentUser,
        productId: new mongoose.Types.ObjectId(productId), // Convert properly
      },
      {
        $set: { quantity: quantity },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found in cart",
        error: true,
        success: false,
      });
    }

    res.json({
      data: updatedProduct,
      message: "Cart updated successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    console.error("Error in updateCartProduct:", err); // Add this for debugging
    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

module.exports = updateCartProduct;
