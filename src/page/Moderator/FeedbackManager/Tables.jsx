import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ComTable from "../../../Components/ComTable/ComTable";
import ComModal from "../../../Components/ComModal/ComModal";
import useColumnSearch from "../../../Components/ComTable/utils";
import { useModalState } from "../../../hooks/useModalState";
import { useTableState } from "../../../hooks/useTableState";
import { Image } from "antd";
import { getData, putData } from "../../../api/api";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
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

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    getData("/feedbacks?pageIndex=1&pageSize=100000000")
      .then((e) => {
        const feedbacks = e?.data?.data?.items || [];
        setData(feedbacks);

        // Tìm feedback đầu tiên ở trạng thái PENDING và thực thi logic
        const pendingFeedback = feedbacks.find(
          (feedback) => feedback.status === "PENDING"
        );
        if (pendingFeedback) {
          setSelectedUser(pendingFeedback);
          handleAutoTrigger(pendingFeedback); // Thực thi logic tự động
        }
      })
      .finally(() => {
        table.handleCloseLoading();
      });
  };

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  const handleAutoTrigger = (feedback) => {
    // Logic xử lý tự động mà không cần hiển thị modal
    if (
      feedback.isValidContent === true &&
      feedback.isValidAsset === true &&
      feedback.status !== "ACTIVE"
    ) {
      const updatedFeedback = {
        ...feedback,
        status: "ACTIVE",
      };
      putData(`/feedbacks`, feedback.id, updatedFeedback)
        .then(() => {
          console.log("Auto-update thành công cho feedback:", feedback.id);
          reloadData(); // Reload lại bảng dữ liệu
        })
        .catch((error) => {
          console.error("Lỗi auto-update feedback:", error);
        });
    } else if (
      (feedback.isValidContent === false || feedback.isValidAsset === false) &&
      feedback.status !== "SUSPENDED"
    ) {
      const updatedFeedback = {
        ...feedback,
        status: "SUSPENDED",
      };
      putData(`/feedbacks`, feedback.id, updatedFeedback)
        .then(() => {
          console.log("Auto-update thành công cho feedback:", feedback.id);
          reloadData(); // Reload lại bảng dữ liệu
        })
        .catch((error) => {
          console.error("Lỗi auto-update feedback:", error);
        });
    }
  };

  const showModalEdit = (record) => {
    setSelectedUser(record);
    modalEdit.handleOpen();
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
      render: (data) => {
        const imageUrls = data?.map((image) => image?.url);
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
      render: (_, record) => (
        <div>
          <ComDateConverter>{record?.createdTime}</ComDateConverter>
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
      filters: [
        { text: "Đã duyệt", value: "ACTIVE" },
        { text: "Từ chối", value: "SUSPENDED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => (
        <div>
          {record.status === "ACTIVE" && "Đã duyệt"}
          {record.status === "SUSPENDED" && "Từ chối"}
          {record.status === "PENDING" && "Chờ duyệt"}
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
            showModalEdit={() => showModalEdit(record)}
            excludeDefaultItems={["delete", "details"]}
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
