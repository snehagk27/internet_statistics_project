require('dotenv').config(); // Load .env variables

const request = require('supertest');
const app = require('./server'); // Import the Express app

describe('REST API Testing', () => {
  // Use the API key from the environment
  const apiKey = process.env.API_KEY; 

  test('GET / should return Hello World', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World');
  });

  test('GET /api/countries should return a list of countries', async () => {
    const res = await request(app)
      .get('/api/countries')
      .set('x-api-key', apiKey); // Add the API key in the request header
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array); // Ensure response is an array
  });

  test('GET /api/statistics/:country should return statistics for a country', async () => {
    const res = await request(app)
      .get('/api/statistics/USA')
      .set('x-api-key', apiKey); // Add the API key in the request header
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('GET /api/statistics/InvalidCountry should return an empty array', async () => {
    const res = await request(app)
      .get('/api/statistics/InvalidCountry')
      .set('x-api-key', apiKey); // Add the API key in the request header
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
