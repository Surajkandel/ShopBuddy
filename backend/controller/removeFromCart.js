const addToCartModel = require("../models/cartProduct")

const removeFromCart = async (req, res) => {
    try {
        const currentUser = req.userId
        const { productId } = req.body

        const deletedProduct = await addToCartModel.findOneAndDelete({
            userId: currentUser,
            productId: productId
        })

        if (!deletedProduct) {
            return res.json({
                message: "Product not found in cart",
                error: true,
                success: false
            })
        }

        res.json({
            message: "Item removed from cart",
            success: true,
            error: false
        })

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = removeFromCart