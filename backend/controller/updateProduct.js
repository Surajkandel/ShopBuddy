const UploadProductPermission = require("../helpers/permission");
const productModel = require("../models/productModel");

async function updateProductController(req, res){
    try{
        if (!UploadProductPermission(req.userId)) {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false
            });
        }
        const {_id, ...resBody}= req.body

        const updateProduct = await productModel.findByIdAndUpdate(_id, resBody)
        res.json({
            message: "Product Updated Success",
            data: updateProduct,
            success: true,
            error: false
        })


        const productId = req?._id



    }catch(err){
        res.status(400).json({
            message: err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = updateProductController