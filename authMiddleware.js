// authMiddleware.js
const dotenv = require('dotenv');
dotenv.config();

function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.FAMILY_API_KEY) {
    next(); // Valid API key, proceed to the next middleware or route handler
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }
}

module.exports = authenticate;

