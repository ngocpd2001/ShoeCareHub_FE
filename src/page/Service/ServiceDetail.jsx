import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faHeart,
  faCartShopping,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as regularStar,
  faCommentDots,
} from "@fortawesome/free-regular-svg-icons";
import FeedbackService from "../../Components/ComService/FeedbackService";
import InformationShop from "../../Components/ComService/InformationShop";
import ServiceCard from "../../Components/ComService/ServiceCard";
import { getServiceById } from "../../api/service";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { addItemToCart, getUserCart, getCartItemById } from "../../api/cart";
import { Select, message } from "antd";

const ServiceDetail = () => {
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const serviceId = id;
  const [cartItems, setCartItems] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const location = useLocation();
  const [businessId, setBusinessId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // console.log("Business ID:", businessId);

  useEffect(() => {
    if (!serviceId) return;

    const fetchServiceData = async () => {
      try {
        const fetchedService = await getServiceById(serviceId);
        console.log("Fetched service:", fetchedService);
        setService(fetchedService);

        // Lấy businessId từ dữ liệu dịch vụ
        const fetchedBusinessId =
          fetchedService.branchServices[0]?.branch.businessId;
        if (fetchedBusinessId) {
          setBusinessId(fetchedBusinessId);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin dịch vụ:", error);
        setError("Cannot fetch service data!");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       containerRef.current &&
  //       !containerRef.current.contains(event.target)
  //     ) {
  //       setCurrentImageIndex(-1);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    if (
      service &&
      service.branchServices &&
      service.branchServices.length > 0
    ) {
      // Tìm chi nhánh đầu tiên đang hoạt động
      const activeBranch = service.branchServices.find(
        (bs) => bs.status === "Hoạt Động"
      );
      if (activeBranch) {
        setSelectedBranch(activeBranch.branch);
      } else {
        setSelectedBranch(null); // Không có chi nhánh nào hoạt động
      }
    }
  }, [service]);

  if (loading) return <div>Đang tải thông tin dịch vụ...</div>;
  if (error) return <div>{error}</div>;

  const combinedData = service
    ? [
        // Ảnh chính
        {
          img: service.images?.main || "/path/to/default-image.jpg",
          type: "image",
        },
        // Thêm trực tiếp các ảnh từ assetUrls
        ...(service.assetUrls || []).map((asset) => ({
          img: asset.url,
          type: "image",
        })),
      ]
    : [];

  // const nextImage = () => {
  //   setCurrentImageIndex((prevIndex) => (prevIndex + 1) % combinedData.length);
  // };

  // const prevImage = () => {
  //   setCurrentImageIndex(
  //     (prevIndex) => (prevIndex - 1 + combinedData.length) % combinedData.length
  //   );
  // };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const MAX_LENGTH = 200;

  const shortDescription = service.description
    ? service.description.slice(0, MAX_LENGTH)
    : "";
  const isLongDescription = service.description
    ? service.description.length > MAX_LENGTH
    : false;

  const handleAddToCart = async () => {
    if (!service || service.id === 0 || !selectedBranch) {
      console.error("Service not found or branch not selected");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      // navigate("/login");
      return;
    }

    try {
      const itemData = {
        serviceId: Number(service.id),
        branchId: Number(selectedBranch.id),
        quantity: Number(quantity),
      };

      console.log("Add to cart data:", itemData);
      await addItemToCart(user.id, itemData);

      // Hiển thị thông báo thành công
      message.success({
        content: "Đã cập nhật trạng thái đơn hàng",
        duration: 2,
        style: {
          marginTop: "20px",
          fontSize: "16px",
          fontWeight: "normal",
          color: "#52c41a", // Màu chữ
          borderRadius: "4px", // Bo góc
        },
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.setItem("redirectAfterLogin", location.pathname);
        navigate("/login");
      } else {
        message.error({
          content: "Có lỗi xảy ra khi thêm vào giỏ hàng",
          duration: 2,
          style: {
            marginTop: "20px",
            fontSize: "16px",
            fontWeight: "normal",
          },
        });
      }
    }
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
      return;
    }

    // Thêm kiểm tra chi nhánh
    if (!selectedBranch) {
      setUserMessage("Vui lòng chọn chi nhánh đang hoạt động");
      return;
    }

    // Kiểm tra trạng thái chi nhánh
    const selectedBranchService = service.branchServices.find(
      (bs) => bs.branch.id === selectedBranch.id
    );
    if (
      !selectedBranchService ||
      selectedBranchService.status !== "Hoạt Động"
    ) {
      setUserMessage("Vui lòng chọn chi nhánh đang hoạt động");
      return;
    }

    // Tiếp tục xử lý checkout...
    if (service) {
      const checkoutService = {
        ...service,
        quantity: quantity || 1,
        branchId: selectedBranch.id,
        shopName: selectedBranch.name,
        shopAddress: selectedBranch.address,
      };
      navigate("/checkout-service", {
        state: {
          selectedItems: [
            {
              branchId: selectedBranch.id,
              services: [checkoutService],
            },
          ],
        },
      });
    }
  };

  const formatCurrency = (value) => {
    return value ? value.toLocaleString("vi-VN") + "đ" : "N/A";
  };

  const formatRating = (rating) => {
    return rating !== undefined ? rating.toFixed(1) : "N/A";
  };

  const handleBranchChange = (event) => {
    const selectedBranchId = event.target.value;
    const branch = service.branchServices.find(
      (bs) => bs.branch.id === parseInt(selectedBranchId)
    )?.branch;
    setSelectedBranch(branch);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md min-h-[750px]">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 pt-5">
            {/* Left column - Image and thumbnails */}
            <div className="w-full md:w-1/2 p-6" ref={containerRef}>
              {/* Main Image Display */}
              <div className="relative w-full h-[500px] mb-4">
                <img
                  src={
                    service.assetUrls?.[0]?.url || "/path/to/default-image.jpg"
                  }
                  alt="Main preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {/* <div className="relative w-full h-[500px] mb-4">
                <img
                  src={combinedData[currentImageIndex]?.img}
                  alt="Main preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {combinedData.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-2"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-2"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </>
                )}
              </div> */}

              {/* Thumbnails */}
              {/* <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                {combinedData.map((item, index) => (
                  <div
                    key={index}
                    className={`relative min-w-[100px] h-[100px] cursor-pointer ${
                      index === currentImageIndex ? "ring-2 ring-[#3A4980]" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={item.img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div> */}
            </div>

            {/* Right column - Content */}
            <div className="w-full md:w-1/2 p-6 flex flex-col space-y-4">
              {/* Name-icon heart */}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col space-y-2 max-w-[70%]">
                  <h1 className="text-3xl font-bold text-gray-800 break-words">
                    {service.name}
                  </h1>
                  {/* <h2 className="text-lg text-gray-400">
                    Chi nhánh: {service.branchServices[0]?.branch.name}
                  </h2> */}
                </div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-semibold text-[#D46F77] bg-[#EDF0F8] rounded-xl px-4 py-1 shadow-md whitespace-nowrap">
                    {service.orderedNum} Sử dụng
                  </h2>
                  {/* <div className="ml-2 bg-[#FEE2E2] rounded-full h-10 w-10 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-[#D46F77]"
                    />
                  </div> */}
                </div>
              </div>

              {/* Price-rating & feedback */}
              <div className="flex items-center justify-between mt-5 border-t pt-4">
                <div className="flex flex-col items-start">
                  {service.promotion &&
                  service.promotion.status === "Hoạt Động" &&
                  service.promotion.newPrice ? (
                    <>
                      <span className="text-3xl font-bold text-blue-800">
                        {formatCurrency(service.promotion.newPrice)}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {formatCurrency(service.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-[#3A4980] font-bold text-3xl">
                      {formatCurrency(service.price)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-[#F9F6F1] rounded-xl px-4 py-1 shadow-md">
                    <FontAwesomeIcon
                      icon={regularStar}
                      className="text-[#D48D3B]"
                    />
                    <span className="ml-2 text-[#D48D3B]">
                      {formatRating(service.rating)}
                    </span>
                  </div>
                  <span className="bg-[#EDF0F8] text-[#3A4980] font-semibold rounded-xl px-2 py-1">
                    <FontAwesomeIcon icon={faCommentDots} className="pr-2" />
                    {service.feedbackedNum} đánh giá
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 border-t pt-4">
                <h2 className="text-2xl font-semibold">Mô tả dịch vụ</h2>

                <div
                  className={`mt-2 text-gray-600 transition-max-height duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[1000px]"
                      : "max-h-[120px] overflow-hidden"
                  }`}
                >
                  <p>
                    {isExpanded
                      ? service.description
                      : `${shortDescription}${isLongDescription ? "..." : ""}`}
                  </p>
                </div>

                {isLongDescription && (
                  <button
                    onClick={toggleDescription}
                    className="text-blue-500 mt-2"
                  >
                    {isExpanded ? "Ẩn bớt..." : "Xem thêm..."}
                  </button>
                )}

                <div className="mt-4 flex items-center">
                  <span className="text-gray-500 font-semibold mr-2">
                    Trạng thái:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      service.status === "Hoạt Động"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.status === "Hoạt Động"
                      ? "Đang hoạt động"
                      : "Ngưng hoạt động"}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                <h2 className="text-2xl font-semibold mb-4">Chọn chi nhánh</h2>
                <Select
                  value={selectedBranch?.id || ""}
                  onChange={(value) => {
                    const branch = service.branchServices.find(
                      (bs) => bs.branch.id === value
                    )?.branch;
                    setSelectedBranch(branch);
                  }}
                  className="w-full h-12 border-2 border-gray-200 rounded-lg focus:border-[#3A4980] focus:outline-none text-lg text-gray-400"
                  optionLabelProp="label"
                  listItemHeight={10}
                  listHeight={250}
                >
                  {service?.branchServices?.map((bs) => {
                    const branchName =
                      bs.branch.name +
                      (bs.status === "Ngưng Hoạt Động"
                        ? " (Ngưng hoạt động)"
                        : "");
                    const branchAddress = `${bs.branch.address}, ${bs.branch.ward}, ${bs.branch.district}, ${bs.branch.province}`;

                    return (
                      <Select.Option
                        key={bs.branch.id}
                        value={bs.branch.id}
                        disabled={bs.status === "Ngưng Hoạt Động"}
                        label={<span className="text-lg">{branchName}</span>}
                      >
                        <div className="flex flex-col py-2">
                          <span className="text-lg text-[#3A4980]">
                            {branchName}
                          </span>
                          <span className="text-base text-gray-400 break-words whitespace-normal max-w-full">
                            {branchAddress}
                          </span>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>

              {/* Quantity */}
              {/* <div className="flex items-center mt-5 border-t pt-4 space-x-6"></div>
                <span className="text-gray-500 text-xl font-semibold">
                  Số lợng giày:
                </span>
                <div className="flex items-center bg-[#F3F3F3] rounded-full py-3 px-8 text-[#3A4980]">
                  <button
                    onClick={() => handleQuantityChange(service.id, -1)}
                    className="mx-2 pr-6 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(service.id, 1)}
                    className="mx-2 pl-6 text-2xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div> */}

              <div className="flex items-center mt-5 border-t pt-4 space-x-6">
                <span className="text-gray-500 text-xl font-semibold">
                  Số lượng giày:
                </span>
                <div className="flex items-center bg-[#F3F3F3] rounded-full py-3 px-8 text-[#3A4980]">
                  <button
                    onClick={decreaseQuantity}
                    className="mx-2 pr-6 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="mx-2 pl-6 text-2xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Button cart&checkout */}
              <div className="flex justify-center mt-5 border-t pt-8 space-x-10">
                <button
                  onClick={handleAddToCart}
                  disabled={service.status !== "Hoạt Động"}
                  className={`rounded-xl py-4 px-6 flex items-center ${
                    service.status === "Hoạt Động"
                      ? "bg-[#3A4980] text-white hover:bg-[#2d3860] cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FontAwesomeIcon icon={faCartShopping} className="mr-4" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={service.status !== "Hoạt Động"}
                  className={`rounded-xl py-2 px-10 ${
                    service.status === "Hoạt Động"
                      ? "bg-gray-200 text-[#3A4980] hover:bg-gray-300 cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shop information */}
        <div className=" mt-10 shadow-md">
          <InformationShop businessId={businessId} />
        </div>

        {/* FeedbackService */}
        <FeedbackService />

        <div className="p-6 bg-white rounded-lg shadow-md mt-10">
          <h2 className="text-2xl font-semibold text-[#344054]">
            Các dịch vụ khác của cửa hàng
          </h2>
          {/* Related Services */}
          <ServiceCard businessId={businessId} />
          <div className="text-center mt-5">
            {/* <button className="bg-white border-2 border-[#3A4980] text-[#3A4980] font-semibold py-2 px-4 rounded-xl flex items-center justify-center mx-auto transition-colors hover:bg-[#3A4980] hover:text-white">
              Xem thêm
            </button> */}
          </div>
        </div>
      </div>
      {userMessage && <div className="alert alert-success">{userMessage}</div>}
    </div>
  );
};

export default ServiceDetail;
