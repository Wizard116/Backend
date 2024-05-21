// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.authenticateUser = (req, res, next) => {
  // Logic to authenticate user using JWT token
  console.log(new Date().toLocaleString());
  next();
}


exports.authenticateToken = (req, res, next) => {
  const JWT_KEY = config.jwt_key;
  // Get token from request headers
  const authorization = req.headers.authorization
  if(!authorization) return res.status(401).json({ error: 'Token Not Found' });

  const token = req.headers['authorization'].split(' ')[1];

  // Check if token is provided
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token
  jwt.verify(token, JWT_KEY, (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }
      // If token is valid, save decoded user information in request object
      req.user = decoded;
      next();
  });
}