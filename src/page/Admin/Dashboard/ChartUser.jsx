import React, { useEffect, useState } from 'react';
import { getPlatformUser } from '../../../api/dashboard'; // Cập nhật API
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Tabs } from 'antd';

const ChartUser = () => {
  const [userStats, setUserStats] = useState([]); // Chỉ sử dụng một biến để lưu trữ dữ liệu

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlatformUser(); // Gọi API mà không cần businessId
        if (response.length === 0) {
          console.warn('Không có dữ liệu thống kê người dùng');
        }
        
        setUserStats(response); // Lưu trữ dữ liệu vào state
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData(); // Gọi fetchData mà không cần kiểm tra businessId
  }, []);

  return (
    <div>
      <h2 className="font-bold text-2xl text-blue-600">Thống kê người dùng</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userStats} className="my-5" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis 
            dataKey="month" 
            label={{ value: 'Tháng', position: 'bottom', offset: 0 }} 
            angle={-30}
            textAnchor="end"
          />
          <YAxis label={{ value: 'Người dùng', angle: -90, position: 'center', offset: 20 }} domain={[0, 'dataMax + 10']} />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="value" stroke="#002278" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartUser; 