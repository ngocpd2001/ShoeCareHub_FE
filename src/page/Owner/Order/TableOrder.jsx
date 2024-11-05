import React, { useState, useEffect } from "react";
import { Search, Menu, ChevronDown, MoreHorizontal } from "lucide-react";
import checkmark from "../../../assets/images/Icon/checkmark.png";
import shoe from "../../../assets/images/Icon/shoe.png";
import Cart from "../../../assets/images/Icon/checklist.png";
import Cancel from "../../../assets/images/Icon/cancel.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faFilter } from "@fortawesome/free-solid-svg-icons";
import { faEye, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import "./TableOrder.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { getOrderByBusiness, getOrderByAccountId } from "../../../api/order";
import { getBranchByBranchId } from "../../../api/branch";
import { getBusinessById } from "../../../api/businesses";
import { getServiceById } from "../../../api/service";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();
  
  // Kiểm tra nếu ngày là ngày hiện tại
  if (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  ) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  } else {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

const TableOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("Tất cả");
  const [showActions, setShowActions] = useState(null);
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [showDialog, setShowDialog] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [processingAmount, setProcessingAmount] = useState(0);
  const [finishedAmount, setFinishedAmount] = useState(0);
  const [canceledAmount, setCanceledAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
          // const data = await getOrderByBusiness();
        const businessId = 1; // Thay thế bằng businessId bạn muốn
        const data = await getOrderByBusiness(businessId);

        const formattedOrders = await Promise.all(
          data.map(async (order) => {
            const accountData = await getOrderByAccountId(order.accountId);
            const fullName = accountData[0]?.fullName || "Không xác định";
            const phone = accountData[0]?.phone || "Không xác định";

            const orderDetails = await Promise.all(
              order.orderDetails.map(async (detail) => {
                const service = await getServiceById(detail.serviceId);
                const branch = await getBranchByBranchId(detail.branchId);
                return {
                  ...detail,
                  serviceName: service.name,
                  branchName: branch.name,
                };
              })
            );

            return {
              id: order.id,
              name: orderDetails.map((detail) => detail.serviceName).join(", "),
              customerName: fullName,
              customerPhone: phone,
              date: order.createTime,
              total: order.totalPrice,
              status: order.status || "Không xác định",
              orderDetails: orderDetails,
              avatar: "/path/to/default/avatar.png",
            };
          })
        );

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Lỗi khi fetch đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  // useEffect(() => {
  //   const fetchBranches = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3001/branches");
  //       const data = await response.json();
  //       setBranches(data);
  //     } catch (error) {
  //       console.error("Lỗi khi fetch dữ liệu:", error);
  //     }
  //   };

  //   fetchBranches();
  // }, []);

  useEffect(() => {
    const fetchBussinessData = async () => {
      try {
        // const data = await getBusinessById();
        const data = await getBusinessById(1);
        setPendingAmount(data.pendingAmount);
        setProcessingAmount(data.processingAmount);
        setFinishedAmount(data.finishedAmount);
        setCanceledAmount(data.canceledAmount);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu từ bussiness:", error);
      }
    };

    fetchBussinessData();
  }, []);

  const toggleActions = (id) => {
    setShowActions((prev) => (prev === id ? null : id));
  };

  const handleDateChange = (date) => {
    const currentDate = new Date();
    if (date > currentDate) {
      setShowDialog(true);
    } else {
      setDate(date);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const filteredOrders = orders.filter((order) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      (order.name && order.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.customer &&
        order.customer.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (order.status && order.status.toLowerCase().includes(lowerCaseSearchTerm))
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortCriteria === "name") {
      return (a.name || "").localeCompare(b.name || "");
    } else if (sortCriteria === "customer") {
      return (a.customer || "").localeCompare(b.customer || "");
    } else if (sortCriteria === "status") {
      return (a.status || "").localeCompare(b.status || "");
    }
    return 0;
  });

  const viewOrder = (orderId) => {
    navigate(`/owner/order/${orderId}`);
  };

  const editOrder = (orderId) => {
    console.log(`Editing order with ID: ${orderId}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex bg-gray-100">
      <div className="flex-1 overflow-hidden">
        <div className="bg-white p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full flex items-center justify-center">
                <img
                  src={checkmark}
                  alt="Success"
                  className="w-8 h-8"
                  style={{ filter: "invert(100%)" }}
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[80%]">
                <p className="text-gray-500 text-base font-medium">
                  Chờ xác nhận
                </p>
                <p className="text-2xl font-semibold">{pendingAmount}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center">
                <img
                  src={shoe}
                  alt="Shoe"
                  className="w-8 h-7"
                  style={{ filter: "invert(100%)" }}
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[80%]">
                <p className="text-gray-500 text-base font-medium">
                  Đang xử lý
                </p>
                <p className="text-2xl font-semibold">{processingAmount}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                <img
                  src={Cart}
                  alt="Cart"
                  className="w-8 h-8"
                  style={{ filter: "invert(100%)" }}
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[80%]">
                <p className="text-gray-500 text-base font-medium">
                  Hoàn thành
                </p>
                <p className="text-2xl font-semibold">{finishedAmount}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(to bottom, #f54b64, #f78361)",
                }}
              >
                <img
                  src={Cancel}
                  alt="Cancel"
                  className="w-8 h-8"
                  style={{ filter: "invert(100%)" }}
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[80%]">
                <p className="text-gray-500 text-base font-medium">Đã hủy</p>
                <p className="text-2xl font-semibold">{canceledAmount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white my-6 rounded-lg shadow table-container">
          <div className="p-4 flex justify-between items-center border-b">
            <div className="relative w-[70%] flex items-center">
              <Search
                className="absolute left-3 top-3 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[60%] pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4 justify-center w-[30%]">
              <div className="flex items-center border-2 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 w-[30%]">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="text-gray-400 mr-2 cursor-pointer"
                  onClick={() =>
                    document
                      .querySelector(".react-datepicker__input-container input")
                      .focus()
                  }
                />
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày"
                  className="w-full border-none focus:outline-none font-medium placeholder-[#333333] pl-2"
                />
              </div>

              <div className="flex items-center border-2 rounded-lg px-3 py-2 w-[35]">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="text-gray-400 mr-2"
                />
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full border-none focus:outline-none font-medium placeholder-[#333333] bg-white"
                >
                  <option
                    value="Tất cả"
                    className="block px-2 py-2 text-[#333333] hover:bg-[#1D364D] hover:text-white"
                  >
                    Tất cả
                  </option>
                  {branches.map((branch) => (
                    <option
                      key={branch.id}
                      value={branch.name}
                      className="block px-2 py-2 text-[#333333] hover:bg-[#1D364D] hover:text-white"
                    >
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <table className="w-full mb-4">
            <thead className="bg-[#002278] text-white">
              <tr>
                <th className="text-left p-4 w-[350px]">Chi nhánh</th>
                <th className="text-left p-4 w-[400px]">Tên dịch vụ</th>
                <th className="text-left p-4 status-column">Ngày</th>
                <th className="text-left p-4">Khách hàng</th>
                <th className="text-left p-4">Tổng tiền</th>
                <th className="text-left p-4 status-column">Trạng thái</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 w-[350px]">{order.orderDetails[0].branchName}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {/* <img
                        src={order.avatar}
                        alt=""
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/path/to/default/avatar.png";
                        }}
                      /> */}
                      <span className="break-words w-[400px]">
                        {order.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 status-column">
                    {formatDate(order.date)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {order.customerName}
                      </span>
                      <span className="text-gray-500">
                        {order.customerPhone}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td className="p-4 status-column">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Đang xử lý"
                          ? "bg-orange-100 text-orange-600"
                          : order.status === "Đang chờ"
                          ? "bg-blue-100 text-blue-600"
                          : order.status === "Hoàn thành"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Đã hủy"
                          ? "bg-red-100 text-red-600"
                          : order.status === "Lưu trữ"
                          ? "bg-gray-100 text-gray-600"
                          : order.status === "Đang giao hàng"
                          ? "bg-yellow-100 text-yellow-600"
                          : order.status === "Quá hạn nhận hàng"
                          ? "bg-purple-100 text-purple-600"
                          : order.status === "Đã xác nhận"
                          ? "bg-teal-100 text-teal-600"
                          : ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center relative">
                    <div className="flex items-center justify-start relative">
                      <button
                        onClick={() => toggleActions(order.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      {showActions === order.id && (
                        <div className="action-popup">
                          <button
                            className="flex items-center text-gray-600 hover:text-blue-500 mb-2"
                            onClick={() => viewOrder(order.id)}
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-xl text-[#002278] mr-2"
                            />
                            View
                          </button>
                          <button
                            className="flex items-center text-gray-600 hover:text-green-500"
                            onClick={() => editOrder(order.id)}
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-xl text-green-500 mr-2"
                            />
                            Update
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination p-4 border-t flex justify-between items-center">
            <span className="text-gray-600">
              Hiển thị {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, sortedOrders.length)} của{" "}
              {sortedOrders.length}
            </span>
            <div className="flex space-x-2">
              {Array.from(
                { length: Math.ceil(sortedOrders.length / itemsPerPage) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    page === currentPage
                      ? "bg-[#002278] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <p className="text-center text-lg font-semibold mb-4">
              Ngày được chọn vượt quá thời gian hiện tại!
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-[#002278] text-white rounded hover:bg-[#001a5e] transition duration-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOrder;
