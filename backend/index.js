const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
require('dotenv').config()
const router = require('./routes')

const app = express()

// ✅ List of allowed frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  'https://shopbuddy-frontend.vercel.app',
  'https://shop-buddy-ju9m.vercel.app'
]

// ✅ Dynamic CORS check
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
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
    console.log("connected to db")
    console.log("server is running on port ", PORT)
  })
)
