import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getData } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Pagination, Spin } from "antd";

const ServiceCard = ({ item, navigate }) => (
  <div className="bg-white rounded-lg shadow-md p-4 relative transition-transform transform hover:scale-105 border border-[#a4a4a4]">
    <div className="mb-2 h-40 bg-gray-200 rounded-md flex items-center justify-center">
      <img
        src={item.imageUrl}
        className="text-gray-400 h-40 w-full object-cover"
        alt={item.name}
      />
    </div>

    <h3 className="font-semibold mb-1 mt-3 truncate">{item.name}</h3>
    <div className="flex items-center mb-1">
      <span className="text-yellow-400 mr-1">{item.rating}</span>
      <Star className="w-4 h-4 fill-current text-yellow-400" />
      <div className="text-end w-full text-sm text-gray-600">
        Có {item.toTalServiceNum} dịch vụ
      </div>
    </div>
    <div className="text-end  text-gray-950">
      Đã làm {item.totalOrder} dịch vụ
    </div>

    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/provider-landingpage/${item.id}`);
      }}
      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Chi tiết
    </button>
  </div>
);

export default function ServiceGrid({ name, api }) {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [paginatedServices, setPaginatedServices] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 8; // Số lượng sản phẩm mỗi trang
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate();

  // Hàm fetch dữ liệu
  const fetchServices = () => {
    setLoading(true);
    getData(`/${api}?Status=ACTIVE&IsDecsending=false&PageSize=99999&PageNum=1`) // Lấy tất cả sản phẩm
      .then((data) => {
        console.log(data?.data?.data);

        const items = data?.data?.data || [];
        setServices(items);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Không thể tải danh sách dịch vụ.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const location = useLocation();

  // Lấy search term từ query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchTerm(search);
  }, [location.search]);

  // Gọi fetchServices khi component được mount
  useEffect(() => {
    fetchServices();
  }, [api]);

  // Hàm xử lý lọc, sắp xếp và phân trang
  useEffect(() => {
    let filtered = [...services];

    // Tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    if (sortOption) {
      if (sortOption === "priceAsc") {
        filtered.sort((a, b) => {
          const priceA =
            a.promotion && a.promotion.newPrice
              ? a.promotion.newPrice
              : a.price;
          const priceB =
            b.promotion && b.promotion.newPrice
              ? b.promotion.newPrice
              : b.price;
          return priceA - priceB;
        });
      } else if (sortOption === "priceDesc") {
        filtered.sort((a, b) => {
          const priceA =
            a.promotion && a.promotion.newPrice
              ? a.promotion.newPrice
              : a.price;
          const priceB =
            b.promotion && b.promotion.newPrice
              ? b.promotion.newPrice
              : b.price;
          return priceB - priceA;
        });
      } else if (sortOption === "rating") {
        filtered.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
      }
    }

    setFilteredServices(filtered);

    // Phân trang
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    if (pageIndex > totalPages) {
      setPageIndex(1);
    }
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);
    setPaginatedServices(paginated);
  }, [services, searchTerm, sortOption, pageIndex]);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (page) => {
    setPageIndex(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 rounded-md shadow-lg border-[#D9D9D9] border bg-white">
      <h2 className="text-2xl font-bold mb-6">{name}</h2>

      {/* Thanh tìm kiếm và sắp xếp */}
      <div className="flex flex-col md:flex-row items-center mb-6 gap-4 px-7">
        <input
          type="text"
          placeholder="Tìm kiếm nhà cung cấp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full  p-2 border border-gray-300 rounded"
        />
        {/* <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded"
        >
          <option value="">Sắp xếp theo</option>
          <option value="priceAsc">Giá: Thấp đến Cao</option>
          <option value="priceDesc">Giá: Cao đến Thấp</option>
          <option value="rating">Đánh giá</option>
        </select> */}
      </div>

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
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  item={service}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="text-center col-span-full">
                Không tìm thấy dịch vụ nào.
              </div>
            )}
          </div>

          {/* Phần phân trang */}
          <div className="flex justify-center items-center mt-6">
            <Pagination
              current={pageIndex}
              pageSize={pageSize}
              total={filteredServices.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
