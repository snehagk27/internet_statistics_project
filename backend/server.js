const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();  // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Route to get all countries
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM countries');
    res.json(result.rows);  // Return countries as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Route to get statistics by country
app.get('/api/statistics/:country', async (req, res) => {
  const { country } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM internet_statistics WHERE location = $1',
      [country]
    );
    res.json(result.rows);  // Return statistics data as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
