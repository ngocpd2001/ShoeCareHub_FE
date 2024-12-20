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
  import { getAllTicketsMod } from "../../../api/ticket";
  
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
      case "CANCELED":
        return {
          text: "Đã hủy",
          className: "bg-red-100 text-red-600"
        };
      case "RESOLVING":
        return {
          text: "Xử lý lại dịch vụ",
          className: "bg-yellow-100 text-yellow-600"
        };
      default:
        return {
          text: status,
          className: ""
        };
    }
  };
  
  export const TableTicket_Mod = forwardRef((props, ref) => {
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
        render: (text, record) => {
          const textStyle = record.isSeen ? '' : 'font-bold text-[#002278]';

          return (
            
            <span className={textStyle}>
              {text}
            </span>
          );
        },
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
      // {
      //   title: "Người xử lý",
      //   dataIndex: "moderatorName",
      //   key: "moderatorName",
      //   width: 150,
      // },
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
        title: "",
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
                navigate(`/moderator/ticket/${ticketId}`);
              }}
              showModalEdit={() => {
                const ticketId = record.id;
                console.log("Navigating to update ticket:", ticketId);
                navigate(`/moderator/ticket/update/${ticketId}`);
              }}
              excludeDefaultItems={["reject", "accept", "delete", "details"]}
            />
          </div>
        ),
      },
    ];
  
    const reloadData = async () => {
      table.handleOpenLoading();
      try {
        const response = await getAllTicketsMod();
        if (response && response.tickets) {
          setData(response.tickets);
          setPagination(prev => ({
            ...prev,
            current: response.pagination.currentPage,
            pageSize: response.pagination.pageSize,
            total: response.pagination.totalItems
          }));
        } else {
          console.error("Dữ liệu không đúng định dạng:", response);
          setData([]);
        }
      } catch (error) {
        console.error("Chi tiết lỗi:", error);
        notificationApi("error", "Lỗi", "Không thể tải dữ liệu");
        setData([]);
      } finally {
        table.handleCloseLoading();
      }
    };
  
    const handleTableChange = (newPagination, filters, sorter) => {
      table.sortField = sorter.field;
      table.sortOrder = sorter.order;
      
      setPagination(newPagination);
      
      getAllTicketsMod(
        newPagination.current,
        newPagination.pageSize,
        sorter.field,
        sorter.order === 'descend'
      ).then(response => {
        if (response && response.tickets) {
          setData(response.tickets);
          setPagination(prev => ({
            ...prev,
            current: response.pagination.currentPage,
            total: response.pagination.totalItems
          }));
        }
      }).catch(error => {
        console.error("Lỗi khi tải dữ liệu:", error);
        notificationApi("error", "Lỗi", "Không thể tải dữ liệu");
      });
    };
  
    useImperativeHandle(ref, () => ({
      reloadData,
    }));
  
    useEffect(() => {
      reloadData();
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
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            // showTotal: (total) => `Tổng ${total} mục`
          }}
          bordered
          className="w-full"
        />
      </div>
    );
  });
  