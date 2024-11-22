import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, Menu, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getServiceByBusinessId } from "../../api/service";
import { getServiceByBranchId } from "../../api/branch";
import { FaStar } from "react-icons/fa"; // Thêm import cho FaStar
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate

const ServiceGrid = ({ businessId, branchId }) => {
  const navigate = useNavigate(); // Sử dụng useNavigate
  const [services, setServices] = useState([]); // State để lưu trữ danh sách dịch vụ
  const [selected, setSelected] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let response;
        if (branchId) {
          response = await getServiceByBranchId(branchId, currentPage, pageSize);
        } else {
          response = await getServiceByBusinessId(businessId, currentPage, pageSize);
        }

        // Log để kiểm tra response
        console.log("Response từ API:", response);

        // Kiểm tra cấu trúc data trước khi set
        if (response?.data?.items) {
          // console.log("Số lượng services:", response.data.items.length);
          // console.log("Services data:", response.data.items);
          
          setServices(response.data.items);
          setTotalItems(response.data.totalCount || 0);
        } else {
          console.warn("Không tìm thấy data.items trong response");
          setServices([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setServices([]);
        setTotalItems(0);
      }
    };

    fetchServices();
  }, [businessId, branchId, currentPage, pageSize]);

  const handleFocus = () => {
    setSelected(true);
  };

  const handleBlur = () => {
    setSelected(false);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  // Định nghĩa hàm handleMenuClick trước khi sử dụng
  const handleMenuClick = (e) => {
    console.log("Menu item clicked:", e.key);
    // Thêm logic xử lý khi một mục trong menu được chọn
  };

  // Định nghĩa menu trong ServiceGrid
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Rẻ</Menu.Item>
      <Menu.Item key="2">Trung Bình</Menu.Item>
      <Menu.Item key="3">Cao</Menu.Item>
    </Menu>
  );

  const handleCardClick = (serviceId) => {
    navigate(`/servicedetail/${serviceId}`); // Điều hướng đến trang chi tiết dịch vụ
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center mb-10 bg-white p-4">
        <h2 className="text-lg font-semibold text-center">SẮP XẾP THEO</h2>

        <Button
          className={`mx-3 ${
            selected ? "bg-white border-3 border-[#3A4980] text-white" : ""
          } text-center`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Phổ biến
        </Button>

        <Dropdown overlay={menu} trigger={["click"]}>
          <Button>
            Giá <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 shadow-md">
        {services.map((service) => {
          // console.log('Dữ liệu service:', service);
          return (
            <div
              key={service.id}
              className="bg-white p-2 rounded-lg shadow-md transition-transform transform hover:scale-105 min-h-[350px] relative"
              onClick={() => handleCardClick(service.id)}
            >
              <div className="relative flex-grow overflow-hidden">
                <img
                  src={service.assetUrls[0]?.url} // Cập nhật để lấy hình ảnh từ assetUrls
                  alt={service.name}
                  className="w-full h-50 object-cover rounded"
                />
                <div className="absolute top-1 right-1">
                  {service.promotion && service.promotion.saleOff > 0 && (
                    <div className="bg-red-500 text-white rounded-lg px-2 py-1">
                      <span className="text-sm font-bold">
                        -{service.promotion.saleOff}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-2">{service.name}</h3>
              {service.promotion && service.promotion.newPrice > 0 ? (
                <>
                  <p className="text-[#667085] font-normal line-through">
                    {service.price.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="text-[#3A4980] font-bold text-xl">
                    {service.promotion.newPrice.toLocaleString("vi-VN")}đ
                  </p>
                </>
              ) : (
                <p className="text-[#3A4980] font-bold text-xl">
                  {service.price.toLocaleString("vi-VN")}đ
                </p>
              )}
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 flex">
                  {[...Array(5)].map((_, index) => {
                    const fillPercentage = Math.max(
                      0,
                      Math.min(100, (service.rating - index) * 100)
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
                </span>
                <span className="ml-1 text-xs text-gray-600">
                  ({service.rating})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ServiceGrid;
