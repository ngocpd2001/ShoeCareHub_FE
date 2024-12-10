import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useModalState } from "../../../hooks/useModalState";
import { useNotification } from "../../../Notification/Notification";
import { useNavigate } from "react-router-dom";
import { deleteEmployee } from '../../../api/employee';
import { message, Modal } from 'antd';

import ComTable from "../../../Components/ComTable/ComTable";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { getEmployeeByBusinessId } from "../../../api/employee";

export const TableEmployee = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const table = useTableState();
  const { notificationApi } = useNotification();
  const navigate = useNavigate();

  const {
    getColumnSearchProps,
  } = useColumnFilters();

  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      ...getColumnSearchProps("fullName", "Tên nhân viên"),
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.imageUrl}
            alt={text}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps("email", "Email"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      ...getColumnSearchProps("phone", "Số điện thoại"),
    },
    {
      title: "Chi nhánh",
      dataIndex: ["branch", "name"],
      key: "branch",
      width: 150,
      sorter: (a, b) => {
        if (!a.branch || !b.branch) return 0;
        return a.branch.name.localeCompare(b.branch.name);
      },
      ...getColumnSearchProps(["branch", "name"], "Chi nhánh"),
      render: (text, record) => {
        if (!record.branch) {
          return <div>Chưa có chi nhánh</div>;
        }
        
        return (
          <div>
            <div>{record.branch.name}</div>
            <div className={`${
              record.branch.status === "ACTIVE" 
                ? "text-green-500" 
                : "text-red-500"
            }`}>
              {record.branch.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày sinh/Giới tính",
      dataIndex: "dob",
      key: "dob",
      width: 150,
      sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
      ...getColumnSearchProps("dob", "Ngày sinh/Giới tính"),
      render: (text, record) => (
        <div>
          <div>{new Date(record.dob).toLocaleDateString("vi-VN")}</div>
          <div className="text-gray-500">
            {record.gender === "MALE" ? "Nam" : "Nữ"}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 200,
      sorter: (a, b) => a.status.localeCompare(b.status),
      ...getColumnSearchProps("status", "Trạng thái"),
      render: (text, record) => (
        <div className={`${
          record.status === "ACTIVE" 
            ? "text-green-500" 
            : "text-red-500"
        }`}>
          {record.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động"}
        </div>
      ),
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
              const employeeId = record.id;
              navigate(`/owner/employee/${employeeId}`);
            }}
            showModalDelete={() => handleDelete(record)}
            excludeDefaultItems={["reject", "accept", "edit"]} 
          />
        </div>
      ),
    },
  ];

  const notificationError = () => {
    notificationApi("error", "Lỗi", "Lỗi");
  };

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  const reloadData = async () => {
    table.handleOpenLoading();
    try {
      const response = await getEmployeeByBusinessId();
      setData(Array.isArray(response.employees) ? response.employees : []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu nhân viên");
      setData([]);
    } finally {
      table.handleCloseLoading();
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleDelete = async (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa nhân viên "${record.fullName}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await deleteEmployee(record.id);
          message.success("Xóa nhân viên thành công!");
          reloadData();
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa nhân viên!");
        }
      },
    });
  };

  return (
    <div>
      <ComTable
        y={"50vh"}
        x={1020}
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        loading={table.loading}
        rowKey="id"
        pagination={{
          total: data.length,
          pageSize: 10,
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
        bordered
        className="w-full"
      />
    </div>
  );
});

export default TableEmployee;