import React, { useEffect, useState } from 'react';
import { getBusinessProfitByMonth, getBusinessProfitByYear } from '../../../api/dashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const ChartProfit = ({ businessId }) => {
    console.log('Giá trị businessId:', businessId);

    const [monthlyProfit, setMonthlyProfit] = useState([]);
    const [yearlyProfit, setYearlyProfit] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!businessId) {
                console.error('businessId không hợp lệ');
                return; // Ngừng thực hiện nếu businessId không hợp lệ
            }
            try {
                const monthResponse = await getBusinessProfitByMonth(businessId);
                if (!monthResponse.data.value.length) {
                    console.warn('Không có dữ liệu lợi nhuận theo tháng cho businessId:', businessId);
                }
                const yearResponse = await getBusinessProfitByYear(businessId);
                if (!yearResponse.data.value.length) {
                    console.warn('Không có dữ liệu l��i nhuận theo năm cho businessId:', businessId);
                }

                setMonthlyProfit(monthResponse.data.value.length ? monthResponse.data.value : []);
                setYearlyProfit(yearResponse.data.value.length ? yearResponse.data.value : []);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        };

        // Chỉ gọi fetchData khi businessId có giá trị
        if (businessId) {
            fetchData();
        }
    }, [businessId]);

    const maxMonthlyProfit = Math.max(...monthlyProfit.map(item => item.value)) * 1.1 || 2500000;
    const maxYearlyProfit = Math.max(...yearlyProfit.map(item => item.value)) * 1.1 || 2500000;

    return (
        <div>
            <Tabs defaultActiveKey="1" items={[
                {
                    key: "1",
                    label: "Theo tháng",
                    children: (
                        <div className="mb-5">
                            <h2 className="font-bold text-2xl text-blue-600">Thống kê lợi nhuận theo tháng</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyProfit} className="my-5" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <XAxis
                                        dataKey="date"
                                        label={{ value: 'Ngày', position: 'bottom', offset: 0 }}
                                        angle={-30}
                                        textAnchor="end"
                                    />
                                    <YAxis
                                        label={{ value: 'Lợi nhuận', angle: -90, position: 'insideLeft', offset: -15 }}
                                        domain={[0, maxMonthlyProfit]}
                                        ticks={[0, 500000, 1000000, 1500000, 2000000, 2500000]}
                                        tickFormatter={(value) => value.toLocaleString()}
                                    />
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
                            <h2 className="font-bold text-2xl text-blue-600">Thống kê lợi nhuận theo năm</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={yearlyProfit} className="my-5" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <XAxis
                                        dataKey="month"
                                        label={{ value: 'Tháng', position: 'bottom', offset: 0 }}
                                        angle={-30}
                                        textAnchor="end"
                                    />
                                    <YAxis
                                        label={{ value: 'Lợi nhuận', angle: -90, position: 'insideLeft', offset: -15 }}
                                        domain={[0, maxYearlyProfit]}
                                        ticks={[0, 500000, 1000000, 1500000, 2000000, 2500000]}
                                        tickFormatter={(value) => value.toLocaleString()}
                                    />
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

export default ChartProfit; 