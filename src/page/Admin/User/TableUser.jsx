import React, { useEffect, useState } from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useNotification } from "../../../Notification/Notification";
import { Image, Tag } from "antd";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { getAllAccount } from "../../../api/user";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";

export const TableUser = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const table = useTableState();
  const { notificationApi } = useNotification();
  const { getColumnSearchProps } = useColumnFilters();

  const getRoleColor = (role) => {
    const roleColors = {
      ADMIN: "red",
      MODERATOR: "blue",
      CUSTOMER: "green",
      OWNER: "purple",
      EMPLOYEE: "orange"
    };
    return roleColors[role] || "default";
  };

  const getStatusColor = (status) => {
    return status === "ACTIVE" ? "success" : "error";
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl) => (
        <Image
          src={imageUrl || "https://via.placeholder.com/150"}
          alt="avatar"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
          fallback="https://via.placeholder.com/150"
        />
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      ...getColumnSearchProps("fullName", "Họ và tên"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      ...getColumnSearchProps("email", "Email"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      ...getColumnSearchProps("phone", "Số điện thoại"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        { text: 'Nam', value: 'MALE' },
        { text: 'Nữ', value: 'FEMALE' },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (gender) => (
        <Tag color={gender === "MALE" ? "blue" : "pink"}>
          {gender === "MALE" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      filters: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'Moderator', value: 'MODERATOR' },
        { text: 'Customer', value: 'CUSTOMER' },
        { text: 'Owner', value: 'OWNER' },
        { text: 'Employee', value: 'EMPLOYEE' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: 'Hoạt động', value: 'ACTIVE' },
        { text: 'Không hoạt động', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <ComMenuButonTable
          record={record}
          showModalDetails={() => {
            // Xử lý xem chi tiết
          }}
          showModalEdit={() => {
            // Xử lý chỉnh sửa
          }}
          excludeDefaultItems={["delete"]}
        />
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    reloadData(pagination.current, pagination.pageSize, sorter.order === "descend");
  };

  const reloadData = async (pageNum = 1, pageSize = 10, isDescending = false) => {
    table.handleOpenLoading();
    try {
      const response = await getAllAccount(isDescending, pageSize, pageNum);
      if (response?.data) {
        setData(response.data);
        setPagination({
          current: response.pagination.currentPage,
          pageSize: response.pagination.pageSize,
          total: response.pagination.totalItems,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu người dùng");
    } finally {
      table.handleCloseLoading();
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <ComTable
        y={"calc(100vh - 250px)"}
        columns={columns}
        dataSource={data}
        loading={table.loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        bordered
      />
    </div>
  );
};
