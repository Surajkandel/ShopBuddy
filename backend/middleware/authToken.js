const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
  try {
    // Try to get token from cookies first
    let token = req.cookies?.token;
    
    // If not in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    console.log("AuthToken middleware called");
    console.log("Received token:", token ? "Present" : "Missing");

    if (!token) {
      return res.status(401).json({
        message: "User is not logged in",
        error: true,
        success: false,
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("JWT verification error:", err.message);
        return res.status(403).json({
          message: "Invalid or expired token",
          error: true,
          success: false,
        });
      }

      req.userId = decoded?._id;
      next(); 
    });
  } catch (err) {
    console.error("AuthToken error:", err.message);
    res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

module.exports = authToken;