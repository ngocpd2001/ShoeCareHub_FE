import ChartOne from "./ChartOne";
import ChartTwo from "./ChartTwo";
import ChartThree from "./ChartThree";
import ChartFour from "./ChartFour";
import ChartElder from "./ChartElder";
import { useEffect, useState } from "react";
import { getData } from "../../../api/api";
import TopServicePackage from "./TopServicePackage";

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(null); // Thay bằng dữ liệu thực tế của bạn
  const [totalStaff, setTotalStaff] = useState(null); // Thay bằng dữ liệu thực tế của bạn
  const [totalPatients, setTotalPatients] = useState(null); // Thay bằng dữ liệu thực tế của bạn
  const [totalAmount, setTotalAmount] = useState(null); // Thay bằng dữ liệu thực tế của bạn

  useEffect(() => {
    getData("/statistical/elder").then((e) => {
      setTotalPatients(e.data.totalElderValid);
    });
    getData("/statistical/money").then((e) => {
      setTotalAmount(e.data.totalMoney);
    });
    getData("/statistical/user").then((e) => {
      setTotalStaff(
        // e.data.totalCustomer +
        e.data.totalManager + e.data.totalStaff + e.data.totalNurse
      );
    });
    getData("/statistical/user").then((e) => {
      setTotalUsers(e.data.totalCustomer);
    });
  }, []);
  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
  }
  return (
    <div className="h-max">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 2xl:gap-7.5 mb-6">
        <div className="p-4 bg-white rounded-lg  shadow-lg">
          <h2 className="text-xl font-bold">Tổng số người dùng</h2>
          <p className="text-2xl">{totalUsers}</p>
        </div>
        <div className="p-4 bg-white rounded-lg  shadow-lg">
          <h2 className="text-xl font-bold">Tổng số nhân viên</h2>
          <p className="text-2xl">{totalStaff}</p>
        </div>
        <div className="p-4 bg-white rounded-lg  shadow-lg">
          <h2 className="text-xl font-bold">Tổng số người cao tuổi</h2>
          <p className="text-2xl">{totalPatients}</p>
        </div>
        <div className="p-4 bg-white rounded-lg  shadow-lg">
          <h2 className="text-xl font-bold">Tổng số tiền</h2>
          <p className="text-2xl">{formatCurrency(totalAmount)}</p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartFour />
        <ChartTwo />
        <ChartElder />
      </div>
      <TopServicePackage />
    </div>
  );
}

export default Dashboard;
