const mongoose = require('mongoose')

async function connectDB() {
    try{
         await mongoose.connect(process.env.MONGODB_URL)
       

    }catch(err){
        console.log("error is ", err)
    };
    
    
}

module.exports = connectDB