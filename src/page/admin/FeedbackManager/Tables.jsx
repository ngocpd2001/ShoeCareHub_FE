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
import { getData } from "../../../api/api";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import DetailElder from "../TableElder/DetailElder";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import useRolePermission from "../../../hooks/useRolePermission";
import EditFeedback from "./EditFeedback";

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
    getData("/feedbacks?pageIndex=1&pageSize=100000000")
      .then((e) => {
        setData(e?.data?.data?.items);
        console.log("====================================");
        console.log(123, e);
        console.log("====================================");
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

  const columns = [
    {
      title: "Nội dung",
      dataIndex: "content",
      width: 100,
      key: "content",
      fixed: "left",
      sorter: (a, b) => a.content?.localeCompare(b.content),

      ...getColumnSearchProps("content", "Nội dung"),
    },
    {
      title: "Ảnh ",
      dataIndex: "assetUrls",
      key: "assetUrls",
      width: 100,
      // fixed: "left",
      render: (data, record) => {
        // Chuyển đổi dữ liệu ảnh từ mảng đối tượng sang mảng URL

        console.log(1111, data);

        const imageUrls = data?.map((image) => image?.url);
        // image?.type === "video"

        return (
          <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
            <Image.PreviewGroup items={imageUrls}>
              <Image
                maskClassName="object-cover w-full h-full object-cover object-center flex items-center justify-center"
                src={imageUrls[0]}
                alt={"data"}
                preview={{ mask: "Xem ảnh" }}
              />
            </Image.PreviewGroup>
          </div>
        );
      },
    },
    {
      title: "Thời gian bình luận",
      width: 100,
      dataIndex: "createdTime",
      key: "createdTime",
      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.createdTime}</ComDateConverter>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdTime) - new Date(b.createdTime),

      ...getColumnApprox("createdTime"),
    },
    {
      title: "Đánh giá ",
      width: 100,
      dataIndex: "rating",
      key: "rating",
      filters: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
      ],
      onFilter: (value, record) => record.rating === value,
      sorter: (a, b) => a.rating - b.rating,
      render: (_, record) => <div>{record.rating}</div>,
    },
    {
      title: "Trạng thái ",
      width: 100,
      dataIndex: "status",
      key: "status",
      filters: [{ text: "AVAILABLE", value: "AVAILABLE" }],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => (
        <div>
          {record.status === "ACTIVE" && "Đã duyệt"}
          {record.status === "SUSPENDED" && "Từ chối"}
          {record.status === "PENDING" && "Chờ duyệt"}
        </div>
      ),
    },
    // {
    //   title: "Trạng thái nội dung ",
    //   width: 100,
    //   dataIndex: "isValidContent",
    //   key: "isValidContent",
    //   filters: [{ text: "AVAILABLE", value: "AVAILABLE" }],
    //   onFilter: (value, record) => record.isValidContent === value,

    //   render: (_, record) => (
    //     <div>{record.isValidContent ? "có" : "không"}</div>
    //   ),
    // },
    // {
    //   title: "Trạng thái ảnh ",
    //   width: 100,
    //   dataIndex: "isValidAsset",
    //   key: "isValidAsset",
    //   filters: [{ text: "AVAILABLE", value: "AVAILABLE" }],
    //   onFilter: (value, record) => record.isValidAsset === value,

    //   render: (_, record) => <div>{record.isValidAsset ? "có" : "không"}</div>,
    // },
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
            excludeDefaultItems={["delete", "details"]}
            // order={order}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <ComTable
        x
        y={"70vh"}
        columns={columns}
        dataSource={data}
        loading={table.loading}
      />
      {/* chi tiêt của user  */}

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
        <EditFeedback
          selectedUser={selectedUser}
          onClose={modalEdit?.handleClose}
          tableRef={reloadData}
        />
      </ComModal>
    </div>
  );
});
