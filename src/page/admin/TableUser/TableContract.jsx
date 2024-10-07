import React, { useEffect, useState } from "react";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnSearch from "../../../Components/ComTable/utils";
import { useModalState } from "../../../hooks/useModalState";
import { useTableState } from "../../../hooks/useTableState";
import { Image, Tooltip, Typography } from "antd";
import ComModal from "../../../Components/ComModal/ComModal";
import { getData } from "../../../api/api";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import DetailContract from "../../Staff/Contract/DetailContract";
import ContractExtension from "../../Staff/Contract/ContractExtension";
import ComContractStatusConverter from "../../../Components/ComStatusConverter/ComContractStatusConverter";

export default function TableContract({ idUser }) {
  const [data, setData] = useState([]);
  const {
    getColumnSearchProps,
    getColumnApprox,
    getUniqueValues,
    getColumnFilterProps,
  } = useColumnSearch();
  const table = useTableState();
  const modalDetail = useModalState();
  const modalEdit = useModalState();
  const [selectedUser, setSelectedUser] = useState(null);
  console.log("====================================");
  console.log(selectedUser);
  console.log("====================================");
  const uniquePackageValues = getUniqueValues(data, "nursingPackage.name");

  useEffect(() => {
    getData(`/contract?UserId=${idUser}&SortDir=Desc`)
      .then((e) => {
        setData(e?.data?.contends);
        table.handleCloseLoading();
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const showModal = (record) => {
    modalDetail.handleOpen();
    setSelectedUser(record);
  };
  const showModalEdit = (record) => {
    modalEdit.handleOpen();
    setSelectedUser(record);
  };
  const columns = [
    {
      title: "Số hợp đồng",
      dataIndex: "name",
      width: 150,
      key: "name",
      fixed: "left",
      sorter: (a, b) => a.name?.localeCompare(b.name),
      ...getColumnSearchProps("name", "Họ và tên"),
    },
    {
      title: "Tên người cao tuổi",
      dataIndex: "elder.name",
      width: 150,
      key: "elder.name",
      ...getColumnSearchProps("elder.name", "Họ và tên"),
    },
    {
      title: "Tên người thân",
      dataIndex: "user.fullName",
      width: 150,
      key: "user.fullName",
      ...getColumnSearchProps("user.fullName", "Họ và tên"),
    },
    {
      title: "Ảnh hợp đồng",
      dataIndex: "images",
      key: "images",
      width: 100,
      render: (data, record) => {
        // Chuyển đổi dữ liệu ảnh từ mảng đối tượng sang mảng URL
        const imageUrls = data.map((image) => image.imageUrl);

        return (
          <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
            <Image.PreviewGroup items={imageUrls}>
              <Image
                maskClassName="object-cover w-full h-full object-cover object-center flex items-center justify-center"
                src={imageUrls[0]}
                alt={data[0]?.imageAlt}
                preview={{ mask: "Xem ảnh" }}
              />
            </Image.PreviewGroup>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      width: 100,
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đang được sử dụng", value: "Valid" },
        { text: "Chưa chưa đến hẹn sửa dụng", value: "Pending" },
        { text: "Đã hủy", value: "Cancelled" },
        { text: "Hết hạn", value: "Expired" },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
      // ...getColumnSearchProps("method", "Thanh toán bằng"),
      render: (_, record) => (
        <div>
          <ComContractStatusConverter>
            {record.status}
          </ComContractStatusConverter>
        </div>
      ),
    },
    {
      title: "Gói dưỡng lão",
      width: 130,
      dataIndex: "nursingPackage",
      key: "nursingPackage",
      sorter: (a, b) =>
        a?.nursingPackage?.name?.localeCompare(b?.nursingPackage?.name),
      ...getColumnFilterProps(
        "nursingPackage.name",
        "Loại phòng",
        uniquePackageValues
      ),
      render: (render) => <div>{render.name}</div>,
    },
    {
      title: "Ngày kí ",
      width: 100,
      dataIndex: "signingDate",
      key: "signingDate",
      sorter: (a, b) => new Date(a.signingDate) - new Date(b.signingDate),
      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.signingDate}</ComDateConverter>
        </div>
      ),
      ...getColumnApprox("signingDate", "Gói"),
    },
    {
      title: "Ngày có hiệu lực",
      width: 100,
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),

      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.startDate}</ComDateConverter>
        </div>
      ),
      ...getColumnApprox("startDate", "Gói"),
    },
    {
      title: "Ngày hết hạn",
      width: 100,
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),

      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.endDate}</ComDateConverter>
        </div>
      ),
      ...getColumnApprox("endDate"),
    },
    {
      title: "Ghi chú",
      width: 100,
      dataIndex: "notes",
      key: "notes",
      sorter: (a, b) => a.notes?.localeCompare(b.notes),

      ...getColumnSearchProps("notes", "Ghi chú"),
    },
    {
      title: "Thao tác",
      key: "operation",
      fixed: "right",
      width: 80,
      render: (_, record) => {
        const today = new Date();
        const endDate = new Date(record.endDate);
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return (
          <div className="flex items-center flex-col">
            <ComMenuButonTable
              record={record}
              showModalDetails={() => showModal(record)}
              extraMenuItems={daysDiff < 30 ? extraMenuItems : []}
              excludeDefaultItems={["delete", "edit"]}
            />
          </div>
        );
      },
    },
  ];
  const extraMenuItems = [
    {
      label: "Gia hạn",
      onClick: (e) => {
        showModalEdit(e);
      },
    },
  ];
  return (
    <div>
      <ComTable columns={columns} dataSource={data} loading={table.loading} />
      {/* chi tiết hợp đồng */}
      <ComModal
        isOpen={modalDetail?.isModalOpen}
        onClose={modalDetail?.handleClose}
      >
        <DetailContract
          selectedUser={selectedUser}
          onClose={modalDetail?.handleClose}
          isOpenEdit={() => modalEdit?.handleOpen()}
        />
      </ComModal>
      {/* gia hạn hợp đồng */}
      <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={800}
      >
        <ContractExtension
          selectedUser={selectedUser}
          onClose={modalEdit?.handleClose}
        />
      </ComModal>
    </div>
  );
}
