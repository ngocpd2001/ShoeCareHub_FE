import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getData } from "../../../api/api";
import moment from "moment";
import { Select, message } from "antd";
const { Option } = Select;

const options = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
  },

  // responsive: [
  //   {
  //     breakpoint: 1536,
  //     options: {
  //       plotOptions: {
  //         bar: {
  //           borderRadius: 0,
  //           columnWidth: "25%",
  //         },
  //       },
  //     },
  //   },
  // ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
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
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    theme: "dark",
  },
};

const ChartElder = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Người dùng",
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

      console.log(data?.data);

      const userSeries = [];
      const elderSeries = [];

      // Chuyển đổi dữ liệu từ API
      for (let key in data?.data) {
        userSeries.push(data?.data[key].user);
        elderSeries.push(data?.data[key].elder);
      }

      console.log(userSeries);
      setState({
        series: [
          {
            name: "Người cao tuổi",
            data: elderSeries,
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
            Thống kê số lượng người cao tuổi qua từng năm
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
        <div id="ChartElder" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartElder;
