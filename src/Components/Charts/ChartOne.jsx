import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const options = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3056D3", "#80CAEE", "#6577f3", "#c90000"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
    
  },
  // responsive: [
  //   {
  //     breakpoint: 1024,
  //     options: {
  //       chart: {
  //         height: 300,
  //       },
  //     },
  //   },
  //   {
  //     breakpoint: 1366,
  //     options: {
  //       chart: {
  //         height: 350,
  //       },
  //     },
  //   },
  // ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE", "#6577f3", "#c90000"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  // yaxis: {
  //   title: {
  //     style: {
  //       fontSize: "0px",
  //     },
  //   },
  //   min: 0,
  //   max: 100,
  // },
};

const ChartOne = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Dịch vụ 1 ngày duy nhất",
        data: [30, 25, 36, 30, 45, 25, 4, 52, 59, 26, 32, 51],
      },

      {
        name: "Dịch vụ lặp lại theo ngày",
        data: [15, 42, 38, 29, 14, 53, 27, 36, 21, 58, 33, 7],
      },
      // {
      //   name: "Dịch vụ lặp lại theo tuần",
      //   data: [5, 23, 48, 12, 59, 30, 39, 46, 10, 24, 37, 41],
      // },
      // {
      //   name: "Dịch vụ không giới hạn thời gian",
      //   data: [50, 18, 25, 44, 9, 37, 31, 54, 3, 19, 43, 28],
      // },
    ],
  });



  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default     sm:px-7.5 xl:col-span-7">
      <p className="text-xl font-semibold text-black ">
        Thống kê số lượng đăng ký dịch vụ
      </p>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <div className="w-full">
              <p className="font-semibold text-cyan-400">Total Revenue</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <div className="w-full">
              <p className="font-semibold ">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center rounded-md bg-[#F5F7FD] p-1.5  ">
          <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-[0px_1px_3px_rgba(0,0,0,0.12)] hover:bg-white    ">
            Day
          </button>
          <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-[0px_1px_3px_rgba(0,0,0,0.12)]  ">
            Week
          </button>
          <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-[0px_1px_3px_rgba(0,0,0,0.12)]  ">
            Month
          </button>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
