const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new Error("Please provide email")
        }

        if (!password) {
            throw new Error("Please provide password")
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            throw new Error("User not found")
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
            }

            const token = await jwt.sign(
                tokenData, 
                process.env.TOKEN_SECRET_KEY, 
                { expiresIn: '10h' }
            );

            // Configure cookie options for production vs development
            const tokenOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            }

            res.cookie("token", token, tokenOption).json({
                message: "Login successfully",
                data: {
                    token: token,
                    role: user.role,
                    status: user.status
                },
                success: true,
                error: false
            })

        } else {
            throw new Error("Password does not match")
        }

    } catch (err) {
        res.status(400).json({
            message: err.message,
            error: true,
            success: false
        })
    }
}

module.exports = userSignInController