import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnSearch from "../../../Components/ComTable/utils";
import { useModalState } from "../../../hooks/useModalState";
import { useTableState } from "../../../hooks/useTableState";
import { Image } from "antd";
import ComModal from "../../../Components/ComModal/ComModal";
import ComDateConverter from "../../../Components/ComDateConverter/ComDateConverter";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import { getFeedbackByBranchId } from "../../../api/branch";
import { useNavigate } from 'react-router-dom';

export const TableFeedback_Emp = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const { getColumnSearchProps, getColumnApprox } = useColumnSearch();
  const table = useTableState();
  const modalEdit = useModalState();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const userInfo = JSON.parse(localStorage.getItem('user')); // hoặc tên key bạn đã lưu
  const branchId = userInfo?.branchId;

  useEffect(() => {
    console.log("branchId hiện tại:", branchId);
    if (branchId) {
      reloadData();
    } else {
      console.warn("Không tìm thấy branchId");
    }
  }, [branchId]);

  const reloadData = async () => {
    try {
      console.log("Đang tải dữ liệu với branchId:", branchId);
      const response = await getFeedbackByBranchId(branchId);
      console.log("Phản hồi từ API:", response);
      setData(response?.data?.items || []);
      console.log("Dữ liệu đã được cập nhật:", response?.data?.items);
      table.handleCloseLoading();
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đánh giá:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

//   const showModalEdit = (record) => {
//     modalEdit.handleOpen();
//     setSelectedFeedback(record);
//   };

  const showModalDetails = (record) => {
    navigate(`/employee/feedback/${record.id}`);
  };

  const handleViewDetails = (record) => {
    navigate(`/employee/feedback/${record.id}`);
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
      title: "Ảnh",
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
                alt="feedback-image"
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
        <ComDateConverter>{record?.createdTime}</ComDateConverter>
      ),
      sorter: (a, b) => new Date(a.createdTime) - new Date(b.createdTime),
      ...getColumnApprox("createdTime"),
    },
    {
      title: "Đánh giá",
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
    },
    {
      title: "Trạng thái",
      width: 100,
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đã duyệt", value: "ACTIVE" },
        { text: "Từ chối", value: "SUSPENDED" },
        { text: "Chờ duyệt", value: "PENDING" },
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
            showModalDetails={() => showModalDetails(record)}
            excludeDefaultItems={["delete", "edit"]}
            // onView={() => handleViewDetails(record)}
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
      
      {/* <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={800}
      >
        <EditFeedback
          selectedUser={selectedFeedback}
          onClose={modalEdit?.handleClose}
          tableRef={reloadData}
        />
      </ComModal> */}
    </div>
  );
});