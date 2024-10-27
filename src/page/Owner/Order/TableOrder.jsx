import React, { useState, useRef, useEffect } from "react";
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

const TableOrder = () => {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const orders = [
    {
      id: 1,
      avatar: "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
      name: "Vệ sinh đặc biệt",
      date: "14/04/1994",
      customer: "John Burkhardt",
      orderCode: "U10093",
      status: "Đang xử lý",
      total: "12.000đ",
      branch: "Chi nhánh 1", 
    },
    {
      id: 2,
      avatar: "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
      name: "Vệ sinh đặc biệt",
      date: "14/04/1994",
      customer: "Maria Beck",
      orderCode: "U10093",
      status: "Đang xử lý",
      total: "12.000đ",
      branch: "Chi nhánh 2",
    },
    {
      id: 3,
      avatar: "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
      name: "Vệ sinh đặc biệt",
      date: "13/04/1994",
      customer: "Muhammad Karim",
      orderCode: "U10093",
      status: "Chờ xác nhận",
      total: "12.000đ",
      branch: "Chi nhánh 1", 
    },
    {
      id: 4,
      avatar: "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
      name: "Vệ sinh đặc biệt",
      date: "12/04/1994",
      customer: "Lewis Bear",
      orderCode: "U10093",
      status: "Chờ xác nhận",
      total: "12.000đ",
      branch: "Chi nhánh 3", 
    },
    {
      id: 5,
      avatar: "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
      name: "Vệ sinh đặc biệt",
      date: "11/04/1994",
      customer: "Jack Allen",
      orderCode: "U10093",
      status: "Đã hủy",
      total: "12.000đ",
      branch: "Chi nhánh 2", 
    },
  ];

  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("Tất c");
  const [showActions, setShowActions] = useState(null);
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:3001/branches");
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchBranches();
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
      order.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      order.customer.toLowerCase().includes(lowerCaseSearchTerm) ||
      order.status.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortCriteria === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortCriteria === "customer") {
      return a.customer.localeCompare(b.customer);
    } else if (sortCriteria === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });


  const viewOrder = (orderId) => {
    navigate(`/order-detail/${orderId}`); 
  };


  const editOrder = (orderId) => {
    console.log(`Editing order with ID: ${orderId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
                <p className="text-2xl font-semibold"> 
                  1,201
                </p>
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
                <p className="text-2xl font-semibold">
                  1,201
                </p>
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
                <p className="text-2xl font-semibold">
                  1,201
                </p>
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
                <p className="text-gray-500 text-base font-medium">
                  Đã hủy
                </p>
                <p className="text-2xl font-semibold"> 
                  1,201
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white m-6 rounded-lg shadow">
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
              {/* <button
                onClick={() => {}}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none"
              >
                Filter
              </button> */}
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
                <th className="text-left p-4">Chi nhánh</th> 
                <th className="text-left p-4">Tên dịch vụ</th>
                <th className="text-left p-4">Ngày</th>
                <th className="text-left p-4">Khách hàng</th>
                <th className="text-left p-4">Tổng tiền</th>
                <th className="text-left p-4">Trạng thái</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{order.branch}</td> 
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={order.avatar}
                        alt=""
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/path/to/default/avatar.png";
                        }}
                      />
                      <span className="break-words max-w-xs">{order.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{order.date}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4">{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Đang xử lý"
                          ? "bg-orange-100 text-orange-600"
                          : order.status === "Chờ xác nhận"
                          ? "bg-blue-100 text-blue-600"
                          : order.status === "Hoàn thành"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Đã hủy"
                          ? "bg-red-100 text-red-600"
                          : ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center relative">
                    <div className="flex items-center justify-start">
                      <button
                        onClick={() => toggleActions(order.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      {showActions === order.id && (
                        <div className="absolute left-0 top-12 flex flex-col items-start bg-white p-3 shadow-md border rounded z-10">
                          <button
                            className="flex items-center text-gray-600 hover:text-blue-500 mb-2"
                            onClick={() => viewOrder(order.id)}
                          >
                            <FontAwesomeIcon icon={faEye} className="text-xl text-[#002278] mr-2" />
                            View Detail
                          </button>
                          <button
                            className="flex items-center text-gray-600 hover:text-green-500"
                            onClick={() => editOrder(order.id)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-xl text-green-500 mr-2" />
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

          {/* Pagination */}
          <div className="p-4 border-t flex justify-between items-center">
            <span className="text-gray-600">Hiển thị 1-10 của 100</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    page === 1
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
