const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body

        if (!email) {
            return res.status(400).json({
                message: "Please provide email",
                error: true,
                success: false
            })
        }

        if (!password) {
            return res.status(400).json({
                message: "Please provide password",
                error: true,
                success: false
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
            }

            const token = jwt.sign(
                tokenData, 
                process.env.TOKEN_SECRET_KEY, 
                { expiresIn: '10h' }
            );

            // Configure cookie options for production vs development
            const isProduction = process.env.NODE_ENV === 'production';
            const tokenOption = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'None' : 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                // domain: isProduction ? '.vercel.app' : undefined
            }

            res.cookie("token", token, tokenOption).json({
                message: "Login successful",
                data: {
                    token: token,
                    role: user.role,
                    status: user.status,
                    userId: user._id
                },
                success: true,
                error: false
            })

        } else {
            return res.status(401).json({
                message: "Password does not match",
                error: true,
                success: false
            })
        }

    } catch (err) {
        console.error("SignIn error:", err.message);
        res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}

module.exports = userSignInController;