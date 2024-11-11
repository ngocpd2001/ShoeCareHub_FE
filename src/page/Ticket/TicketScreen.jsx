import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faSort } from "@fortawesome/free-solid-svg-icons";
import { getCategoryTicket, getAllTicket, cancelTicket } from "../../api/ticket";
import { useNavigate } from 'react-router-dom';

const TicketScreen = () => {
  const [categories, setCategories] = useState([]);
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showEmptyDropdown, setShowEmptyDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchTickets();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoryTicket();
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách category:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTicket({
        pageSize: 10,
        pageNum: 1
      });
      
      if (response.tickets) {
        setTickets(response.tickets);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowMainDropdown(false);
      setShowEmptyDropdown(false);
    }
  };

  const handleMainButtonClick = () => {
    setShowMainDropdown(!showMainDropdown);
    setShowEmptyDropdown(false);
  };

  const handleEmptyStateButtonClick = () => {
    setShowEmptyDropdown(!showEmptyDropdown);
    setShowMainDropdown(false);
  };

  const handleSelectCategory = (category) => {
    navigate('/user/create-ticket', { 
      state: { 
        selectedCategory: {
          id: category.id,
          name: category.name
        }
      }
    });
  };

  const handleCancelTicket = async (id) => {
    try {
      await cancelTicket(id);
      // Refresh lại danh sách ticket sau khi hủy
      fetchTickets();
    } catch (error) {
      console.error("Lỗi khi hủy ticket:", error);
    }
  };

  const DropdownMenu = ({ position = "right" }) => (
    <div 
      ref={dropdownRef}
      className={`absolute mt-2 w-56 bg-white rounded-md shadow-lg z-50 border
        ${position === "center" ? "left-1/2 -translate-x-1/2" : "right-0"}`}
    >
      {categories.map((category) => (
        <button
          key={category.id}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {
            handleSelectCategory(category);
            setShowMainDropdown(false);
            setShowEmptyDropdown(false);
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-8 text-gray-500">
            <p>Đang tải dữ liệu...</p>
          </td>
        </tr>
      );
    }

    if (!tickets.length) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-8 text-gray-500">
            <p className="mb-4">Bạn chưa có khiếu nại nào!</p>
            <div className="relative inline-block">
              <button 
                className="text-[#3498db] hover:underline"
                onClick={handleEmptyStateButtonClick}
              >
                Tạo khiếu nại
              </button>
              {showEmptyDropdown && <DropdownMenu position="center" />}
            </div>
          </td>
        </tr>
      );
    }

    return tickets.map((ticket) => (
      <tr key={ticket.id} className="border-b hover:bg-gray-50">
        <td className="py-3 px-4">{ticket.id}</td>
        <td className="py-3 px-4">{ticket.title}</td>
        <td className="py-3 px-4">{ticket.fullName}</td>
        <td className="py-3 px-4">{ticket.categoryName}</td>
        <td className="py-3 px-4">
          <span className={`px-2 py-1 rounded-full text-sm ${
            ticket.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
            ticket.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {ticket.status === 'PROCESSING' ? 'Đang xử lý' :
             ticket.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
          </span>
        </td>
        <td className="py-3 px-4">{new Date(ticket.createTime).toLocaleDateString('vi-VN')}</td>
        <td className="py-3 px-4">
          {ticket.status === 'PENDING' && (
            <button
              onClick={() => handleCancelTicket(ticket.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Hủy
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-6">
      {/* Header */}
      <div className="bg-[#002278] text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-semibold">Danh sách khiếu nại</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-lg shadow-sm p-4 overflow-x-auto">
        {/* Controls Row */}
        <div className="flex justify-between items-center mb-6">
          {/* Status Filter */}
          <div className="relative">
            <select className="appearance-none border rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#002278] text-gray-700">
              <option>Trạng thái</option>
              <option>Đang xử lý</option>
          <option>Hoàn thành</option>
          <option>Đã hủy</option>
            </select>
            <FontAwesomeIcon
              icon={faSort}
              className="absolute right-3 top-3 text-gray-400"
            />
          </div>

          {/* Search and Create Button */}
          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm hỗ trợ"
                className="border rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#002278]"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>

            {/* Create Button */}
            <div className="relative">
              <button 
                className="bg-[#3498db] text-white px-4 py-2 rounded-md hover:bg-[#2980b9] flex items-center gap-2"
                onClick={handleMainButtonClick}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Tạo khiếu nại mới</span>
              </button>
              {showMainDropdown && <DropdownMenu position="right" />}
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 px-4 text-gray-600 whitespace-nowrap w-[8%]">Mã khiếu nại</th>
              <th className="py-3 px-4 text-gray-600 whitespace-nowrap w-[25%]">Tiêu đề</th>
              <th className="py-3 px-4 text-gray-600 whitespace-nowrap w-[15%]">Người gửi</th>
              <th className="py-3 px-4 text-gray-600 whitespace-nowrap w-[22%]">Dịch vụ</th>
              <th className="py-3 px-4 text-gray-600 whitespace-nowrap w-[15%]">Trạng thái</th>
              <th className="py-3 px-4 text-gray-600 whitespace-nowrap w-[15%]">
                Cập nhật lần cuối
                <FontAwesomeIcon icon={faSort} className="ml-2" />
              </th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketScreen;
