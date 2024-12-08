import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getData } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
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
    <div className=" ">
      <div className="flex items-center justify-between ">
        <h1 className="truncate max-w-[70%]"> {item.businessName}</h1>

        {item.businessRank === 1 && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F8b0fc7da-2f8a-4c28-8e9f-d6ee30aebac9.png?alt=media&token=2f191e70-4da5-4f87-8e28-849ccd40114e"
              className="text-gray-400 h-8 w-8"
              alt={1}
            />
          </div>
        )}
        {item.businessRank === 2 && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F74af8a62-9456-4727-bc5c-8865697d1d26.png?alt=media&token=0eccbf46-8664-45de-b9bc-7c93026ab573"
              className="text-gray-400 h-8 w-8"
              alt={2}
            />
          </div>
        )}
        {item.businessRank === 3 && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2F5a161334-89be-4996-b733-7b37c8a70173.png?alt=media&token=82f15bf0-b238-4bb5-9a69-d94fc77b1d2a"
              className="text-gray-400 h-8 w-8"
              alt={3}
            />
          </div>
        )}
        {(item.businessRank >= 4 && item.businessRank <= 10) && (
          <div className="h-8 w-8 ">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shoecarehub-4dca3.firebasestorage.app/o/images%2Fdd527b36-9abd-4e5e-84bc-d7549b00692b.png?alt=media&token=7701f7f2-4e60-434c-b93e-e881d3fdc0bd"
              className="text-gray-400 h-8 w-8"
              alt={3}
            />
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center  ">
      <span className="text-yellow-400 mr-1">{item.rating || 0}</span>
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
      Chi tiết
    </button>
  </div>
);

export default function ServiceGrid({ name, api }) {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [paginatedServices, setPaginatedServices] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 12; // Số lượng sản phẩm mỗi trang
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate();

  // Hàm fetch dữ liệu
  const fetchServices = () => {
    setLoading(true);
    getData(`/${api}?PageIndex=1&PageSize=99999`) // Lấy tất cả sản phẩm
      .then((data) => {
        const items = data?.data?.data?.items || [];
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
          placeholder="Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full  p-2 border border-gray-300 rounded"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded"
        >
          <option value="">Sắp xếp theo</option>
          <option value="priceAsc">Giá: Thấp đến Cao</option>
          <option value="priceDesc">Giá: Cao đến Thấp</option>
          <option value="rating">Đánh giá</option>
        </select>
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
