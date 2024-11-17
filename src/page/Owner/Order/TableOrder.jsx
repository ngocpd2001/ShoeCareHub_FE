import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useModalState } from "../../../hooks/useModalState";
import { Image, Tooltip } from "antd";
import { useNotification } from "../../../Notification/Notification";
import { useNavigate, useLocation } from "react-router-dom";

import ComModal from "../../../Components/ComModal/ComModal";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { getOrderByBusiness, updateOrderStatus } from "../../../api/order";
import { getBusinessById } from "../../../api/businesses";

import checkmark from "../../../assets/images/Icon/checkmark.png";
import shoe from "../../../assets/images/Icon/shoe.png";
import Cart from "../../../assets/images/Icon/checklist.png";
import Cancel from "../../../assets/images/Icon/cancel.png";

function formatCurrency(number) {
  // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
  if (typeof number === "number") {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
}
export const TableOrder = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const table = useTableState();
  const modal = useModalState();
  const modalDetail = useModalState();
  const modalEdit = useModalState();
  const { notificationApi } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    getColumnSearchProps,
    getColumnPriceRangeProps,
    getUniqueValues,
    getColumnFilterProps,
    getColumnApprox,
  } = useColumnFilters();

  const [statistics, setStatistics] = useState({
    pendingAmount: 0,
    processingAmount: 0,
    finishedAmount: 0,
    canceledAmount: 0
  });

  const [businessData, setBusinessData] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const currentTime = new Date().toISOString();
      
      const statusTimeMapping = {
        PENDING: { pendingTime: currentTime },
        APPROVED: { approvedTime: currentTime },
        RECEIVED: { receivedTime: currentTime },
        PROCESSING: { processingTime: currentTime },
        STORAGE: { storageTime: currentTime },
        SHIPPING: { shippingTime: currentTime },
        DELIVERED: { deliveredTime: currentTime },
        FINISHED: { finishedTime: currentTime },
        ABANDONED: { abandonedTime: currentTime }
      };

      const timeUpdate = statusTimeMapping[newStatus] || {};
      
      await updateOrderStatus(orderId, newStatus, timeUpdate);
      
      notificationApi("success", "Thành công", "Đã cập nhật trạng thái đơn hàng");
      reloadData();
    } catch (error) {
      notificationApi("error", "Lỗi", "Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const columns = [
    {
      title: "Chi nhánh",
      dataIndex: "orderDetails",
      key: "branchName",
      width: 200,
      sorter: (a, b) => a.orderDetails[0]?.branch?.name.localeCompare(b.orderDetails[0]?.branch?.name),
      ...getColumnSearchProps("branchName", "Chi nhánh"),
      render: (orderDetails) => orderDetails[0]?.branch?.name || "N/A",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "orderDetails",
      key: "serviceName",
      width: 200,
      sorter: (a, b) => a.orderDetails[0]?.service?.name.localeCompare(b.orderDetails[0]?.service?.name),
      ...getColumnSearchProps("serviceName", "Tên dịch vụ"),
      render: (orderDetails) => (
        <ul>
          {orderDetails.map((detail, index) => (
            <li key={index}>- {detail.service?.name || "N/A"}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createTime",
      key: "createTime",
      width: 150,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      ...getColumnApprox("createTime", "Ngày đặt"),
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      ...getColumnSearchProps(["fullName", "phone"], "Khách hàng"),
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 150,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      ...getColumnPriceRangeProps("totalPrice", "Tổng tiền"),
      render: (text) => formatCurrency(text),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      sorter: (a, b) => a.status.localeCompare(b.status),
      ...getColumnSearchProps("status", "Trạng thái"),
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === "Đang xử lý"
              ? "bg-orange-100 text-orange-600"
              : status === "Đang chờ"
              ? "bg-blue-100 text-blue-600"
              : status === "Hoàn thành"
              ? "bg-green-100 text-green-600"
              : status === "Đã hủy"
              ? "bg-red-100 text-red-600"
              : status === "Lưu trữ"
              ? "bg-gray-100 text-gray-600"
              : status === "Đang giao hàng"
              ? "bg-yellow-100 text-yellow-600"
              : status === "Quá hạn nhận hàng"
              ? "bg-purple-100 text-purple-600"
              : status === "Đã xác nhận"
              ? "bg-teal-100 text-teal-600"
              : status === "Đã nhận"
              ? "bg-indigo-100 text-indigo-600"
              : status === "Đã giao hàng"
              ? "bg-emerald-100 text-emerald-600"
              : ""
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <div className="flex items-center flex-col">
          <ComMenuButonTable
            record={record}
            showModalDetails={() => {
              const orderId = record.id;
              navigate(`/owner/order/${orderId}`);
            }}
            showModalEdit={() => {
              const orderId = record.id;
              navigate(`/owner/order/update/${orderId}`);
            }}
            excludeDefaultItems={["delete", "details"]} 
          />
        </div>
      ),
    },
  ];

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  const getBusinessId = () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return null;
    }
    return JSON.parse(userData)?.businessId;
  };

  const fetchBusinessData = async (businessId) => {
    try {
      const response = await getBusinessById(businessId);
      setBusinessData(response);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin doanh nghiệp:", error);
      notificationApi("error", "Lỗi", "Không thể tải thông tin doanh nghiệp");
    }
  };

  const reloadData = async () => {
    table.handleOpenLoading();
    try {
      const businessId = getBusinessId();
      if (!businessId) {
        notificationApi("error", "Lỗi", "Vui lòng đăng nhập lại để tiếp tục");
        navigate('/login');
        return;
      }

      // Gọi cả 2 API
      const [businessResponse, orderResponse] = await Promise.all([
        getBusinessById(businessId),
        getOrderByBusiness(businessId)
      ]);

      // Set data orders
      setData(orderResponse);

      // Log để kiểm tra
      console.log("Business Response:", businessResponse);

      // Lấy data trực tiếp từ businessResponse
      const businessData = businessResponse; // Bỏ .data vì data đã là object trực tiếp
      
      setStatistics({
        pendingAmount: businessData.pendingAmount || 0,
        processingAmount: businessData.processingAmount || 0,
        finishedAmount: businessData.finishedAmount || 0,
        canceledAmount: businessData.canceledAmount || 0
      });

      // Log statistics sau khi set
      console.log("Business Data:", businessData);
      console.log("Statistics đã set:", {
        pendingAmount: businessData.pendingAmount,
        processingAmount: businessData.processingAmount,
        finishedAmount: businessData.finishedAmount,
        canceledAmount: businessData.canceledAmount
      });

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu");
      setData([]);
    } finally {
      table.handleCloseLoading();
    }
  };

  useEffect(() => {
    if (location.state?.refresh) {
      reloadData();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      reloadData();
    }
  }, [location.state, navigate]);
  return (
    <div>
      <div className="bg-white p-4 shadow-sm mb-4">
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full flex items-center justify-center">
              <img src={checkmark} alt="Success" className="w-8 h-8" style={{ filter: "invert(100%)" }} />
            </div>
            <div className="flex flex-col justify-center items-center w-[80%]">
              <p className="text-gray-500 text-base font-medium">Chờ xác nhận</p>
              <p className="text-2xl font-semibold">{statistics.pendingAmount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full flex items-center justify-center">
              <img src={shoe} alt="Shoe" className="w-8 h-7" style={{ filter: "invert(100%)" }} />
            </div>
            <div className="flex flex-col justify-center items-center w-[80%]">
              <p className="text-gray-500 text-base font-medium">Đang xử lý</p>
              <p className="text-2xl font-semibold">{statistics.processingAmount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
              <img src={Cart} alt="Cart" className="w-8 h-8" style={{ filter: "invert(100%)" }} />
            </div>
            <div className="flex flex-col justify-center items-center w-[80%]">
              <p className="text-gray-500 text-base font-medium">Hoàn thành</p>
              <p className="text-2xl font-semibold">{statistics.finishedAmount}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" 
                 style={{ background: "linear-gradient(to bottom, #f54b64, #f78361)" }}>
              <img src={Cancel} alt="Cancel" className="w-8 h-8" style={{ filter: "invert(100%)" }} />
            </div>
            <div className="flex flex-col justify-center items-center w-[80%]">
              <p className="text-gray-500 text-base font-medium">Đã hủy</p>
              <p className="text-2xl font-semibold">{statistics.canceledAmount}</p>
            </div>
          </div>
        </div>
      </div>

      <ComTable
        y={"50vh"}
        x={1020}
        columns={columns}
        dataSource={data}
        loading={table.loading}
        rowKey="id"
        bordered
        className="w-full"
      />
    </div>
  );
});