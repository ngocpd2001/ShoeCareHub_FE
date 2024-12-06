import React, { useEffect, useState } from 'react';
import { getPlatformOrderByMonth, getPlatformOrderByYear } from '../../../api/dashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const ChartPlatformOrder = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const monthResponse = await getPlatformOrderByMonth();
        if (!monthResponse.length) {
          console.warn('Không có dữ liệu thống kê theo tháng');
        }
        const yearResponse = await getPlatformOrderByYear();
        if (!yearResponse.length) {
          console.warn('Không có dữ liệu thống kê theo năm');
        }
        
        setMonthlyData(monthResponse.length ? monthResponse : []);
        setYearlyData(yearResponse.length ? yearResponse : []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Theo tháng",
          children: (
            <div className="mb-5">
              <h2 className="font-bold text-2xl text-blue-600">Thống kê đơn hàng theo tháng</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} className="my-5" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis 
                    dataKey="date" 
                    label={{ value: 'Ngày', position: 'bottom', offset: 0 }} 
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }} domain={[0, 'dataMax + 10']} />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="value" fill="#002278" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ),
        },
        {
          key: "2",
          label: "Theo năm",
          children: (
            <>
              <h2 className="font-bold text-2xl text-blue-600">Thống kê đơn hàng theo năm</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyData} className="my-5" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Tháng', position: 'bottom', offset: 0 }} 
                    angle={-30}
                    textAnchor="end"
                  />
                  <YAxis label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }} domain={[0, 'dataMax + 10']} />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="value" fill="#002278" />
                </BarChart>
              </ResponsiveContainer>
            </>
          ),
        },
      ]} />
    </div>
  );
};

export default ChartPlatformOrder;