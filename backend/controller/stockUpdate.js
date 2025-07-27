const Product = require("../models/productModel");

const stockUpdate = async (req, res) => {
  try {
    const { items } = req.body;
    console.log("items is ",items)

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided for stock update",
      });
    }

    const updatePromises = items.map(async (items) => {
      const product = await Product.findById(items.productId);


      if (!product) {
        throw new Error(`Product not found with ID: ${items.productId}`);
      }

      if (product.stock < items.quantity) {
        throw new Error(`Not enough stock for ${product.productName}`);
      }

      product.stock -= items.quantity;
      await product.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("❌ Stock update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating stock",
      error: error.message,
    });
  }
};

module.exports = stockUpdate;
