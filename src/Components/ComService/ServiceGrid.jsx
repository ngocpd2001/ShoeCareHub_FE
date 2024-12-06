import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Menu, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getServiceByBusinessId } from "../../api/service";
import { getServiceByBranchId } from "../../api/branch";
import { getAllCategories } from "../../api/service";
import { FaStar } from "react-icons/fa"; // Thêm import cho FaStar
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate

const ServiceGrid = ({ businessId, branchId, categoryId }) => {
  const navigate = useNavigate(); // Sử dụng useNavigate
  const [services, setServices] = useState([]); // State để lưu trữ danh sách dịch vụ
  const [selected, setSelected] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [categories, setCategories] = useState([]); // State để lưu trữ danh sách danh mục
  const [selectedCategoryName, setSelectedCategoryName] = useState("Danh mục"); // Thêm state để lưu tên danh mục
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let response;
        if (categoryId) {
          response = await getAllCategories(
            categoryId,
            currentPage,
            pageSize
          );
        } else if (branchId) {
          response = await getServiceByBranchId(
            branchId,
            currentPage,
            pageSize
          );

          // Lọc dịch vụ có trạng thái "Hoạt Động" và kiểm tra trạng thái của branchServices
          // const activeBranchServices = response.data.items.filter(service => {
          //   const isServiceActive = service.status === "Hoạt Động";
          //   const hasActiveBranch = service.branchServices.some(branchService => branchService.status === "Hoạt Động");
          //   return isServiceActive && hasActiveBranch;
          // });

          // setServices(activeBranchServices);
          // setTotalItems(activeBranchServices.length);

        } else {
          response = await getServiceByBusinessId(
            businessId,
            currentPage,
            pageSize
          );
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
  }, [businessId, branchId, categoryId, currentPage, pageSize]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories(); // Gọi API để lấy danh mục
        console.log("Danh mục từ API:", response); // Log để kiểm tra dữ liệu trả về

        // Kiểm tra và lấy mảng items từ response
        if (response?.data?.items) {
          setCategories(response.data.items); // Cập nhật state với danh sách danh mục
        } else {
          console.warn("Không tìm thấy items trong response.data");
          setCategories([]); // Đặt categories là mảng rỗng nếu không có dữ liệu
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategories([]); // Đặt categories là mảng rỗng nếu có lỗi
      }
    };

    fetchCategories();
  }, []); // Chỉ gọi một lần khi component được mount

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

  const handleCategorySelect = async (categoryId, pageIndex = 1) => {
    // console.log("Đang chọn danh mục với ID:", categoryId);
    setCurrentPage(pageIndex);

    if (!businessId) {
      console.error("businessId không hợp lệ:", businessId);
      return; // Ngừng thực hiện nếu businessId không hợp lệ  
    }

    try {
      // Gọi API để lấy dịch vụ theo businessId  
      const response = await getServiceByBusinessId(businessId, pageIndex, pageSize);
      console.log("Dữ liệu trả về từ API:", response);

      // Lọc dịch vụ theo categoryId  
      if (response?.data?.items) {
        const filteredServices = response.data.items.filter((service) => {
          const hasValidPrice = service.price && service.price > 0; // Kiểm tra price
          const hasValidNewPrice = service.promotion && service.promotion.newPrice && service.promotion.newPrice > 0; // Kiểm tra newPrice
          // console.log(`Kiểm tra dịch vụ ID: ${service.id}, categoryId: ${service.category.id} với categoryId được chọn: ${categoryId}`);
          return (service.category.id === parseInt(categoryId) && (hasValidPrice || hasValidNewPrice)); // Kiểm tra categoryId và trạng thái
        });
        console.log("Dịch vụ sau khi lọc:", filteredServices);
        setServices(filteredServices);
        setTotalItems(filteredServices.length);
      } else {
        setServices([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dịch vụ theo danh mục:", error);
      setServices([]);
      setTotalItems(0);
    }
  };
  // Định nghĩa menu trong ServiceGrid
  const menu = (
    <Menu onClick={(e) => handleCategorySelect(e.key)}>
      {/* <Menu.Item key="all">Tất cả</Menu.Item> */}
      {categories && categories.length > 0 ? (
        categories
          .filter((category) => category.status === "Hoạt Động" && category.name !== "Khác") // Lọc danh mục có trạng thái "Hoạt Động" và không có tên là "Khác"
          .map((category) => (
            <Menu.Item key={category.id}>{category.name}</Menu.Item>
          ))
      ) : (
        <Menu.Item disabled>Không có danh mục</Menu.Item>
      )}
    </Menu>
  );

  const handleCardClick = (serviceId) => {
    navigate(`/servicedetail/${serviceId}`); // Điều hướng đến trang chi tiết dịch vụ
  };

  console.log("Danh sách danh mục:", categories); // Thêm log đ kiểm tra state categories

  const handlePriceSort = (order) => {
    const sortedServices = [...services].sort((a, b) => {
        const aPrice = a.promotion && a.promotion.newPrice > 0 ? a.promotion.newPrice : a.price;
        const bPrice = b.promotion && b.promotion.newPrice > 0 ? b.promotion.newPrice : b.price;

        if (order === "high") {
            return bPrice - aPrice; // Sắp xếp từ cao đến thấp
        } else {
            return aPrice - bPrice; // Sắp xếp từ thấp đến cao
        }
    });
    setServices(sortedServices); // Cập nhật danh sách dịch vụ đã sắp xếp
  };

  // Định nghĩa menu cho giá
  const priceMenu = (
    <Menu className="w-full" style={{ minWidth: '0' }}>
      <Menu.Item key="high" onClick={() => handlePriceSort("high")}>
        Cao
      </Menu.Item>
      <Menu.Item key="low" onClick={() => handlePriceSort("low")}>
        Thấp
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center mb-10 bg-white p-4">
        <h2 className="text-lg font-semibold text-center">SẮP XẾP THEO</h2>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            className={`mx-3 ${selected ? "bg-[#3A4980] text-white" : "bg-white text-[#3A4980]"
              } text-center border border-[#3A4980] rounded-md`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {selectedCategoryName} <DownOutlined />
          </Button>
        </Dropdown>

        <Button className="bg-white text-[#3A4980] border border-[#3A4980] rounded-md ml-2">
          <Dropdown overlay={priceMenu} trigger={["click"]}>
            <span className="flex items-center">
              Giá <DownOutlined />
            </span>
          </Dropdown>
        </Button>

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
                  src={service.assetUrls && service.assetUrls.length > 0 ? service.assetUrls[0].url : 'default-image-url'} // Cập nhật để kiểm tra assetUrls
                  alt={service.name}
                  className="w-full h-50 object-cover rounded"
                />
                <div className="absolute top-1 right-1">
                  {service.promotion &&
                    service.promotion.status === "Hoạt Động" &&
                    service.promotion.saleOff > 0 && (
                      <div className="bg-red-500 text-white rounded-lg px-2 py-1">
                        <span className="text-sm font-bold">
                          -{service.promotion.saleOff}%
                        </span>
                      </div>
                    )}
                </div>
              </div>
              <h3 className="text-lg font-semibold mt-2">{service.name}</h3>
              {service.promotion &&
                service.promotion.status === "Hoạt Động" &&
                service.promotion.newPrice > 0 ? (
                <>
                  <p className="text-[#667085] font-normal line-through">
                    {service.price ? service.price.toLocaleString("vi-VN") : 'N/A'}đ
                  </p>
                  <p className="text-[#3A4980] font-bold text-xl">
                    {service.promotion.newPrice ? service.promotion.newPrice.toLocaleString("vi-VN") : 'N/A'}đ
                  </p>
                </>
              ) : (
                <p className="text-[#3A4980] font-bold text-xl">
                  {service.price ? service.price.toLocaleString("vi-VN") : 'N/A'}đ
                </p>
              )}
              {service.rating > 0 && (
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
              )}
            </div>
          );
        })}
      </div>

      {totalItems > pageSize && (
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default ServiceGrid;
