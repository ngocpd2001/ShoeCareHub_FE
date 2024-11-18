import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import ShopAvatar from "../../assets/images/Provider/shop_avatar.jpg";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { getBusinessById } from "../../api/businesses";
import { getBranchByBusinessId } from "../../api/branch";

const InformationShop = ({ businessId, onBranchSelect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDropdown = async () => {
    setDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && branches.length === 0) {
      try {
        const branchData = await getBranchByBusinessId(businessId);
        console.log("Branch Data:", branchData);
        setBranches(Array.isArray(branchData.data) ? branchData.data : []);
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
        
        const branchData = await getBranchByBusinessId(businessId);
        setBranches(Array.isArray(branchData.data) ? branchData.data : []);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error.errors || error);
      }
    };
    fetchBusiness();
  }, [businessId]);

  const handleBranchClick = (branchId = null) => {
    onBranchSelect(branchId);
    setDropdownOpen(false);
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
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faCircle}
                className={`text-${
                  business.status === "ACTIVE" ? "green" : "red"
                }-500 mr-2 text-sm`}
              />
              <p className="text-sm text-gray-600">
                {business.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động"}
              </p>
            </div>
          </div>
          <div className="flex flex-row">
            <button className="bg-[#1D364D] text-white rounded-lg py-2 px-4 flex items-center mr-3">
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              Chat Ngay
            </button>

            {isProviderLandingPage ? (
              <div className="relative inline-block">
                <button
                  onClick={toggleDropdown}
                  className="border border-[#1D364D] text-[#1D364D] rounded-lg py-2 px-4 ml-3"
                >
                  Chi nhánh
                </button>
                {isDropdownOpen && (
                  <div className="absolute bg-white shadow-lg rounded-lg mt-2 py-2 w-auto z-50">
                    <button
                      onClick={() => handleBranchClick(null)}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-[#1D364D] hover:text-white whitespace-nowrap font-semibold"
                    >
                      Toàn cửa hàng
                    </button>
                    <div className="max-h-60 overflow-y-auto">
                      {branches.map((branch) => (
                        <button
                          key={branch.id}
                          onClick={() => handleBranchClick(branch.id)}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-[#1D364D] hover:text-white whitespace-nowrap"
                        >
                          {branch.name}
                        </button>
                      ))}
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
          <span className="text-lg text-[#002278] font-normal">1</span>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Tham gia</span>
          <span className="text-lg text-[#002278] font-normal">
            {business.createdDate}
          </span>
        </div>
        <div className="flex flex-row justify-between mr-8 my-4">
          <span className="text-lg font-normal">Số lượt sử dụng</span>
          <span className="text-lg text-[#002278] font-normal">
            {business.totalOrder}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InformationShop;
