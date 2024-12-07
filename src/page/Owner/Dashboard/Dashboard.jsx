// src/page/Owner/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getEmployeeByBusinessId } from '../../../api/employee';
import { getBusinessById } from '../../../api/businesses';
import ChartOrder from './ChartOrder';
import ChartFeedback from './ChartFeedback';
import ChartProfit from './ChartProfit';
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
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin user từ localStorage
        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr);
        setBusinessId(user?.businessId);

        // Kiểm tra businessId trước khi gọi API
        if (!user?.businessId) {
          console.error("Không tìm thấy businessId trong user.");
          return; // Ngừng thực hiện nếu không có businessId
        }

        const employeeData = await getEmployeeByBusinessId(user.businessId);
        const businessData = await getBusinessById(user.businessId);

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
      {/* <div className="search-bar">
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
      </div> */}
      <h3 className="text-[#002278] text-2xl mb-3 font-semibold ml-3">Thống kê cửa hàng</h3>
      {/* <div className="stats">
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
      </div> */}
      <div className="dashboard grid grid-cols-2 gap-5">
        <div className="chart-container">
          <ChartOrder businessId={businessId} />
        </div>
        <div className="chart-container">
          <ChartFeedback businessId={businessId} />
        </div>
        <div className="chart-container">
          <ChartProfit businessId={businessId} />
        </div>
        <div className="chart-container">
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
