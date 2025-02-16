
const API_KEY = process.env.API_KEY;  

// Middleware to authenticate API key
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['authorization'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  if (apiKey !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();  // If API key is correct, continue to the next route handler
};

module.exports = authenticateApiKey;


