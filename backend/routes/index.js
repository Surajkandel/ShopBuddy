const express = require('express')
const router = express.Router()

const userSignUpController = require('../controller/userSignUp')
const userSignInController = require('../controller/userSignIn')
const authToken = require('../middleware/authToken')
const userDetailsController = require('../controller/userDetails')
const userLogout = require('../controller/userLogout')
const allUsers = require('../controller/allUsers')
const AddProductController = require('../controller/addProduct')
const getProductController = require('../controller/getProduct')
const updateProductController = require('../controller/updateProduct')
const getCategoryProduct = require('../controller/getCategoryProduct')
const getCategoryWiseProduct = require('../controller/getCategoryWiseProduct')
const getProductDetails = require('../controller/getProductDetails')
const addToCart = require('../controller/addToCart')
const countAddToCartProduct = require('../controller/countAddToCart')
const addToCartProductView = require('../controller/addToCartProductView')
const removeFromCart = require('../controller/removeFromCart')
const updateCartProduct = require('../controller/updateCartProduct')

// User authentication routes
router.post('/signup', userSignUpController)
router.post('/signin', userSignInController)
router.get('/user-details', authToken, userDetailsController)
router.get('/userLogout', userLogout)

// Admin panel routes
router.get("/all-users", authToken, allUsers)

// Product routes
router.post("/add-product", authToken, AddProductController)
router.get("/get-product", getProductController)
router.post("/update-product", authToken, updateProductController)
router.get("/get-CategoryProduct", getCategoryProduct)
router.post("/product-by-category", getCategoryWiseProduct)
router.get("/productdetails/:id", getProductDetails)

// Cart routes
router.post("/addtocart", authToken, addToCart)
router.get("/view-add-to-cart-product", authToken, addToCartProductView)
router.post("/countaddtocartproduct", authToken, countAddToCartProduct)
router.delete("/remove-from-cart", authToken, removeFromCart)
router.put("/update-cart-product", authToken, updateCartProduct)

module.exports = router