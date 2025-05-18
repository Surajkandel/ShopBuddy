const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
async function userSignInController(req, res) {
    try{
        const {email, password} = req.body

        if (!email) {
            throw new Error("provide email")
        }

        if (!password) {
            throw new Error("provide password")
        }
        

        const user = await userModel.findOne({email})

        if(!user){
            throw new Error("User not found")
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        console.log("checkpassword ",checkPassword)

        if(checkPassword){

        }else{
            throw new Error("Password doesnot match")
        }

    }catch(err){
         res.json({
            message: err.message,
            error: true,
            success: false
        })
    }
}

module.exports = userSignInController