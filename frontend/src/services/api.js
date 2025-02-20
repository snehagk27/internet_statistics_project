import axios from 'axios';

// Base URL for the backend API
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`,
  },
});

// Function to get countries
export const getCountries = async () => {
  try {
    const response = await api.get('/countries');
    return response.data;
  } catch (error) {
    console.error("Error fetching countries", error);
    return [];
  }
};

// Function to get country statistics
export const getCountryStatistics = async (country) => {
  try {
    const response = await api.get(`/statistics/${country}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching statistics for ${country}`, error);
    return {};
  }
};

// Function to get countries ordered by WB rate
export const getCountriesOrderedByRate = async () => {
  try {
    const response = await api.get('/countries-ordered-by-wb-rate');
    return response.data;
  } catch (error) {
    console.error("Error fetching countries ordered by rate", error);
    return [];
  }
};

// Function to update the WB Rate
export const updateCountryRate = async (countryCode, newRate) => {
  try {
    const response = await api.put('/update-rate', { countryCode, newRate });
    return response.data;
  } catch (error) {
    console.error("Error updating country rate", error);
    return null;
  }
};
