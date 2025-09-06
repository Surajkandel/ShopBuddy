const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
require('dotenv').config()
const router = require('./routes')

const app = express()

// Configure CORS with multiple allowed origins
const allowedOrigins = [
  'https://shop-buddy-virid.vercel.app',
  'https://shop-buddy-git-main-suraj-kandels-projects-cd581144.vercel.app',
  'https://shop-buddy-f1ba99a9d-suraj-kandels-projects-cd581144.vercel.app',
  'http://localhost:3000' // for local development
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api', router)

const PORT = process.env.PORT || 8080

connectDB().then(() =>
    app.listen(PORT, () => {
        console.log("Connected to database")
        console.log(`Server is running on port ${PORT}`)
    })
)