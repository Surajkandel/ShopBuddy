const express = require('express')
const router = express.Router()

const userSignUpController = require('../controller/userSignUp')
const userSignInController = require('../controller/userSignIn')
const authToken = require('../middleware/authToken')
const userDetailsController = require('../controller/userDetails')
const userLogout = require('../controller/userLogout')
const allUsers = require('../controller/allUsers')
const pendingSellers = require('../controller/pendingSellers')
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
const searchProduct = require('../controller/searchProduct')
const sellerSignUpController = require('../controller/sellerSignup')
const sellerStatus  = require('../controller/sellerStatus')
const {
  getNotifications,
  getNotificationCount,
  markAllAsRead,
  markNotificationAsRead
} = require('../controller/notificationController');


// User authentication routes
router.post('/signup', userSignUpController)
router.post('/sellersignup/:id', sellerSignUpController)
router.post('/signin', userSignInController)
router.get('/user-details', authToken, userDetailsController)
router.get('/userLogout', userLogout)

// Admin panel routes
router.get("/all-users", authToken, allUsers)
router.get("/pending-sellers", authToken, pendingSellers)
router.put("/update-status", authToken, sellerStatus)

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
router.post("/remove-from-cart", authToken, removeFromCart)
router.post("/update-cart-product", authToken, updateCartProduct)
router.get("/search", searchProduct)

// notification routes 
router.get('/notifications/list', authToken, getNotifications);
router.get('/notifications/count', authToken, getNotificationCount);
router.put('/notifications/mark-all-read', authToken, markAllAsRead);
router.put('/notifications/mark-read/:id', authToken, markNotificationAsRead);

module.exports = router