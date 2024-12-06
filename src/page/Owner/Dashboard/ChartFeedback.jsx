import React, { useEffect, useState } from 'react';
import { getBusinessFeedbackByMonth, getBusinessFeedbackByYear } from '../../../api/dashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const ChartFeedback = ({ businessId }) => {
  console.log('Giá trị businessId:', businessId);

  const [monthlyFeedback, setMonthlyFeedback] = useState([]);
  const [yearlyFeedback, setYearlyFeedback] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) {
        console.error('businessId không hợp lệ');
        return; // Ngừng thực hiện nếu businessId không hợp lệ
      }
      try {
        const monthResponse = await getBusinessFeedbackByMonth(businessId);
        if (!monthResponse.data.value.length) {
          console.warn('Không có dữ liệu phản hồi theo tháng cho businessId:', businessId);
        }
        const yearResponse = await getBusinessFeedbackByYear(businessId);
        if (!yearResponse.data.value.length) {
          console.warn('Không c�� dữ liệu phản hồi theo năm cho businessId:', businessId);
        }
        
        setMonthlyFeedback(monthResponse.data.value.length ? monthResponse.data.value : []);
        setYearlyFeedback(yearResponse.data.value.length ? yearResponse.data.value : []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    // Chỉ gọi fetchData khi businessId có giá trị
    if (businessId) {
      fetchData();
    }
  }, [businessId]);

  return (
    <div>
      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Theo tháng",
          children: (
            <div className="mb-5">
               <h2 className="font-bold text-2xl text-blue-600">Thống kê đánh giá theo tháng</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyFeedback} className="my-5" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            <div className="mb-5">
                <h2 className="font-bold text-2xl text-blue-600">Thống kê đánh giá theo năm</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyFeedback} className="my-5" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            </div>
          ),
        },
      ]} />
    </div>
  );
};

export default ChartFeedback; 