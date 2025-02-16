import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCountryStatistics, updateCountryRate } from '../services/api';
import '../styles/CountrySummary.css';

const CountrySummary = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [newRate, setNewRate] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      const data = await getCountryStatistics(code);
      if (data.length > 0) {
        setStatistics(data[0]);
      }
    };
    fetchStatistics();
  }, [code]);

  const handleUpdate = async () => {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert("Please enter a valid rate between 0 and 100.");
      return;
    }

    const result = await updateCountryRate(code, rate);
    if (result) {
      alert("Rate updated successfully!");
      setNewRate('');
      const updatedData = await getCountryStatistics(code);
      setStatistics(updatedData[0]);
    }
  };

  if (!statistics) return <div>Loading...</div>;

  return (
    <div className="summary-container">
      <h2 className="summary-title">{statistics.country_name} - Internet Statistics</h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Rate (WB)</th>
            <th>Year (WB)</th>
            <th>Rate (ITU)</th>
            <th>Year (ITU)</th>
            <th>Users (CIA)</th>
            <th>Year (CIA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{statistics.rate_wb}</td>
            <td>{statistics.year_wb}</td>
            <td>{statistics.rate_itu}</td>
            <td>{statistics.year_itu}</td>
            <td>{statistics.users_cia}</td>
            <td>{statistics.year_cia}</td>
          </tr>
        </tbody>
      </table>

      {/* Update Rate Section */}
      <div className="update-section">
        <input
          className="rate-input"
          type="number"
          value={newRate}
          onChange={(e) => setNewRate(e.target.value)}
          placeholder="Enter new rate"
          min="0"
          max="100"
        />
        <button className="update-button" onClick={handleUpdate}>Update</button>
      </div>

      {/* Go to Home Button */}
      <button className="go-home-button" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default CountrySummary;
