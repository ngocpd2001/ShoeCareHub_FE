import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ComTable from "../../../Components/ComTable/ComTable";
import { useModalState } from "../../../hooks/useModalState";
import { useTableState } from "../../../hooks/useTableState";
import { Image, Tooltip, Typography } from "antd";
import ComModal from "../../../Components/ComModal/ComModal";
import DetailElder from "./DetailElder";
import EditElder from "./EditElder";
import { getData } from "../../../api/api";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import DetailUser from "./../TableUser/DetailUser";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComGenderConverter from "../../../Components/ComGenderConverter/ComGenderConverter";
import ComCccdOrCmndConverter from "../../../Components/ComCccdOrCmndConverter/ComCccdOrCmndConverter";
import useRolePermission from "../../../hooks/useRolePermission";
import useColumnFilters from "../../../Components/ComTable/utils";

export const Tables = forwardRef((props, ref) => {
  const { idUser } = props;
  const [data, setData] = useState([]);
  const {
    getColumnSearchProps,
    getColumnApprox,
    getColumnFilterProps,
    getUniqueValues,
  } = useColumnFilters();
  const table = useTableState();
  const modalDetailUser = useModalState();
  const modalDetailElder = useModalState();
  const modalEdit = useModalState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedElder, setSelectedElder] = useState(null);
  const hasPermission = useRolePermission(["admin", "staff"]);
  console.log(data);

  useEffect(() => {
    reloadData();
  }, []);
  useImperativeHandle(ref, () => ({
    reloadData,
  }));
  const reloadData = () => {
    const urlApi = idUser
      ? `/elders?UserId=${idUser}&SortDir=Desc`
      : `/elders?SortDir=Desc`;
    console.log(urlApi);

    getData(urlApi)
      .then((e) => {
        setData(e?.data?.contends);
        table.handleCloseLoading();
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
  const showModaldUser = (record) => {
    console.log(record);
    modalDetailUser.handleOpen();
    setSelectedUser(record);
  };
  const showModalElder = (record) => {
    modalDetailElder.handleOpen();
    setSelectedElder(record);
  };
  const showModalEdit = (record) => {
    modalEdit.handleOpen();
    setSelectedElder(record);
  };

  // const order = ["Thêm mới", "edit", "delete", "details"];
  const extraMenuItems = [
    {
      label: "Thêm mới",
      onClick: () => {
        console.log("Thêm mới clicked");
      },
    },
  ];

  const uniqueRoomValues = getUniqueValues(data, "room.name");
  const uniquePackageValues = getUniqueValues(
    data,
    "contractsInUse.nursingPackage.name"
  );
  function ComContractInUseStatusConverter({ contractsInUse }) {
    const status = contractsInUse ? "Đang được hoạt động" : "Đã hủy";
    const className = contractsInUse ? "text-blue-600" : "text-red-600";

    return <div className={className}>{status}</div>;
  }
  const columns = [
    {
      title: "Họ và tên người cao tuổi",
      dataIndex: "name",
      width: 200,
      key: "name",
      fixed: "left",
      sorter: (a, b) => a?.name?.localeCompare(b?.name),
      ...getColumnSearchProps("name", "Họ và tên"),
    },
    {
      title: "Ảnh người cao tuổi",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      fixed: "left",
      render: (_, record) => (
        <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
          {record?.imageUrl ? (
            <Image
              wrapperClassName=" w-full h-full object-cover object-center flex items-center justify-center "
              src={record?.imageUrl}
              alt={record?.imageUrl}
              preview={{ mask: "Xem ảnh" }}
            />
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      title: "Người đại diện",
      width: 150,
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => a?.user?.fullName?.localeCompare(b?.user?.fullName),
      ...getColumnSearchProps("user.fullName", "Họ và tên"),

      render: (user) => (
        <Typography.Link onClick={() => showModaldUser(user)}>
          {user?.fullName}
        </Typography.Link>
      ),
    },
    {
      title: "Năm sinh người cao tuổi",
      width: 160,
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
      title: "CMND/CCCD",
      width: 150,
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
    // {
    //   title: "Trạng thái hợp đồng",
    //   dataIndex: "contractsInUses",
    //   key: "contractStatuss",
    //   width: 150,
    //   filters: [
    //     { text: "Đang được hoạt động", value: "active" },
    //     { text: "Đã hủy", value: "cancelled" },
    //   ],
    //   onFilter: (value, record) => {
    //     const isActive =
    //       record.contractsInUse &&
    //       Object.keys(record.contractsInUse).length > 0;
    //     return (
    //       (value === "active" && isActive) ||
    //       (value === "cancelled" && !isActive)
    //     );
    //   },
    //   sorter: (a, b) => {
    //     if (a.contractsInUse === b.contractsInUse) {
    //       return 0;
    //     }
    //     return a.contractsInUse ? -1 : 1;
    //   },
    //   render: (_, record) => (
    //     <div>
    //       <ComContractInUseStatusConverter
    //         contractsInUse={record.contractsInUse}
    //       />
    //     </div>
    //   ),
    // },
    {
      title: "Phòng hiện tại",
      width: 150,
      dataIndex: "room",
      key: "room",
      sorter: (a, b) => a?.room?.name?.localeCompare(b?.room?.name),
      // ...getColumnSearchProps("room.name", "Phòng hiện tại"),
      ...getColumnFilterProps("room.name", "Phòng hiện tại", uniqueRoomValues),

      render: (_, render) => <div>{render?.room?.name || "Đã xuất viện"}</div>,
    },
    {
      title: "Loại gói dưỡng lão hiện tại",
      width: 200,
      dataIndex: "contractsInUse",
      key: "contractsInUse",

      sorter: (a, b) =>
        a?.contractsInUse?.nursingPackage?.name?.localeCompare(
          b?.contractsInUse?.nursingPackage?.name
        ),
      ...getColumnFilterProps(
        "contractsInUse.nursingPackage.name",
        "Loại gói dưỡng lão",
        uniquePackageValues
      ),
      // ...getColumnSearchProps(
      //   "contractsInUse.nursingPackage.name",
      //   "Loại gói dưỡng lão"
      // ),

      render: (_, render) => (
        <div>{render?.contractsInUse?.nursingPackage?.name || "Không có"}</div>
      ),
    },
    {
      title: "Ngày có hiệu lực",
      width: 120,
      dataIndex: "contractsInUse.startDate",
      key: "contractsInUse.startDate",
      sorter: (a, b) =>
        new Date(a?.contractsInUse?.startDate) -
        new Date(b?.contractsInUse?.startDate),
      ...getColumnApprox("contractsInUse.startDate"),
      render: (_, render) => (
        <div>
          <ComDateConverter>
            {render?.contractsInUse?.startDate}
          </ComDateConverter>
        </div>
      ),
    },
    {
      title: "Ngày hết hạn",
      width: 120,
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) =>
        new Date(a?.contractsInUse?.endDate) -
        new Date(b?.contractsInUse?.endDate),
      ...getColumnApprox("contractsInUse.endDate"),
      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.contractsInUse?.endDate}</ComDateConverter>
        </div>
      ),
    },
    {
      title: "Ngày đăng ký",
      width: 120,
      dataIndex: "signingDate",
      key: "signingDate",
      sorter: (a, b) =>
        new Date(a?.contractsInUse?.signingDate) -
        new Date(b?.contractsInUse?.signingDate),
      ...getColumnApprox("contractsInUse.signingDate"),
      render: (_, render) => (
        <div>
          {/* {render?.contract?.signingDate} */}
          <ComDateConverter>
            {render?.contractsInUse?.signingDate}
          </ComDateConverter>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      width: 220,
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address", "Địa chỉ"),
    },
    {
      title: "Ghi chú",
      width: 220,
      dataIndex: "notes",
      key: "notes",
      ...getColumnSearchProps("notes", "Ghi chú"),
    },
    {
      title: "Thao tác",
      key: "operation",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <div className="flex items-center flex-col">
          <ComMenuButonTable
            record={record}
            showModalDetails={() => showModalElder(record)}
            showModalEdit={showModalEdit}
            // extraMenuItems={extraMenuItems}
            // showModalDelete={extraMenuItems}
            excludeDefaultItems={
              hasPermission && record?.contractsInUse?.nursingPackage?.name
                ? ["delete"]
                : ["delete", "edit"]
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
      {/* chi tiết người lớn tuôi */}
      <ComModal
        isOpen={modalDetailElder?.isModalOpen}
        width={700}
        onClose={modalDetailElder?.handleClose}
      >
        <DetailElder
          selectedData={selectedElder}
          isOpenEdit={hasPermission ? modalEdit.handleOpen : false}
          onClose={modalDetailElder?.handleClose}
        />
      </ComModal>
      {/* Cập nhật người cao tuổi */}
      <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={800}
      >
        <EditElder
          selectedData={selectedElder}
          onClose={modalEdit?.handleClose}
          tableRef={reloadData}
        />
      </ComModal>
      {/* chi tiết người thân  */}
      <ComModal
        isOpen={modalDetailUser?.isModalOpen}
        onClose={modalDetailUser?.handleClose}
      >
        <DetailUser selectedUser={selectedUser} />
      </ComModal>
    </div>
  );
});
