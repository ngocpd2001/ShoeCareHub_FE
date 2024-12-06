import React from 'react';
import ChartUser from './ChartUser';
import ChartPlatformProfit from './ChartPlatformProfit';
import ChartPlatformOrder from './ChartPlatformOrder';

const DashboardPlatform = () => {
  return (
    <div>
            <h3 className="text-[#002278] text-2xl mb-3 font-semibold ml-3">Thống kê nền tảng</h3>
    <div className="dashboard grid grid-cols-2 gap-5">
      <div className="chart-container">
      <ChartPlatformProfit />
      </div>
      <div className="chart-container">
      <ChartPlatformOrder />
      </div>
      <div className="chart-container">
        <ChartUser />
      </div>
      <div className="chart-container">
      </div>
    </div>
    </div>
  );
};

export default DashboardPlatform;