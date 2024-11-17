import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useNotification } from "../../../Notification/Notification";
import { useNavigate, useLocation } from "react-router-dom";

import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { getTicketByBranch } from "../../../api/ticket";

export const getStatusDisplay = (status) => {
  switch (status) {
    case "OPENING":
      return {
        text: "Đang mở",
        className: "bg-blue-100 text-blue-600",
      };
    case "PROCESSING":
      return {
        text: "Đang xử lý",
        className: "bg-orange-100 text-orange-600",
      };
    case "CLOSED":
      return {
        text: "Đã đóng",
        className: "bg-green-100 text-green-600",
      };
    case "CANCELED":
      return {
        text: "Đã hủy",
        className: "bg-red-100 text-red-600",
      };
    default:
      return {
        text: status,
        className: "",
      };
  }
};

export const TableTicket_Emp = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const table = useTableState();
  const { notificationApi } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const { getColumnSearchProps } = useColumnFilters();

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps("title", "Tiêu đề"),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150,
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      ...getColumnSearchProps("categoryName", "Danh mục"),
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: "Người tạo",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      ...getColumnSearchProps("fullName", "Người tạo"),
    },
    {
      title: "Người xử lý",
      dataIndex: "moderatorName",
      key: "moderatorName",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createTime",
      key: "createTime",
      width: 150,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const statusInfo = getStatusDisplay(status);
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 50,
      render: (_, record) => (
        <div className="flex items-center flex-col">
          <ComMenuButonTable
            record={record}
            // showModalDetails={() => {
            //   const ticketId = record.id;
            //   navigate(`/employee/ticket/${ticketId}`);
            // }}
            showModalEdit={() => {
              const ticketId = record.id;
              navigate(`/employee/ticket/update/${ticketId}`);
            }}
            excludeDefaultItems={["reject", "accept", "delete", "details"]}
          />
        </div>
      ),
    },
  ];

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    console.log("User from localStorage:", userStr);
    if (userStr) {
      const userData = JSON.parse(userStr);
      console.log("Parsed user data:", userData);
      setUser(userData);
    }
  }, []);

  const reloadData = async (sorter = {}) => {
    if (!user?.branchId) {
      console.log("Không có branchId:", user);
      notificationApi("error", "Lỗi", "Vui lòng đăng nhập lại");
      return;
    }

    table.handleOpenLoading();
    try {
      const params = {
        id: user.branchId,
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        sortField: sorter.field || "",
        isDescending: sorter.order === "descend",
      };

      console.log("Calling API with params:", params);

      const response = await getTicketByBranch(params);
      console.log("API response:", response);

      if (response?.data) {
        console.log("Setting data:", response.data);
        setData(response.data);
        setPagination({
          ...pagination,
          current: response.pagination.currentPage,
          total: response.pagination.totalItems,
          pageSize: response.pagination.pageSize,
        });
      } else {
        console.error("Không có dữ liệu trong response");
        setData([]);
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response || error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu");
      setData([]);
    } finally {
      table.handleCloseLoading();
    }
  };

  useEffect(() => {
    console.log("Data state changed:", data);
  }, [data]);

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  useEffect(() => {
    if (user?.branchId) {
      reloadData();
    }
  }, [user, location.state]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    reloadData(sorter);
  };

  return (
    <div>
      <ComTable
        y={"50vh"}
        x={1020}
        columns={columns}
        dataSource={data}
        loading={table.loading}
        rowKey="id"
        onChange={handleTableChange}
        bordered
        className="w-full"
      />
    </div>
  );
});
