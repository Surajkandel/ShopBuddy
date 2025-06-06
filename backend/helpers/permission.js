const userModel = require("../models/userModel")

const UploadProductPermission = async(userId) =>{
    const user = await userModel.findById(userId)

    console.log("role of the user is ",user.role)

    if(user.role !== "Seller"){
        return false
    }
    return true
}

module.exports = UploadProductPermission