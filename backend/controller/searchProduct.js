// const productModel = require("../models/productModel")


// const searchProduct = async(req,res)=>{
//     try{
//         const query = req.query.q 

//         const regex = new RegExp(query,"i","g")

//         const product = await productModel.find({
//             "$or" : [
//                 {
//                     productName : regex
//                 },
//                 {
//                     category : regex
//                 },
//                 {
//                     subcategory : regex
//                 },
                
//                 {
//                     brandName : regex
//                 }
//             ]
//         })


//         res.json({
//             data  : product ,
//             message : "Search Product list",
//             error : false,
//             success : true
//         })
//     }catch(err){
//         res.json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = searchProduct

const productModel = require("../models/productModel");

const searchProduct = async (req, res) => {
  try {
    const query = req.query.q;
    const regex = new RegExp(query, "i");

    // Search for products matching the query
    const products = await productModel.find({
      $or: [
        { productName: regex },
        { category: regex },
        { subcategory: regex },
        { brandName: regex },
      ],
    });

    // Generate recommendations based on the first matched product's attributes
    let recommendations = [];
    if (products.length > 0) {
      const primaryProduct = products[0]; // Use the first product for recommendation criteria
      recommendations = await productModel
        .find({
          $or: [
            { category: primaryProduct.category },
            { subcategory: primaryProduct.subcategory },
            { brandName: primaryProduct.brandName },
          ],
          _id: { $nin: products.map((p) => p._id) }, // Exclude already matched products
        })
        .limit(5); // Limit to 5 recommendations
    }

    res.json({
      data: products,
      recommendations, // Include recommendations in the response
      message: "Search Product list",
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = searchProduct;