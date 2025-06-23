const productModel = require("../models/productModel");

const getCategoryProduct = async (req, res) => {
  try {
    const categories = await productModel.distinct("category");
    const productByCategory = [];

    for (const category of categories) {
      const subcategories = await productModel.distinct("subcategory", { category });

      // If subcategories exist
      if (subcategories.length > 0) {
        for (const subcategory of subcategories) {
          if (subcategory && subcategory.trim() !== "") {
            const product = await productModel.findOne({ category, subcategory });
            if (product) {
              productByCategory.push(product);
            }
          } else {
            // Fallback if subcategory is empty
            const fallbackProduct = await productModel.findOne({ category });
            if (fallbackProduct) {
              productByCategory.push(fallbackProduct);
            }
          }
        }
      } else {
        // No subcategories found, use category directly
        const fallbackProduct = await productModel.findOne({ category });
        if (fallbackProduct) {
          productByCategory.push(fallbackProduct);
        }
      }
    }

    res.json({
      message: "Category/Subcategory-wise products fetched",
      data: productByCategory,
      success: true,
      error: false
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = getCategoryProduct;
