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
  import { getTicketByBusiness } from "../../../api/ticket";
  
  export const getStatusDisplay = (status) => {
    switch (status) {
      case "OPENING":
        return {
          text: "Đang mở",
          className: "bg-blue-100 text-blue-600"
        };
      case "PROCESSING":
        return {
          text: "Đang xử lý",
          className: "bg-orange-100 text-orange-600"
        };
      case "CLOSED":
        return {
          text: "Đã đóng",
          className: "bg-green-100 text-green-600"
        };
      default:
        return {
          text: status,
          className: ""
        };
    }
  };
  
  export const TableTicket = forwardRef((props, ref) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0
    });
    const table = useTableState();
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
            <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          );
        },
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
                const ticketId = record.id;
                console.log("Navigating to ticket:", ticketId);
                navigate(`/owner/ticket/${ticketId}`);
              }}
              showModalEdit={() => {
                const ticketId = record.id;
                console.log("Navigating to update ticket:", ticketId);
                navigate(`/owner/ticket/update/${ticketId}`);
              }}
              excludeDefaultItems={["reject", "accept", "delete", "details"]}
            />
          </div>
        ),
      },
    ];
  
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    }, []);
  
    const reloadData = async () => {
      if (!user?.businessId) {
        notificationApi("error", "Lỗi", "Vui lòng đăng nhập lại");
        return;
      }
  
      table.handleOpenLoading();
      try {
        const response = await getTicketByBusiness({
          id: user.businessId,
          pageSize: pagination.pageSize,
          pageNum: pagination.current - 1
        });
  
        if (response.status === "success") {
          setData(response.data);
          setPagination({
            ...pagination,
            current: response.pagination.currentPage,
            total: response.pagination.totalItems,
            pageSize: response.pagination.pageSize
          });
        }
  
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        notificationApi("error", "Lỗi", "Không thể tải dữ liệu");
        setData([]);
      } finally {
        table.handleCloseLoading();
      }
    };
  
    useImperativeHandle(ref, () => ({
      reloadData,
    }));
  
    useEffect(() => {
      if (user?.businessId) {
        reloadData();
      }
    }, [user, location.state]);
  
    const handleTableChange = (pagination, filters, sorter) => {
      setPagination(pagination);
      reloadData();
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
  