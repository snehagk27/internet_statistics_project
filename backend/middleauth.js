require('dotenv').config();  // Load environment variables

// Middleware to authenticate API key
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key'); // Read API key from request header
  
  // Validate API key
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
  
  next(); // Continue to the next middleware/route handler
};

module.exports = authenticateApiKey;
