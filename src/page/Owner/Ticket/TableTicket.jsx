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
  import { getAllTicket } from "../../../api/ticket";
  
  
//   function formatCurrency(number) {
//     // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
//     if (typeof number === "number") {
//       return number.toLocaleString("vi-VN", {
//         style: "currency",
//         currency: "VND",
//       });
//     }
//   }
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
        render: (status) => (
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              status === "OPENING"
                ? "bg-blue-100 text-blue-600"
                : status === "PROCESSING"
                ? "bg-orange-100 text-orange-600"
                : status === "CLOSED"
                ? "bg-green-100 text-green-600"
                : ""
            }`}
          >
            {status === "OPENING" ? "Đang mở"
             : status === "PROCESSING" ? "Đang xử lý"
             : status === "CLOSED" ? "Đã đóng"
             : status}
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
                const ticketId = record.id;
                console.log("Navigating to ticket:", ticketId);
                navigate(`/owner/ticket/${ticketId}`);
              }}
              excludeDefaultItems={["reject", "accept", "delete", "edit"]}
            />
          </div>
        ),
      },
    ];
  
    const reloadData = async () => {
      table.handleOpenLoading();
      try {
        const response = await getAllTicket({
          pageSize: pagination.pageSize,
          pageNum: pagination.current
        });
  
        setData(response.data);
        setPagination({
          ...pagination,
          total: response.pagination.totalItems
        });
  
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
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
      reloadData();
      if (location.state?.refresh) {
        reloadData();
        navigate(location.pathname, { replace: true });
      }
    }, [location.state]);
  
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
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
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
          onChange={handleTableChange}
          bordered
          className="w-full"
        />
      </div>
    );
  });
  