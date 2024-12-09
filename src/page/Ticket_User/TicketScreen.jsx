import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faSort, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { getCategoryTicket, getAllTicket, cancelTicket, getTicketById } from "../../api/ticket";
import { useNavigate } from 'react-router-dom';
import TicketDetailModal from "./TicketDetailModal";
import GuideModal from './GuideModal';

const TicketScreen = () => {
  const [categories, setCategories] = useState([]);
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showEmptyDropdown, setShowEmptyDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isDescending, setIsDescending] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [showGuide, setShowGuide] = useState(false);

  const statusOptions = [
    { value: '', label: 'Trạng thái' },
    { value: 'OPENING', label: 'Đang chờ' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'CLOSED', label: 'Đã đóng' },
    { value: 'CANCELED', label: 'Đã hủy' },
    { value: 'RESOLVING', label: 'Xử lý lại dịch vụ' }
  ];

  useEffect(() => {
    fetchCategories();
    fetchTickets();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategoryTicket();
      const availableCategories = response.data.filter(
        category => category.status !== 'UNAVAILABLE'
      );
      setCategories(availableCategories);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách category:", error);
    }
  };

  const fetchTickets = async (status = '', isDesc = false, search = '', page = 1) => {
    try {
      setLoading(true);
      const response = await getAllTicket(
        page,
        pageSize,
        isDesc,
        search,
        status
      );
      
      if (response.tickets) {
        setTickets(response.tickets);
        setIsDescending(isDesc);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setCurrentPage(response.pagination.currentPage);
        }
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
    setTicketToCancel(id);
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelTicket(ticketToCancel);
      setShowCancelConfirm(false);
      setTicketToCancel(null);
      fetchTickets(selectedStatus, isDescending, searchKey, currentPage);
    } catch (error) {
      console.error("Lỗi khi hủy ticket:", error);
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    fetchTickets(newStatus, isDescending, searchKey, 1);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchKey(value);
    
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    window.searchTimeout = setTimeout(() => {
      fetchTickets(selectedStatus, isDescending, value, 1);
    }, 500);
  };

  const handleViewTicket = (id) => {
    setSelectedTicketId(id);
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
        <td className="py-3 px-4 max-w-[200px]">
          <div className="break-words">
            {ticket.title}
          </div>
        </td>
        <td className="py-3 px-4">{ticket.fullName}</td>
        <td className="py-3 px-4">{ticket.categoryName}</td>
        <td className="py-3 px-4 whitespace-nowrap">
          <span className={`px-2 py-1 rounded-full text-sm ${
            ticket.status === 'OPENING' ? 'bg-blue-100 text-blue-600' :
            ticket.status === 'PROCESSING' ? 'bg-orange-100 text-orange-600' :
            ticket.status === 'CLOSED' ? 'bg-green-100 text-green-600' :
            ticket.status === 'CANCELED' ? 'bg-red-100 text-red-600' :
            ticket.status === 'RESOLVING' ? 'bg-yellow-100 text-yellow-600' :
            'bg-gray-100 text-gray-800'
          }`}>
            {ticket.status === 'OPENING' ? 'Đang chờ' :
             ticket.status === 'PROCESSING' ? 'Đang xử lý' :
             ticket.status === 'CLOSED' ? 'Đã đóng' :
             ticket.status === 'CANCELED' ? 'Đã hủy' :
             ticket.status === 'RESOLVING' ? 'Xử lý lại dịch vụ' :
             ticket.status}
          </span>
        </td>
        <td className="py-3 px-4">{new Date(ticket.createTime).toLocaleDateString('vi-VN')}</td>
        <td className="py-3 px-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleViewTicket(ticket.id)}
              className="px-3 py-1.5 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
            >
              Xem
            </button>
            {ticket.status === 'OPENING' && (
              <button
                onClick={() => handleCancelTicket(ticket.id)}
                className="px-3 py-1.5 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
              >
                Hủy
              </button>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  const handlePageChange = (page) => {
    fetchTickets(selectedStatus, isDescending, searchKey, page);
  };

  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-[#002278] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded mx-1 ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Trước
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 mx-1 rounded bg-white text-gray-700 hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 2 && <span className="mx-2">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 mx-1 rounded bg-white text-gray-700 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded mx-1 ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      {/* Header */}
      <div className="bg-[#002278] text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-xl font-semibold">Danh sách khiếu nại</h1>
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-all"
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
          <span>Hướng dẫn</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-lg shadow-sm p-4">
        {/* Controls Row */}
        <div className="flex justify-between items-center mb-6">
          {/* Status Filter */}
          <div className="relative">
            <select 
              className="appearance-none border rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#002278] text-gray-700 min-w-[180px]"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">Trạng thái</option>
              <option value="OPENING">Đang chờ</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="CANCELED">Đã hủy</option>
              <option value="RESOLVING">Xử lý lại dịch vụ</option>
            </select>
            <FontAwesomeIcon
              icon={faSort}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Search and Create Button */}
          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchKey}
                onChange={handleSearch}
                placeholder="Tìm kiếm khiếu nại"
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
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3 px-4 text-gray-600">Mã KN</th>
              <th className="py-3 px-4 text-gray-600">Tiêu đề</th>
              <th className="py-3 px-4 text-gray-600">Người gửi</th>
              <th className="py-3 px-4 text-gray-600">Dịch vụ</th>
              <th className="py-3 px-4 text-gray-600">
                Trạng thái
              </th>
              <th className="py-3 px-4 text-gray-600">
                Cập nhật
              </th>
              <th className="py-3 px-4 text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>

        {!loading && tickets.length > 0 && <Pagination />}
      </div>

      {/* Thêm popup xác nhận hủy */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden text-center p-6">
            {/* Icon */}
            <div className="w-16 h-16 bg-[#002278] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold mb-2">Xác nhận hủy</h3>
            
            {/* Content */}
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy khiếu nại này không?
            </p>
            
            {/* Buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setTicketToCancel(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium min-w-[120px]"
              >
                Không
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 bg-[#002278] text-white rounded hover:bg-[#001c5f] font-medium min-w-[120px]"
              >
                Có
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTicketId && (
        <TicketDetailModal 
          ticketId={selectedTicketId} 
          onClose={() => setSelectedTicketId(null)} 
        />
      )}

      {/* Add Guide Modal */}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};

export default TicketScreen;
