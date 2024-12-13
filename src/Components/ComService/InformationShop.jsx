import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import ShopAvatar from "../../assets/images/Provider/shop_avatar.jpg";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { getBusinessById } from "../../api/businesses";
import { getBranchByBusinessId } from "../../api/branch";
import { getServiceByBusinessId } from "../../api/service";
import { Drawer } from 'antd';
import ChatUser from '../../page/ChatUser/ChatUser';
import { createRoom, getRooms } from '../../api/chat';

const InformationShop = ({ businessId, onBranchSelect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [servicesCount, setServicesCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setChatOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const toggleDropdown = async () => {
    setDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && branches.length === 0) {
      try {
        const branchData = await getBranchByBusinessId(businessId);
        console.log("Branch Data:", branchData);
        const activeBranches = Array.isArray(branchData.data)
          ? branchData.data.filter(branch => branch.status !== "INACTIVE")
          : [];
        setBranches(activeBranches);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chi nhánh:", error.errors || error);
      }
    }
  };
  const isProviderLandingPage = location.pathname.startsWith("/provider-landingpage");

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!businessId) {
          console.error("ID không hợp lệ: ID không được tìm thấy trong URL");
          return;
        }
        const businessData = await getBusinessById(businessId);
        setBusiness(businessData);

        // Lưu trữ thông tin name và imageUrl
        // const businessName = businessData.data.name;
        // const businessImageUrl = businessData.data.imageUrl;

        const branchData = await getBranchByBusinessId(businessId);
        const activeBranches = Array.isArray(branchData.data)
          ? branchData.data.filter(branch => branch.status !== "INACTIVE")
          : [];
        setBranches(activeBranches);

        const serviceData = await getServiceByBusinessId(businessId);
        setServicesCount(serviceData.data.totalCount);

        // Cập nhật selectedRoom với thông tin name và imageUrl
        // setSelectedRoom(prevRoom => ({
        //   ...prevRoom,
        //   name: businessName,
        //   imageUrl: businessImageUrl
        // }));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error.errors || error);
      }
    };
    fetchBusiness();
  }, [businessId]);

  const handleBranchClick = (branchId = null) => {
    const selected = branchId ? branches.find(b => b.id === branchId) : null;
    setSelectedBranch(selected);
    onBranchSelect(branchId);
    setDropdownOpen(false);
  };

  const toggleChatDrawer = () => {
    setChatOpen(!isChatOpen);
  };

  const handleChatClick = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            console.error("Không tìm thấy thông tin người dùng trong localStorage");
            return;
        }
        const accountId1 = user.id;
        const accountId2 = business.ownerId;

        const roomsResponse = await getRooms(accountId1);
        if (roomsResponse.status !== "success") {
            console.error("Lỗi khi lấy danh sách phòng:", roomsResponse.message);
            return;
        }
        
        const rooms = roomsResponse.data;
        const existingRoom = rooms.find(room =>
            (room.accountId1 === accountId1 && room.accountId2 === accountId2) ||
            (room.accountId1 === accountId2 && room.accountId2 === accountId1)
        );

        if (existingRoom) {
            setSelectedRoom({
                ...existingRoom,
                name: business.name,
                imageUrl: business.imageUrl
            });
        } else {
            const newRoom = await createRoom(accountId1, accountId2);
            console.log("New Room Response:", newRoom);
            if (newRoom.status !== "success") {
                console.error("Lỗi khi tạo phòng chat:", newRoom.message);
                return;
            }
            setSelectedRoom({
                ...newRoom,
                name: business.name,
                imageUrl: business.imageUrl
            });
        }

        toggleChatDrawer();
    } catch (error) {
        console.error("Lỗi khi kiểm tra hoặc tạo phòng chat:", error);
    }
};

  if (!business) {
    return <div>Đang tải thông tin doanh nghiệp...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-5 items-center flex flex-row space-x-6">
      <div className="ml-4 flex flex-row items-center border-r-2 pr-4">
        <img
          src={business.imageUrl || ShopAvatar}
          alt={business.name}
          className="rounded-full w-25 h-25 mr-4"
        />
        <div className="flex flex-col">
          <div className="flex-1 flex-col mb-3">
            <h2 className="text-xl font-semibold text-[#1D364D]">
              {business.name}
            </h2>
            <p className="text-base text-gray-600">
              {business.phone ? `Điện thoại: ${business.phone}` : "Chưa có số điện thoại"}
            </p>
          </div>
          <div className="flex flex-row">
            <button
              onClick={handleChatClick}
              className="bg-[#1D364D] text-white rounded-lg py-2 px-4 flex items-center mr-3"
            >
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              Chat Ngay
            </button>

            {isProviderLandingPage && branches.length > 0 ? (
              <div className="relative inline-block">
                <button
                  onClick={toggleDropdown}
                  className="border border-[#1D364D] text-[#1D364D] rounded-lg py-2 px-4 ml-3 hover:bg-gray-50 flex items-center"
                >
                  <span>{selectedBranch ? selectedBranch.name : 'Toàn cửa hàng'}</span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-[400px] rounded-lg bg-white shadow-lg border border-gray-100 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleBranchClick(null)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1D364D]">Toàn cửa hàng</span>
                          {business?.address && (
                            <div className="flex mt-1 text-sm text-gray-500">
                              <svg
                                className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              <span className="whitespace-normal break-words">
                                {`${business.address}, ${business.ward}, ${business.district}, ${business.province}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>

                      <div className="max-h-64 overflow-y-auto">
                        {branches.map((branch) => (
                          <button
                            key={branch.id}
                            onClick={() => handleBranchClick(branch.id)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-[#1D364D]">
                                {branch.name}
                              </span>
                              <div className="flex mt-1 text-sm text-gray-500">
                                <svg
                                  className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                </svg>
                                <span className="whitespace-normal break-words">
                                  {`${branch.address}, ${branch.ward}, ${branch.district}, ${branch.province}`}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate(`/provider-landingpage/${business.id}`, { state: { businessId: business.id } })}
                className="border border-[#1D364D] text-[#1D364D] rounded-lg py-2 px-4 ml-3"
              >
                Xem Shop
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Đánh giá</span>
          <span className="text-lg text-[#002278] font-normal flex items-center">
            <span className="text-xl">{`${business.rating}`}</span>
            <div className="flex ml-2">
              {[...Array(5)].map((_, index) => {
                const fillPercentage = Math.max(
                  0,
                  Math.min(100, (business.rating - index) * 100)
                );
                return (
                  <div
                    key={index}
                    className="relative inline-block w-4 h-4"
                    style={{ marginRight: "4px" }}
                  >
                    <FaStar
                      style={{
                        position: "absolute",
                        color: "gold",
                        width: "1em",
                        height: "1em",
                        zIndex: 1,
                        stroke: "gold",
                        strokeWidth: "30px",
                      }}
                    />
                    <FaStar
                      style={{
                        position: "absolute",
                        color: "white",
                        clipPath: `inset(0 0 0 ${fillPercentage}%)`,
                        width: "1em",
                        height: "1em",
                        zIndex: 2,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </span>
        </div>
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Dịch vụ</span>
          <span className="text-lg text-[#002278] font-normal">{servicesCount}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Tham gia</span>
          <span className="text-lg text-[#002278] font-normal">
            {new Date(business.createdDate).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Số lượt sử dụng</span>
          <span className="text-lg text-[#002278] font-normal">
            {business.totalOrder}
          </span>
        </div>
      </div>
      <Drawer
        title="Chat"
        placement="right"
        onClose={toggleChatDrawer}
        open={isChatOpen}
        width={500}
      >
        <ChatUser selectedRoom={selectedRoom} />
      </Drawer>
    </div>
  );
};

export default InformationShop;

