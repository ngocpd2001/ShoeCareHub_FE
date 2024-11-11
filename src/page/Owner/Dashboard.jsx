// src/page/Owner/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getEmployeeByBusinessId } from '../../api/employee';
import { getBusinessById } from '../../api/businesses';

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Tất cả');
  const branches = ['Tất cả', 'Chi nhánh A', 'Chi nhánh B', 'Chi nhánh C'];
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalEmployees: 0,
    totalServices: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin user từ localStorage
        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr);
        const businessId = user?.businessId;
        
        // console.log("BusinessID:", businessId);

        const employeeData = await getEmployeeByBusinessId(businessId);
        const businessData = await getBusinessById(businessId);
        
        // console.log("Toàn bộ dữ liệu nhân viên:", employeeData);
        // console.log("Số lượng nhân viên:", employeeData?.employees?.length);
        
        setStatistics(prev => ({
          ...prev,
          totalEmployees: employeeData?.employees?.length || 0,
          totalServices: businessData?.toTalServiceNum || 0,
          totalOrders: businessData?.totalOrder || 0,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

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
          <h3>Tổng số đơn hàng</h3>
          <p>{statistics.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số nhân viên</h3>
          <p>{statistics.totalEmployees}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số dịch vụ</h3>
          <p>{statistics.totalServices}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng doanh thu</h3>
          <p>{statistics.totalRevenue.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
