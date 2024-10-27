import React, { useState, useRef, useEffect, useContext, forwardRef } from "react";
import { Search, Menu, ChevronDown, MoreHorizontal } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faFilter } from "@fortawesome/free-solid-svg-icons";
import { faEye, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import "./TableEmployee.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";

const TableEmployee = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const { owner: ownerParam } = useParams();

  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [ownerState, setOwnerState] = useState("defaultOwner");
  const [branch, setBranch] = useState("Tất cả");
  const [showActions, setShowActions] = useState(null);
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [showDialog, setShowDialog] = useState(false);

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3001/employees");
  //       const data = await response.json();
  //       setEmployees(data);
  //     } catch (error) {
  //       console.error("Lỗi khi fetch dữ liệu nhân viên:", error);
  //     }
  //   };

  //   const fetchBranches = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3001/branches");
  //       const data = await response.json();
  //       setBranches(data);
  //     } catch (error) {
  //       console.error("Lỗi khi fetch dữ liệu chi nhánh:", error);
  //     }
  //   };

  //   fetchEmployees();
  //   fetchBranches();
  // }, []);

  useEffect(() => {
    // Dữ liệu mẫu
    const sampleBranches = [
      { id: 1, name: "Chi nhánh A" },
      { id: 2, name: "Chi nhánh B" },
      { id: 3, name: "Chi nhánh C" },
    ];

    const sampleEmployees = [
      {
        id: 1,
        avatar:
          "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "0123456789",
        branch: "Chi nhánh A",
        position: "Nhân viên",
      },
      {
        id: 2,
        avatar:
          "https://mcdn.coolmate.me/image/December2022/cua-hang-ve-sinh-giay_744.jpg",
        name: "Nguyễn Văn B",
        email: "nguyenvanb@gmail.com",
        phone: "0123456789",
        branch: "Chi nhánh B",
        position: "Nhân viên",
      },
    ];

    // Thiết lập dữ liệu mẫu
    setBranches(sampleBranches);
    setEmployees(sampleEmployees);
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

  const filteredOrders = employees.filter((employee) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      employee.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      employee.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      employee.branch.toLowerCase().includes(lowerCaseSearchTerm) ||
      employee.position.toLowerCase().includes(lowerCaseSearchTerm)
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

  // Định nghĩa hàm viewOrder
  const viewOrder = (employeeId) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    navigate(`/owner/employee/${employeeId}`, { state: { employee: selectedEmployee } });
  };

  // Định nghĩa hàm editOrder
  const editOrder = (employeeId) => {
    navigate(`/owner/employee/update/${employeeId}`, { state: { employee: employees.find(emp => emp.id === employeeId) } });
  };

  return (
    <div className="flex h-screen bg-gray-100" ref={ref}>
      <div className="flex-1 overflow-hidden">
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

          <table className="w-full">
            <thead className="bg-[#002278] text-white">
              <tr>
                <th className="text-left p-4">Tên chi nhánh</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Số điện thoại</th>
                <th className="text-left p-4">Chi nhánh</th>
                <th className="text-left p-4">Chức vụ</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt=""
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/path/to/default/avatar.png";
                        }}
                      />
                      <span className="break-words max-w-xs">
                        {employee.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{employee.email}</td>
                  <td className="p-4">{employee.phone}</td>
                  <td className="p-4">{employee.branch}</td>
                  <td className="p-4">{employee.position}</td>
                  <td className="p-4 text-center relative">
                    <div className="flex items-center justify-start">
                      <button
                        onClick={() => toggleActions(employee.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                      {showActions === employee.id && (
                        <div className="absolute left-0 top-12 flex flex-col items-start bg-white p-3 shadow-md border rounded z-10">
                          <button
                            className="flex items-center text-gray-600 hover:text-blue-500 mb-2"
                            onClick={() => viewOrder(employee.id)}
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-xl text-[#002278] mr-2"
                            />
                            View Detail
                          </button>
                          <button
                            className="flex items-center text-gray-600 hover:text-green-500"
                            onClick={() => editOrder(employee.id)}
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

          {/* Pagination */}
          <div className="p-4 border-t flex justify-between items-center">
            <span className="text-gray-600">Hiển thị 1-10 ca 100</span>
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
});

export default TableEmployee;
