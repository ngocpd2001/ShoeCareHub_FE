import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getData } from "../../../api/api";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;
const options = {
  options: {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
    },
    // annotations: {
    //   yaxis: [
    //     {
    //       y: 30,
    //       borderColor: "#999",
    //       label: {
    //         show: true,
    //         text: "Support",
    //         style: {
    //           color: "#fff",
    //           background: "#00E396",
    //         },
    //       },
    //     },
    //   ],
    // },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
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
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  },

  // selection: "one_year",
};

const ChartFour = () => {
  const [state, setState] = useState({
    series: [
      // {
      //   name: "Gói điều dưỡng",
      //   data: [],
      // },

      {
        name: "Gói dịch vụ",
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
          // {
          //   name: "Gói điều dưỡng",
          //   data: nursingPackageSeries,
          // },
          {
            name: "Gói dịch vụ",
            data: servicePackageSeries,
          },
        ],
      });
    });
  };

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-lg sm:px-7.5 xl:col-span-6">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black  ">
            Thống kê số tiền gói dịch vụ qua từng năm
          </h4>
        </div>
        <div>
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
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options.options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartFour;
