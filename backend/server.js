const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const authenticateApiKey = require('./middleauth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // Middleware to parse JSON requests

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// CORS setup
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Apply API key authentication to all /api routes
app.use('/api', authenticateApiKey);

// Route to get all countries
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM countries');
    res.json(result.rows);
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
      `SELECT
        i.id,
        c.country AS country_name,
        i.rate_wb,
        i.year_wb,
        i.rate_itu,
        i.year_itu,
        i.users_cia,
        i.year_cia,
        i.notes
      FROM
        internet_statistics i
      JOIN
        countries c ON i.location = c.code
      WHERE
        i.location = $1`,
      [country]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});


// Route to get countries ordered by WB rate
app.get('/api/countries-ordered-by-wb-rate', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.code, c.country, i.rate_wb, i.year_wb
      FROM countries c
      JOIN internet_statistics i ON c.code = i.location
      ORDER BY i.rate_wb DESC
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No countries found' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch countries ordered by WB rate' });
  }
});


// Route to update the WB Rate
app.put('/api/update-rate', async (req, res) => {
  const { countryCode, newRate } = req.body;

  if (!countryCode || newRate === undefined) {
    return res.status(400).json({ error: 'Country code and new rate are required' });
  }

  if (isNaN(newRate) || newRate < 0 || newRate > 100) {
    return res.status(400).json({ error: 'Rate must be a number between 0 and 100' });
  }

  try {
    const currentYear = new Date().getFullYear();
    const result = await pool.query(
      'UPDATE internet_statistics SET rate_wb = $1, year_wb = $2 WHERE location = $3 RETURNING *',
      [newRate, currentYear, countryCode]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json({ message: 'Rate updated successfully', updatedCountry: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update rate' });
  }
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
