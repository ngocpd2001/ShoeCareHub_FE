import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { Button, Dropdown, Menu, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getServiceByBusinessId } from "../../api/service"; // Cập nhật import
import { FaStar } from "react-icons/fa"; // Thêm import cho FaStar
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate

const ServiceGrid = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate
  const [services, setServices] = useState([]); // State để lưu trữ danh sách dịch vụ
  const [selected, setSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const businessId = 1; // Thay đổi giá trị BusinessId theo nhu cầu
        const response = await getServiceByBusinessId(businessId, currentPage, pageSize);
        setServices(response);
      } catch (error) {
        console.error("Lỗi khi gọi API", error);
      }
    };

    fetchServices();
  }, [currentPage]); // Chạy lại khi currentPage thay đổi

  const handleFocus = () => {
    setSelected(true);
  };

  const handleBlur = () => {
    setSelected(false);
  };

  const totalPages = Math.ceil(services.length / pageSize);

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
      <div className="flex flex-row items-center mb-4 bg-white p-4">
        <h2 className="text-lg font-semibold text-center">SẮP XẾP THEO</h2>

        <Button
          className={`mx-3 ${selected ? "bg-white border-3 border-[#3A4980] text-white" : ""} text-center`}
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
        {services.map((service) => (
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
                {service.promotion && service.promotion.newPrice && (
                  <div className="bg-red-500 text-white rounded-lg px-2 py-1">
                    <span className="text-sm font-bold">
                      -{Math.round(((service.price - service.promotion.newPrice) / service.price) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-2">{service.name}</h3>
            {service.promotion && service.promotion.newPrice ? (
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
                  const fillPercentage = Math.max(0, Math.min(100, (service.rating - index) * 100));
                  return (
                    <div key={index} className="relative inline-block w-4 h-4" style={{ marginRight: "4px" }}>
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
              <span className="ml-1 text-xs text-gray-600">({service.rating})</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={totalPages * pageSize} // Cập nhật tổng số trang
          pageSize={pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ServiceGrid;
