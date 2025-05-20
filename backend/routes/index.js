const express = require('express')
const userSignUpController = require('../controller/userSignUp')
const userSignInController = require('../controller/userSignIn')
const authToken = require('../middleware/authToken')
const userDetailsController = require('../controller/userDetails')
const router = express.Router()

router.post('/signup', userSignUpController)
router.post('/signin', userSignInController)
router.get('/user-details', authToken, userDetailsController)

module.exports = router