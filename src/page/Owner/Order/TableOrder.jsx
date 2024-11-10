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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const currentTime = new Date().toISOString();
      
      const statusTimeMapping = {
        PENDING: { pendingTime: currentTime },
        APPROVED: { approvedTime: currentTime },
        RECIEVED: { revievedTime: currentTime },
        PROCESSING: { processingTime: currentTime },
        STORAGE: { storagedTime: currentTime },
        SHIPPING: { shippingTime: currentTime },
        DELIVERIED: { deliveredTime: currentTime },
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
              : ""
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 50,
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
            excludeDefaultItems={["reject", "accept", "delete"]} 
            // showModalAccept={async () => {
            //   await handleStatusChange(record.id, "APPROVED");
            // }}
            // showModalReject={async () => {
            //   await handleStatusChange(record.id, "CANCELED");
            // }}
            // excludeDefaultItems={[
            //   "delete",
            //   ...(record.status !== "Đang chờ" ? ["accept", "reject"] : [])
            // ]} 
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

  const reloadData = async () => {
    table.handleOpenLoading();
    try {
      const businessId = getBusinessId();
      if (!businessId) {
        notificationApi("error", "Lỗi", "Vui lòng đăng nhập lại để tiếp tục");
        navigate('/login');
        return;
      }

      const response = await getOrderByBusiness(businessId);
      setData(response);
      
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu đơn hàng");
      setData([]);
    } finally {
      table.handleCloseLoading();
    }
  };

  useEffect(() => {
    reloadData();
    // Kiểm tra nếu có state refresh từ UpdateOrder
    if (location.state?.refresh) {
      reloadData();
      // Reset state để tránh reload không cần thiết
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);
  return (
    <div>
      <ComTable
        y={"50vh"}
        x={1020}
        columns={columns}
        dataSource={data}
        loading={table.loading}
        rowKey="id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          // showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
          locale: {
            jump_to: "Đến",
            page: "Trang",
            items_per_page: "/ trang",
            prev_page: "Trang trước",
            next_page: "Trang sau",
            prev_5: "5 trang trước",
            next_5: "5 trang sau"
          }
        }}
        bordered
        className="w-full"
      />
    </div>
  );
});
