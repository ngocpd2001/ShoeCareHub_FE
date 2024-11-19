import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getData } from "../../../api/api";
import moment from "moment";
import { Select, message } from "antd";
const { Option } = Select;
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
  yaxis: {
    labels: {
      formatter: (value) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (value) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
  },
};

const ChartOne = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Gói điều dưỡng",
        data: [],
      },
    ],
  });
  const currentYear = moment().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const handleYearChange = (value) => {
    setSelectedYear(value);
    fetchData(value);
  };
  console.log(currentYear);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (year) => {
    getData(`statistical/${year || selectedYear}`).then((data) => {
      // Chuyển đổi dữ liệu từ API

      const nursingPackageSeries = [];
      const servicePackageSeries = [];

      // Chuyển đổi dữ liệu từ API
      for (let key in data?.data) {
        nursingPackageSeries.push(data?.data[key].nursingPackage);
        servicePackageSeries.push(data?.data[key].servicePackage);
      }

      setState({
        series: [
          {
            name: "Gói điều dưỡng",
            data: nursingPackageSeries,
          },
          // {
          //   name: "Gói dịch vụ",
          //   data: servicePackageSeries,
          // },
        ],
      });
    });
  };
  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-lg sm:px-7.5 xl:col-span-6">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <p className="text-xl font-semibold text-black ">
          Thống kê số tiền gói dưỡng lão qua từng năm
        </p>
        <div className="relative z-20 inline-block">
          <Select
            defaultValue={currentYear}
            style={{ width: 120 }}
            onChange={handleYearChange}
          >
            {Array.from({ length: 11 }, (_, i) => currentYear - i).map(
              (year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              )
            )}
          </Select>
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
