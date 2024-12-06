import React, { useEffect, useState } from 'react';
import { getBusinessStatisticsByMonth, getBusinessStatisticsByYear } from '../../../api/dashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const ChartOrder = ({ businessId }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthResponse = await getBusinessStatisticsByMonth(businessId);
        const yearResponse = await getBusinessStatisticsByYear(businessId);
        
        setMonthlyData(monthResponse.data.value);
        setYearlyData(yearResponse.data.value);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, [businessId]);

  return (
    <div>
      <h2>Thống kê đơn hàng theo tháng</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      <h2>Thống kê đơn hàng theo năm</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={yearlyData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartOrder;
