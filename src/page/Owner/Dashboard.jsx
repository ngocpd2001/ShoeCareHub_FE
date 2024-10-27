// src/page/Owner/Dashboard.jsx
import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Tất cả');
  const branches = ['Tất cả', 'Chi nhánh A', 'Chi nhánh B', 'Chi nhánh C'];

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const selectBranch = (branch) => {
    setSelectedBranch(branch);
    setShowDropdown(false);
  };

  return (
    <div className="dashboard">
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-button">
            <span className="icon">🔽</span> {selectedBranch}
          </button>
          {showDropdown && (
            <ul className="dropdown-menu">
              {branches.map((branch, index) => (
                <li key={index} onClick={() => selectBranch(branch)}>
                  {branch}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="stats">
        <div className="stat-card">
          <h3>Tổng số người dùng</h3>
          <p>25</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số nhân viên</h3>
          <p>39</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số photo</h3>
          <p>12</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số tiền</h3>
          <p>1.096.130.000 ₫</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
