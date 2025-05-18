const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config()
const router = require('./routes')


const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

const PORT = 8080 || process.env.PORT

connectDB().then(() =>
    app.listen(PORT, () => {
        console.log("connected to db")
        console.log("server is running")
}
))
