import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getData } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Alert, Pagination, Spin } from "antd";

const ServiceCard = ({ item, navigate }) => (
  <div className="bg-white rounded-lg shadow-md p-4 relative transition-transform transform hover:scale-105 border border-[#a4a4a4]">
    <div className="mb-2 h-40 bg-gray-200 rounded-md flex items-center justify-center">
      <img
        src={item?.assetUrls && item?.assetUrls[0]?.url}
        className="text-gray-400 h-40 w-full object-cover"
        alt={item.name}
      />
    </div>
    {item?.promotion?.newPrice && (
      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
        -{item?.promotion?.saleOff}%
      </div>
    )}
    <h3 className="font-semibold mb-1 mt-3 truncate">{item.name}</h3>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{item.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
    </div>
    {item.promotion && item.promotion.newPrice ? (
      <>
        <div className="text-gray-500 line-through text-sm">
          {item.price.toLocaleString()}đ
        </div>
        <div className="text-red-500 font-bold">
          {item.promotion.newPrice.toLocaleString()}đ
        </div>
      </>
    ) : (
      <>
        <div className="h-[24px]"></div>
        <div className="text-red-500 font-bold">
          {item.price.toLocaleString()}đ
        </div>
      </>
    )}
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/servicedetail/${item.id}`);
      }}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Đặt Ngay
    </button>
  </div>
);

export default function ServiceGrid({ name, api }) {
  const [services, setServices] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const pageSize = 12; // Cố định số lượng sản phẩm mỗi lần gọi API

  // Hàm fetch dữ liệu
  const fetchServices = (page) => {
    setLoading(true);
    getData(`/${api}?PageIndex=${page}&PageSize=${pageSize}`)
      .then((data) => {
        const items = data?.data?.data?.items || [];
        const pages = data?.data?.data?.totalPages || 0; // Lấy số lượng trang từ API
        setServices(items);
        setTotalPages(pages);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Gọi fetchServices mỗi khi pageIndex thay đổi
  useEffect(() => {
    fetchServices(pageIndex);
  }, [pageIndex, api]);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setPageIndex(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 rounded-md shadow-lg p-8 border-[#D9D9D9] border bg-white">
      <h2 className="text-2xl font-bold mb-6">{name}</h2>

      {/* Hiển thị loading và error */}
      {loading ? (
        <div className="text-center my-4">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon className="my-4" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  item={service}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="text-center col-span-full">
                No services found.
              </div>
            )}
          </div>

          {/* Phần phân trang sử dụng Ant Design */}
          <div className="flex justify-center items-center mt-6">
            <Pagination
              current={pageIndex}
              pageSize={pageSize}
              total={totalPages * pageSize} // Sử dụng totalPages từ API
              onChange={handlePageChange}
              showSizeChanger={false} // Không cho phép thay đổi số lượng sản phẩm mỗi trang
              // showTotal={(total) => `Total ${totalPages} pages`}
            />
          </div>
        </>
      )}
    </div>
  );
}