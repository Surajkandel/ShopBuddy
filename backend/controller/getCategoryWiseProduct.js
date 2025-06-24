const productModel = require("../models/productModel");

const getCategoryWiseProduct = async (req, res) => {
    try {
        const {subcategory}= req?.body 
        const product = productModel.find({subcategory})

        res.json({
            data: product,
            message : "Product",
            success: true,
            error: false
        })


    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = getCategoryWiseProduct