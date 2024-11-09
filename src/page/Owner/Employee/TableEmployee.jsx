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
      width: 200,
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
      dataIndex: "branch",
      key: "branch",
      width: 150,
      sorter: (a, b) => a.branch.localeCompare(b.branch),
      ...getColumnSearchProps("branch", "Chi nhánh"),
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
      width: 150,
      sorter: (a, b) => a.status.localeCompare(b.status),
      ...getColumnSearchProps("status", "Trạng thái"),
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
              const employeeId = record.id;
              // console.log("Navigating to employee details with ID:", employeeId);
              navigate(`/owner/employee/${employeeId}`);
            }}
            showModalEdit={() => {
              const employeeId = record.id;
              navigate(`/owner/employee/update/${employeeId}`);
            }}
            excludeDefaultItems={["delete"]} 
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

  const reloadData = () => {
    table.handleOpenLoading();
    const temporaryBusinessId = 1;
    getEmployeeByBusinessId(temporaryBusinessId)
      .then((response) => {
        setData(response);
        table.handleCloseLoading();
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
        table.handleCloseLoading();
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <ComTable
        y={"50vh"}
        x={1020}
        columns={columns}
        dataSource={data}
        loading={false}
        rowKey="id"
        pagination={false}
        bordered
        className="w-full"
      />
    </div>
  );
});

export default TableEmployee;