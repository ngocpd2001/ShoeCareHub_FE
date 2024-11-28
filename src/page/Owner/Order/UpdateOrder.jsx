import React, { useEffect, useState } from "react";
import { Truck, MapPin } from "lucide-react";
import ComButton from "../../../Components/ComButton/ComButton";
import { Breadcrumb, Popconfirm, Image, Dropdown, Menu } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faStore,
  faFile,
  faCopy,
  faTruck,
  faInfoCircle,
  faShoppingCart,
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faPlus,
  faFileLines,
  faHourglassHalf,
  faCheck,
  faInbox,
  faCog,
  faWarehouse,
  faBoxOpen,
  faTimesCircle,
  faCheckCircle,
  faEllipsisVertical,
  faPenNib,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  getOrderById,
  updateOrder,
  updateOrderStatus,
  updateShipCode,
  updateOrderDetail,
  deleteOrderDetail,
} from "../../../api/order";
import { getAddressById } from "../../../api/address";
import CreateOrderDetailPopup from "./ServiceModal";
import { useNotification } from "../../../Notification/Notification";
import { message, Modal } from "antd";

const STATUS_TO_ENUM = {
  "Đang chờ": "PENDING",
  "Đã hủy": "CANCELED",
  "Đã xác nhận": "APPROVED",
  "Đã nhận": "RECEIVED",
  "Đang xử lý": "PROCESSING",
  "Lưu trữ": "STORAGE",
  "Đang giao hàng": "SHIPPING",
  "Đã giao hàng": "DELIVERED",
  "Hoàn thành": "FINISHED",
  "Quá hạn nhận hàng": "ABANDONED",
};

const ENUM_TO_STATUS = {
  PENDING: "Đang chờ",
  CANCELED: "Đã hủy",
  APPROVED: "Đã xác nhận",
  RECEIVED: "Đã nhận",
  PROCESSING: "Đang xử lý",
  STORAGE: "Lưu trữ",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  FINISHED: "Hoàn thành",
  ABANDONED: "Quá hạn nhận hàng",
};

const getAvailableStatuses = (currentStatus) => {
  if (!currentStatus) return [];

  const statusEnum = STATUS_TO_ENUM[currentStatus] || currentStatus;

  switch (statusEnum) {
    case "PENDING":
      return [
        { value: "Đã xác nhận", className: "bg-green-50 text-green-700" },
        { value: "Đã hủy", className: "bg-red-50 text-red-700" },
      ];

    case "APPROVED":
      return [{ value: "Đã nhận", className: "bg-green-50 text-green-700" }];

    case "RECEIVED":
      return [
        { value: "Đang xử lý", className: "bg-orange-50 text-orange-700" },
      ];

    case "PROCESSING":
      return [
        { value: "Đang giao hàng", className: "bg-yellow-50 text-yellow-700" },
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
        { value: "Quá hạn nhận hàng", className: "bg-red-50 text-red-700" },
      ];

    case "STORAGE":
      return [];
    case "SHIPPING":
      return [
        { value: "Đã giao hàng", className: "bg-green-50 text-green-700" },
      ];

    case "DELIVERED":
      return [{ value: "Hoàn thành", className: "bg-green-50 text-green-700" }];

    case "ABANDONED":
      return [{ value: "Lưu trữ", className: "bg-gray-50 text-gray-700" }];

    case "FINISHED":
      return [];

    case "CANCELED":
      return [];

    default:
      return [];
  }
};

// Thêm hàm kiểm tra thời gian
const checkOrderExpiration = (createTime, status) => {
  if (status === "PENDING") {
    const createdDate = new Date(createTime);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  }
  return false;
};

const UpdateOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [shippingCode, setShippingCode] = useState("");
  const [formData, setFormData] = useState({
    deliveredFee: 0,
    shippingCode: "",
    shippingUnit: "",
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const { notificationApi } = useNotification();
  const [statusHistory, setStatusHistory] = useState([]);
  const [newStatus, setNewStatus] = useState(null);
  const [isShip, setIsShip] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (orderData) {
      setFormData({
        deliveredFee: orderData.deliveredFee || 0,
        shippingCode: orderData.shippingCode || "",
        shippingUnit: orderData.shippingUnit || "",
      });
    }
  }, [orderData]);

  const fetchOrderData = async () => {
    try {
      const data = await getOrderById(id);

      // Kiểm tra đơn hàng hết hạn
      if (checkOrderExpiration(data.createTime, data.status)) {
        // Tự động cập nhật trạng thái thành CANCELED
        await updateOrderStatus(id, "CANCELED");
        // Fetch lại dữ liệu sau khi cập nhật
        const updatedData = await getOrderById(id);
        setOrderData(updatedData);
        const displayStatus = ENUM_TO_STATUS[updatedData.status];
        setOrderStatus(displayStatus || updatedData.status);
        notificationApi(
          "info",
          "Thông báo",
          "Đơn hàng đã tự động hủy do quá 7 ngày không được xác nhận"
        );

        // Cập nhật formData với giá trị từ updatedData
        setFormData({
          deliveredFee: updatedData.deliveredFee || 0,
          shippingCode: updatedData.shippingCode || "",
          shippingUnit: updatedData.shippingUnit || "",
        });

        // Cập nhật isShip
        setIsShip(updatedData.deliveredFee > 0);
      } else {
        // Xác định isShip dựa vào deliveredFee
        const isShipValue = data.deliveredFee > 0;

        setOrderData(data);
        const displayStatus = ENUM_TO_STATUS[data.status];
        setOrderStatus(displayStatus || data.status);

        // Cập nhật formData với giá trị từ API
        setFormData({
          deliveredFee: data.deliveredFee || 0,
          shippingCode: data.shippingCode || "",
          shippingUnit: data.shippingUnit || "",
        });

        // Cập nhật isShip
        setIsShip(isShipValue);
      }

      if (data.addressId) {
        const address = await getAddressById(data.addressId);
        setAddressData(address);
      }

      const history = getStatusHistory(data);
      setStatusHistory(history);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu đơn hàng");
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Lỗi khi sao chép: ", err);
    });
  };

  const handleUpdateOrder = async () => {
    const userStr = localStorage.getItem("user");
    let userRole = "";

    try {
      const user = JSON.parse(userStr);
      userRole = user?.role;

      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn cập nhật thông tin đơn hàng không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        okButtonProps: {
          className: "bg-blue-500 hover:bg-blue-600 text-white",
        },
        async onOk() {
          try {
            const deliveredFee = parseFloat(formData.deliveredFee) || 0;
            const newIsShip = deliveredFee > 0;

            const updatedOrderData = {
              ...orderData,
              isShip: newIsShip,
              deliveredFee: deliveredFee,
              shippingCode: formData.shippingCode,
              shippingUnit: formData.shippingUnit,
              status: orderData.status,
              totalPrice: (orderData.orderPrice || 0) + deliveredFee,
            };

            console.log("Dữ liệu cập nhật:", updatedOrderData); // Thêm log để kiểm tra

            const response = await updateOrder(id, updatedOrderData);

            if (response) {
              await fetchOrderData();
              message.success("Cập nhật đơn hàng thành công!");

              if (userRole === "OWNER") {
                navigate("/owner/order");
              } else if (userRole === "EMPLOYEE") {
                navigate("/employee/order");
              }
            }
          } catch (error) {
            console.error("Chi tiết lỗi:", error);
            if (error.response?.status === 401) {
              message.error(
                "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại!"
              );
            } else {
              message.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
            }
          }
        },
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  };

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
    setNewStatus(null);
  };

  const getStatusHistory = (data) => {
    const savedHistory = localStorage.getItem(`orderHistory_${id}`);
    let history = savedHistory ? JSON.parse(savedHistory) : [];

    if (history.length === 0) {
      history = [
        {
          status: "Đã tạo đơn hàng",
          icon: faFileLines,
          time: data.createTime,
          order: 1,
        },
      ];
    }

    const currentStatus = data.status;
    if (currentStatus) {
      const statusLabel = ENUM_TO_STATUS[currentStatus] || currentStatus;
      const lastStatus = history[history.length - 1];

      if (lastStatus.status !== statusLabel) {
        history.push({
          status: statusLabel,
          icon: getIconForStatus(statusLabel),
          time: data.updatedTime || new Date().toISOString(),
          order: history.length + 1,
        });
      }
    }

    const uniqueHistory = history.reduce((acc, current) => {
      const exists = acc.some((item) => item.status === current.status);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    const sortedHistory = uniqueHistory.sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );
    localStorage.setItem(`orderHistory_${id}`, JSON.stringify(sortedHistory));

    return sortedHistory;
  };

  const getIconForStatus = (status) => {
    const iconMap = {
      PENDING: faHourglassHalf,
      APPROVED: faCheck,
      RECEIVED: faInbox,
      PROCESSING: faCog,
      STORAGE: faWarehouse,
      SHIPPING: faTruck,
      DELIVERED: faBoxOpen,
      FINISHED: faCheckCircle,
      ABANDONED: faTimesCircle,
      CANCELED: faTimesCircle,
      // Map cho text tiếng Việt
      "Đã tạo đơn hàng": faFileLines,
      "Đang chờ": faHourglassHalf,
      "Đã xác nhận": faCheck,
      "Đã nhận": faInbox,
      "Đang xử lý": faCog,
      "Lưu trữ": faWarehouse,
      "Đang giao hàng": faTruck,
      "Đã giao hàng": faBoxOpen,
      "Hoàn thành": faCheckCircle,
      "Quá hạn nhận hàng": faTimesCircle,
      "Đã hủy": faTimesCircle,
    };

    return iconMap[status] || faFileLines;
  };

  const handleStatusChange = async (e) => {
    try {
      const selectedStatus = e.target.value;
      const statusEnum = STATUS_TO_ENUM[selectedStatus];

      if (!statusEnum) {
        notificationApi("error", "Lỗi", "Trạng thái không hợp lệ");
        return;
      }

      setNewStatus(selectedStatus);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      notificationApi(
        "error",
        "Lỗi",
        `Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`
      );
    }
  };

  const confirmStatusChange = async () => {
    try {
      const statusEnum = STATUS_TO_ENUM[newStatus];
      const response = await updateOrderStatus(id, statusEnum);

      if (response) {
        // Cập nhật orderData với status mới
        setOrderData((prev) => ({
          ...prev,
          status: statusEnum,
          updatedTime: new Date().toISOString(), // Thêm thời gian cập nhật mới
        }));

        setOrderStatus(newStatus);

        // Tạo một bản ghi lịch sử mới
        const newHistoryEntry = {
          status: newStatus,
          icon: getIconForStatus(newStatus),
          time: new Date().toISOString(),
          order: statusHistory.length + 1,
        };

        // Cập nhật statusHistory với bản ghi mới
        const updatedHistory = [...statusHistory, newHistoryEntry];
        setStatusHistory(updatedHistory);

        // Lưu vào localStorage
        localStorage.setItem(
          `orderHistory_${id}`,
          JSON.stringify(updatedHistory)
        );

        setNewStatus(null);

        notificationApi(
          "success",
          "Thành công",
          "Đã cập nhật trạng thái đơn hàng"
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      notificationApi(
        "error",
        "Lỗi",
        `Không thể cập nhật trạng thái đơn hàng: ${errorMessage}`
      );
      setNewStatus(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (
      !isShip &&
      (name === "deliveredFee" ||
        name === "shippingCode" ||
        name === "shippingUnit")
    ) {
      notificationApi(
        "error",
        "Lỗi",
        "Không thể cập nhật thông tin vận chuyển khi không chọn giao hàng"
      );
      return;
    }

    if (name === "deliveredFee") {
      // Loại bỏ các ký tự không phải số và số 0 ở đầu
      const numericValue = value.replace(/^0+|[^0-9]/g, "");

      // Nếu chuỗi rỗng thì gán giá trị 0
      const displayValue = numericValue === "" ? "0" : numericValue;

      setFormData((prev) => ({
        ...prev,
        [name]: displayValue,
      }));

      // Cập nhật orderData với giá trị đã parse
      const parsedValue = parseInt(displayValue, 10);
      setOrderData((prev) => ({
        ...prev,
        deliveredFee: parsedValue,
        isShip: parsedValue > 0,
        totalPrice: (prev.orderPrice || 0) + parsedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateShipCode = async () => {
    try {
      const orderId = orderData.id; // Lấy orderId từ orderData
      console.log("Order ID:", orderId); // Console log orderId để kiểm tra
      const shipCode = formData.shippingCode;
      await updateShipCode(orderId, shipCode);
      // Có thể thêm thông báo thành công hoặc cập nhật lại dữ liệu nếu cần
    } catch (error) {
      console.error("Lỗi khi cập nhật mã vận chuyển", error);
    }
  };

  const handleUpdate = async (OrderDetailId) => {
    try {
      const processState = "NEW_STATE";
      const assetUrls = ["url1", "url2"];
      const result = await updateOrderDetail(
        OrderDetailId,
        processState,
        assetUrls
      );
      console.log("Cập nht thành công:", result);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    }
  };

  const handleDelete = async (OrderDetailId) => {
    try {
      const result = await deleteOrderDetail(OrderDetailId);
      console.log("Xóa thành công:", result);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      // Hiển thị thông báo lỗi cụ thể cho người dùng
      const errorMessage = error.response?.data?.message || "Không thể xóa dịch vụ này vì đơn hàng cần ít nhất một dịch vụ!";
      message.error(errorMessage);
    }
  };

  if (!orderData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  const orderDetails = orderData.orderDetails || [];

  const branchId = orderDetails.length > 0 ? orderDetails[0].branch.id : null;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 px-4">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">
            Cập nhật đơn hàng
          </h2>
          <Breadcrumb
            separator=">"
            items={[
              { title: "Cửa hàng" },
              { title: <Link to="/owner/order">Đơn hàng</Link> },
              {
                title: (
                  <span className="text-[#002278]">Cập nhật đơn hàng</span>
                ),
              },
            ]}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdateOrder}
            className="bg-[#002278] hover:bg-blue-900 transition-colors duration-200 text-white px-6 py-2.5 rounded-md font-medium"
          >
            Cập nhật
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Dịch vụ</h2>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                {orderDetails.length} dịch vụ
              </span>
            </div>
            {orderStatus === "Đã nhận" && ( // Thêm điều kiện kiểm tra trạng thái
              <div className="flex items-center space-x-4">
                <button
                  className="bg-[#002278] text-white w-10 h-10 flex items-center justify-center rounded-full"
                  onClick={handleButtonClick}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            )}
          </div>

          {/* Order Items */}
          <table className="w-full mb-6">
            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="text-left py-2">Dịch vụ</th>
                <th className="text-right">Đơn giá</th>
                <th className="text-right">Thành tiền</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((item) => {
                console.log("Order Detail ID:", item.id); // Thêm log để kiểm tra từng orderDetailId
                return (
                  <React.Fragment key={item.id}>
                    <tr className="border-t">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-24 h-24 flex items-center justify-center overflow-hidden mr-3">
                            {item.service.assetUrls &&
                            item.service.assetUrls.length > 0 ? (
                              <Image.PreviewGroup
                                preview={{
                                  onChange: (current, prev) =>
                                    console.log(
                                      `Switched from preview ${prev} to ${current}`
                                    ),
                                }}
                              >
                                <Image
                                  src={item.service.assetUrls[0].url} // Hình ảnh của service
                                  alt={item.service.name}
                                  className="object-cover w-full h-full"
                                  fallback="data:image/png;base64,..."
                                />
                              </Image.PreviewGroup>
                            ) : (
                              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                              </div>
                            )}
                          </div>
                          <span className="break-words">
                            {item.service.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        {item.service.promotion &&
                        item.service.promotion.status === "Hoạt Động"
                          ? item.service.promotion.newPrice.toLocaleString() +
                            "đ"
                          : item.service.price.toLocaleString() + "đ"}
                      </td>
                      <td className="text-right">
                        {item.price.toLocaleString()}đ
                      </td>
                      <td className="text-right pl-3">
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item key="update" onClick={handleUpdate}>
                                <FontAwesomeIcon
                                  icon={faPenNib}
                                  className="text-[#002278]"
                                />{" "}
                                Cập nhật
                              </Menu.Item>
                              <Menu.Item key="delete">
                                <Popconfirm
                                  title="Bạn có chắc chắn muốn xóa dịch vụ này?"
                                  onConfirm={() => handleDelete(item.id)} // Gọi hàm handleDelete khi xác nhận
                                  okText="Đồng ý"
                                  cancelText="Hủy"
                                >
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    className="text-[#002278]"
                                  />{" "}
                                  Xóa
                                </Popconfirm>
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={["click"]}
                        >
                          <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            className="cursor-pointer text-[#002278]"
                          />
                        </Dropdown>
                      </td>
                    </tr>
                    {item.material && (
                      <tr>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-24 h-24 flex items-center justify-center overflow-hidden mr-3">
                              {item.material.assetUrls &&
                              item.material.assetUrls.length > 0 ? (
                                <Image
                                  src={item.material.assetUrls[0].url} // Hình ảnh của material
                                  alt={item.material.name}
                                  className="object-cover w-full h-full"
                                  fallback="data:image/png;base64,..."
                                />
                              ) : (
                                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="break-words">
                              {item.material.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-right">
                          {item.material.price.toLocaleString()}đ
                        </td>
                      </tr>
                    )}
                    {/* Hiển thị ghi chú cho tng dịch vụ */}
                    <tr>
                      <td className="text-gray-600 italic py-4">
                        Ghi chú: {item.note || "Không có ghi chú"}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span>{orderData.orderPrice?.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phí giao hàng</span>
              <span>
                {parseInt(formData.deliveredFee || 0).toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span>{orderData.totalPrice?.toLocaleString()}₫</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 text-xl flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-2">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-800"
                />
              </div>
              Thông tin chung
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-lg mb-2">
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Trạng thái đơn hàng
                </p>
                {newStatus ? (
                  <Popconfirm
                    title="Xác nhận thay đổi trạng thái"
                    description={`Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${newStatus}" không?`}
                    onConfirm={confirmStatusChange}
                    onCancel={handleCancel}
                    okText="Đồng ý"
                    cancelText="Hủy"
                    okButtonProps={{
                      style: { backgroundColor: "#1890ff" },
                    }}
                    open={Boolean(newStatus)}
                  >
                    <select
                      value={newStatus || orderStatus}
                      onChange={handleStatusChange}
                      className="font-medium text-gray-900 w-full p-2 border rounded-md bg-white"
                    >
                      <option value={orderStatus}>
                        {ENUM_TO_STATUS[orderStatus] || orderStatus}
                      </option>
                      {getAvailableStatuses(orderStatus).map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                          className={status.className}
                        >
                          {status.value}
                        </option>
                      ))}
                    </select>
                  </Popconfirm>
                ) : (
                  <select
                    value={orderStatus}
                    onChange={handleStatusChange}
                    className="font-medium text-gray-900 w-full p-2 border rounded-md bg-white"
                  >
                    <option value={orderStatus}>
                      {ENUM_TO_STATUS[orderStatus] || orderStatus}
                    </option>
                    {getAvailableStatuses(orderStatus).map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                        className={status.className}
                      >
                        {status.value}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <p className="text-gray-500 text-lg mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Khách hàng
                </p>
                <p className="font-medium text-gray-900">
                  {orderData.fullName || "Không có thông tin khách hàng"}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </p>
                  {orderData.email && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={() => handleCopy(orderData.email)}
                    />
                  )}
                </div>
                <p className="font-medium text-gray-900 ">
                  {orderData.email || "Không có thông tin email"}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-lg">
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Số điện thoại
                  </p>
                  {orderData.phone && (
                    <FontAwesomeIcon
                      icon={faCopy}
                      className="cursor-pointer"
                      onClick={() => handleCopy(orderData.phone)}
                    />
                  )}
                </div>
                <p className="font-medium text-gray-900">
                  {orderData.phone || "Không có thông tin số điện thoại"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 text-xl">Trạng thái đơn hàng</h3>
            <div className="space-y-4">
              {statusHistory.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <FontAwesomeIcon
                      icon={step.icon}
                      size="lg"
                      style={{ color: "#002278" }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{step.status}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(step.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Address and Shipping Info */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
        {/* Địa ch giao hàng */}
        <div className="flex items-start bg-white rounded-lg shadow p-4">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <h3 className="font-semibold text-blue-600 text-xl">
              Địa chỉ giao hàng
            </h3>
            <p className="text-black mt-3 text-lg">
              <FontAwesomeIcon icon={faHouseUser} className="mr-2" />
              Địa chỉ:
            </p>
            <p className="text-gray-600">
              {addressData
                ? `${addressData.address}, ${addressData.ward}, ${addressData.district}, ${addressData.province}`
                : "Lấy tại cửa hàng"}
            </p>
            <p className="text-black mt-2 text-lg">
              <FontAwesomeIcon icon={faStore} className="mr-2" />
              Chi nhánh:
            </p>
            <p className="text-gray-600">
              {orderDetails.length > 0
                ? orderDetails[0].branch.name
                : "Không có thông tin chi nhánh"}
            </p>
          </div>
        </div>

        {/* Thông tin vận chuyển */}
        <div className="flex items-start bg-white rounded-lg shadow p-4 w-full">
          <Truck className="w-5 h-5 text-blue-600 mr-2" />
          <div className="w-full">
            <h3 className="font-semibold text-blue-600 text-xl">Vận chuyển</h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Hình thức giao hàng
                </label>
                <div className="p-2 bg-gray-50 border rounded text-gray-700">
                  {formData.deliveredFee > 0
                    ? "Giao hàng tận nơi"
                    : "Lấy tại cửa hàng"}
                </div>
              </div>
              {isShip && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phí giao hàng (VNĐ)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="deliveredFee"
                        value={formData.deliveredFee}
                        onChange={handleFormChange}
                        className="w-full p-2 border rounded pr-12"
                        placeholder="0"
                        disabled={!isShip}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        VNĐ
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Mã vận chuyển
                    </label>
                    {formData.shippingCode ? ( // Kiểm tra nếu có shippingCode
                      <span className="text-gray-900">
                        {formData.shippingCode}
                      </span> // Hiển thị mã vận chuyển
                    ) : (
                      <button
                        type="button"
                        onClick={handleUpdateShipCode} // Gọi hàm cập nhật mã vận chuyển
                        className="w-full p-2 border rounded bg-blue-500 text-white"
                      >
                        Tạo mã vận chuyển
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Đơn vị vận chuyển
                    </label>
                    <input
                      type="text"
                      name="shippingUnit"
                      value={formData.shippingUnit}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      disabled={!isShip}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      <CreateOrderDetailPopup
        visible={isPopupVisible}
        onCancel={handleCancel}
        orderId={id}
        branchId={branchId}
        onServiceAdded={fetchOrderData}
      />
    </div>
  );
};

export default UpdateOrder;
