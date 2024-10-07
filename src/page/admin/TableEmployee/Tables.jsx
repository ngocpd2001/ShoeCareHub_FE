import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnSearch from "../../../Components/ComTable/utils";
import { useModalState } from "../../../hooks/useModalState";
import { useTableState } from "../../../hooks/useTableState";
import { Image, Table, Tooltip, Typography } from "antd";
import ComModal from "../../../Components/ComModal/ComModal";
import DetailEmployee from "./DetailEmployee";
import EditEmployee from "./EditEmployee";
import { getData } from "../../../api/api";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComCccdOrCmndConverter from "../../../Components/ComCccdOrCmndConverter/ComCccdOrCmndConverter";
import ComPhoneConverter from "../../../Components/ComPhoneConverter/ComPhoneConverter";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import ComGenderConverter from "../../../Components/ComGenderConverter/ComGenderConverter";
import ComRoleConverter from "../../../Components/ComRoleConverter/ComRoleConverter";
import { useLocation } from "react-router-dom";
import useRolePermission from "../../../hooks/useRolePermission";

export const Tables = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const { getColumnSearchProps, getColumnApprox } = useColumnSearch();
  const table = useTableState();
  const modalDetailUser = useModalState();
  const modalDetailElder = useModalState();
  const modalEdit = useModalState();
  const [selectedData, setSelectedData] = useState(null);
  const [selectedElder, setSelectedElder] = useState(null);
  const location = useLocation();
  const hasPermission = useRolePermission(["admin"]);

  function getRoleFromPath(pathname) {
    const parts = pathname.split("/");
    return parts[1];
  }
  useEffect(() => {
    reloadData();
  }, []);
  const director = getRoleFromPath(location.pathname) === "director";

  console.log(data);
  const reloadData = () => {
    const link =
      getRoleFromPath(location.pathname) !== "manager"
        ? `RoleNames=Staff&RoleNames=Nurse&RoleNames=Manager&SortDir=Desc`
        : `RoleNames=Staff&RoleNames=Nurse&SortDir=Desc`;
    console.log("====================================");
    console.log(link);
    console.log("====================================");
    getData(`/users?${link}`)
      .then((e) => {
        setData(e?.data?.contends);
        table.handleCloseLoading();
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
  useImperativeHandle(ref, () => ({
    reloadData,
  }));
  const showModaldElder = (record) => {
    modalDetailElder.handleOpen();
    setSelectedElder(record);
  };
  const showModal = (record) => {
    modalDetailUser.handleOpen();
    setSelectedData(record);
  };
  const showModalEdit = (record) => {
    modalEdit.handleOpen();
    setSelectedData(record);
  };
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      width: 100,
      key: "fullName",
      fixed: "left",
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
      ...getColumnSearchProps("fullName", "Họ và tên"),
      // render: (record) => (
      //   <Tooltip placement="topLeft" title={"Chi tiết"}>
      //     {record}
      //   </Tooltip>
      // ),
    },
    {
      title: "Ảnh ",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      width: 100,
      // fixed: "left",
      render: (_, record) => (
        <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
          {record?.avatarUrl ? (
            <Image
              wrapperClassName="object-cover w-full h-full object-cover object-center flex items-center justify-center "
              src={record?.avatarUrl}
              alt={record?.avatarUrl}
              preview={{ mask: "Xem ảnh" }}
            />
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      title: "Chức vụ",
      width: 100,
      dataIndex: "roles",
      key: "roles",
      // ...getColumnSearchProps("roles", "Chức vụ"),
      filters: [
        { text: "Y tá", value: "Nurse" },
        { text: "Nhân viên", value: "Staff" },
        { text: "Quản lý", value: "Manager" },
      ],
      onFilter: (value, record) => record?.roles[0]?.name === value,
      sorter: (a, b) => a?.roles[0]?.name?.localeCompare(b?.roles[0]?.name),

      render: (_, render) => (
        <ComRoleConverter>
          {render?.roles ? render?.roles[0]?.name : ""}
        </ComRoleConverter>
      ),
    },
    {
      title: "Giới tính",
      width: 100,
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Nam", value: "Male" },
        { text: "Nữ", value: "Female" },
      ],
      onFilter: (value, record) => record?.gender === value,
      render: (_, record) => (
        <div>
          <ComGenderConverter>{record?.gender}</ComGenderConverter>
        </div>
      ),
    },
    {
      title: "Năm sinh",
      width: 100,
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),
      ...getColumnApprox("dateOfBirth"),

      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.dateOfBirth}</ComDateConverter>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      width: 100,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber", "Số điện thoại"),
      render: (phone) => (
        <div>
          <ComPhoneConverter>{phone}</ComPhoneConverter>
        </div>
      ),
    },
    {
      title: "CMND/CCCD",
      width: 100,
      dataIndex: "cccd",
      key: "cccd",
      sorter: (a, b) => a.cccd - b.cccd,
      ...getColumnSearchProps("cccd", "CMND/CCCD"),
      render: (cccd) => (
        <div>
          <ComCccdOrCmndConverter>{cccd}</ComCccdOrCmndConverter>
        </div>
      ),
    },
    {
      title: "Gmail",
      width: 100,
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email", "Gmail"),
    },
    {
      title: "Địa chỉ",
      width: 100,
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address", "Địa chỉ"),
    },

    {
      title: "Thao tác",
      key: "operation",
      fixed: "right",
      width: 50,
      render: (_, record) => (
        <div className="flex items-center flex-col">
          <ComMenuButonTable
            record={record}
            showModalDetails={() => showModal(record)}
            showModalEdit={showModalEdit}
            // extraMenuItems={extraMenuItems}
            excludeDefaultItems={
              hasPermission ? ["delete"] : ["delete", "edit"]
            }
            // order={order}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <ComTable columns={columns} dataSource={data} loading={table.loading} />
      {/* chi tiêt của user  */}
      <ComModal
        isOpen={modalDetailUser?.isModalOpen}
        onClose={modalDetailUser?.handleClose}
      >
        <DetailEmployee
          selectedData={selectedData}
          // isOpenEdit={modalEdit?.handleOpen}
          isOpenEdit={!director ? modalEdit?.handleOpen : null}
          onClose={modalDetailUser?.handleClose}
        />
      </ComModal>

      {/* Cập nhật nhân viên */}
      <ComModal
        width={800}
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
      >
        <EditEmployee
          selectedData={selectedData}
          onClose={modalEdit?.handleClose}
          tableRef={reloadData}
        />
      </ComModal>
    </div>
  );
});
