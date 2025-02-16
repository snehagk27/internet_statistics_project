require('dotenv').config(); // Load .env variables
const request = require('supertest');
const app = require('./server'); // Import the Express app

describe('REST API Testing', () => {
  // Use the API key from the environment
  const apiKey = process.env.API_KEY;

  // Test for the root route to ensure it's working
  test('GET / should return Hello World', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World');
  });

  // Test for the /api/countries route with a valid API key
  test('GET /api/countries should return a list of countries with valid API key', async () => {
    const res = await request(app)
      .get('/api/countries')
      .set('x-api-key', apiKey); // Add the API key in the request header
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Ensure response is an array
  });

  // Test for the /api/statistics/:country route with a valid API key
  test('GET /api/statistics/:country should return statistics for a country with valid API key', async () => {
    const res = await request(app)
      .get('/api/statistics/USA')
      .set('x-api-key', apiKey); // Add the API key in the request header
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test for a country that doesn't exist in the statistics route
  test('GET /api/statistics/InvalidCountry should return an empty array with valid API key', async () => {
    const res = await request(app)
      .get('/api/statistics/InvalidCountry')
      .set('x-api-key', apiKey); // Add the API key in the request header
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]); // Should return an empty array if country not found
  });

  // Test for /api/countries route without an API key (should return 401 Unauthorized)
  test('GET /api/countries without API key should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/countries');
    expect(res.statusCode).toBe(401); // No API key provided
    expect(res.body).toHaveProperty('error', 'API key is required or invalid');
  });

  // Test for /api/countries route with an invalid API key (should return 401 Unauthorized)
  test('GET /api/countries with invalid API key should return 401 Unauthorized', async () => {
    const res = await request(app)
      .get('/api/countries')
      .set('x-api-key', 'invalid-api-key'); // Invalid API key
    expect(res.statusCode).toBe(401); // Invalid API key
    expect(res.body).toHaveProperty('error', 'API key is required or invalid');
  });
});
