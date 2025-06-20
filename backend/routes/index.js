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

router.post('/signup', userSignUpController)
router.post('/signin', userSignInController)
router.get('/user-details', authToken, userDetailsController)
router.get('/userLogout', userLogout)


// admin pannel
router.get("/all-users",authToken, allUsers)

//product
router.post("/add-product",authToken, AddProductController)
router.get("/get-product", getProductController)
router.post("/update-product",authToken, updateProductController)

module.exports = router