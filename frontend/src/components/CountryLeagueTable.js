import React, { useEffect, useState } from 'react';
import { getCountriesOrderedByRate } from '../services/api';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import '../styles/CountryLeagueTable.css';

const CountryLeagueTable = () => {
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getCountriesOrderedByRate();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  // Filter valid countries for chart
  const validCountriesForChart = countries.filter(country => country.rate_wb && !isNaN(country.rate_wb));

  const chartData = {
    labels: validCountriesForChart.slice(0, 10).map(c => c.country),
    datasets: [
      {
        data: validCountriesForChart.slice(0, 10).map(c => c.rate_wb),
        backgroundColor: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc3a0', '#ff77b6', '#d4a5a5'],
      },
    ],
  };

  // Sort countries by World Bank rate
  const sortedCountries = [...countries].sort((a, b) => {
    if (a.rate_wb && !isNaN(a.rate_wb) && b.rate_wb && !isNaN(b.rate_wb)) {
      return b.rate_wb - a.rate_wb;
    }
    return a.rate_wb && !isNaN(a.rate_wb) ? -1 : 1;
  });

  // Apply search filter
  const searchedCountries = sortedCountries.filter(country =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchedCountries.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when search term changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination controls
  const nextPage = () => {
    if (indexOfLastItem < searchedCountries.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="league-container">
      <h2 className="title">Country League Table</h2>

      <div className="chart-legend-container">
        {validCountriesForChart.length > 0 ? (
          <div className="chart-wrapper">
            <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}/>
          </div>
        ) : (
          <p className="no-data">No valid data available for the chart.</p>
        )}

        <div className="legend-container">
          {validCountriesForChart.slice(0, 10).map((c, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></span>
              {c.country} - {c.rate_wb}%
            </div>
          ))}
        </div>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <table className="styled-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>WB Rate</th>
            <th>WB Year</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((country, index) => (
            <tr key={index}>
              <td className="center">
                <Link to={`/country/${country.code}`} className="country-link">
                  {country.country}
                </Link>
              </td>
              <td className="center">{country.rate_wb !== null && !isNaN(country.rate_wb) ? country.rate_wb : 'N/A'}</td>
              <td className="center">{country.year_wb || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>❮ Prev</button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage} disabled={indexOfLastItem >= searchedCountries.length}>Next ❯</button>
      </div>
    </div>
  );
};

export default CountryLeagueTable;
