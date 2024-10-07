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
import DetailUser from "./DetailUser";
import EditUser from "./EditUser";
import { getData } from "../../../api/api";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import ComPhoneConverter from "../../../Components/ComPhoneConverter/ComPhoneConverter";
import ComCccdOrCmndConverter from "../../../Components/ComCccdOrCmndConverter/ComCccdOrCmndConverter";
import DetailElder from "../TableElder/DetailElder";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComGenderConverter from "../../../Components/ComGenderConverter/ComGenderConverter";
import { useLocation } from "react-router-dom";
import useRolePermission from "../../../hooks/useRolePermission";

export const Tables = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const { getColumnSearchProps, getColumnApprox } = useColumnSearch();
  const table = useTableState();
  const modalDetailUser = useModalState();
  const modalDetailElder = useModalState();
  const modalEdit = useModalState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedElder, setSelectedElder] = useState(null);

  const hasPermission = useRolePermission(["admin", "staff"]);
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  useEffect(() => {
    reloadData();
  }, []);
  const reloadData = () => {
    getData("/users?RoleNames=Customer&SortDir=Desc")
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
    setSelectedUser(record);
  };
  const showModalEdit = (record) => {
    modalEdit.handleOpen();
    setSelectedUser(record);
  };
  const expandedRowRender = (record) => {
    const columnsElders = [
      {
        title: "Tên người thân",
        fixed: "left",
        width: 100,
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name?.localeCompare(b.name),
        ...getColumnSearchProps("name", "Tên người thân"),
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
        onFilter: (value, record) => record.gender === value,
        sorter: (a, b) => a.gender?.localeCompare(b.gender),

        render: (_, record) => (
          <div>
            <ComGenderConverter>{record?.gender}</ComGenderConverter>
          </div>
        ),
      },
      {
        title: "Địa chỉ",
        width: 100,
        dataIndex: "address",
        key: "address",
        sorter: (a, b) => a.address?.localeCompare(b.address),
        ...getColumnSearchProps("address", "Địa chỉ"),
      },
      {
        title: "Ghi chú",
        width: 100,
        dataIndex: "notes",
        key: "notes",
        sorter: (a, b) => a.notes?.localeCompare(b.notes),
        ...getColumnSearchProps("address", "Ghi chú"),
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
              showModalDetails={() => showModaldElder(record)}
              showModalEdit={showModalEdit}
              // extraMenuItems={extraMenuItems}
              // excludeDefaultItems={["delete", "edit"]}
              excludeDefaultItems={["delete", "edit"]}
              // order={order}
            />
          </div>
        ),
      },
    ];
    return (
      <Table
        scroll={{
          x: 1520,
          y: "55vh",
        }}
        bdataed
        bordered
        columns={columnsElders}
        dataSource={record.elders}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    );
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
      title: "Giới tính",
      width: 100,
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Nam", value: "Male" },
        { text: "Nữ", value: "Female" },
      ],
      onFilter: (value, record) => record.gender === value,
      sorter: (a, b) => a?.gender?.localeCompare(b?.gender),

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
      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.dateOfBirth}</ComDateConverter>
        </div>
      ),
      sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),

      ...getColumnApprox("dateOfBirth"),
    },
    {
      title: "Số điện thoại",
      width: 100,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber", "Số điện thoại"),
      sorter: (a, b) => a.phoneNumber - b.phoneNumber,

      render: (phone) => (
        <div>
          <ComPhoneConverter>{phone}</ComPhoneConverter>
        </div>
      ),
    },
    {
      title: "Gmail",
      width: 100,
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
      ...getColumnSearchProps("email", "Gmail"),
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
      title: "Địa chỉ",
      width: 100,
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a?.address?.localeCompare(b?.address),
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
      <ComTable
        expandable={
          hasPermission
            ? {
                expandedRowRender,
                defaultExpandedRowKeys: ["0"],
              }
            : {}
        }
        y={"60vh"}
        columns={columns}
        dataSource={data}
        loading={table.loading}
      />
      {/* chi tiêt của user  */}
      <ComModal
        isOpen={modalDetailUser?.isModalOpen}
        onClose={modalDetailUser?.handleClose}
      >
        <DetailUser
          selectedUser={selectedUser}
          isOpenEdit={hasPermission ? modalEdit?.handleOpen : null}
          onClose={modalDetailUser?.handleClose}
        />
      </ComModal>
      {/* chi tiết của người cao tuổi  */}
      <ComModal
        isOpen={modalDetailElder?.isModalOpen}
        onClose={modalDetailElder?.handleClose}
      >
        <DetailElder selectedData={selectedElder} />
      </ComModal>
      {/* Cập nhật user */}
      <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={800}
      >
        <EditUser
          selectedUser={selectedUser}
          onClose={modalEdit?.handleClose}
          tableRef={reloadData}
        />
      </ComModal>
    </div>
  );
});
