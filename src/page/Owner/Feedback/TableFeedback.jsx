import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useModalState } from "../../../hooks/useModalState";
import { Image, Tooltip } from "antd";
import { useNotification } from "../../../Notification/Notification";

import DetailFeedback from "./DetailFeedback";
import EditUpgrede from "./EditService";
import ComModal from "../../../Components/ComModal/ComModal";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComConfirmDeleteModal from "../../../Components/ComConfirmDeleteModal/ComConfirmDeleteModal";
import { getData } from "../../../api/api";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { useStorage } from "../../../hooks/useLocalStorage";
import { render } from "@testing-library/react";
import ComDateConverter from "./../../../Components/ComDateConverter/ComDateConverter";
function formatCurrency(number) {
  // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
  if (typeof number === "number") {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
}
export const TableFeedback = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const table = useTableState();
  const modal = useModalState();
  const modalDetail = useModalState();
  const modalEdit = useModalState();
  const { notificationApi } = useNotification();
  const [user, setUser] = useStorage("user", null);

  const {
    getColumnSearchProps,
    getColumnPriceRangeProps,
    getUniqueValues,
    getColumnFilterProps,
    getColumnApprox,
  } = useColumnFilters();
  const columns = [
    {
      title: "Dịch vụ",
      width: 200,
      fixed: "left",
      dataIndex: "orderItem.service.name",
      key: "orderItem.service.name",
      sorter: (a, b) =>
        a?.orderItem.service.name?.localeCompare(b?.orderItem.service.name),
      ...getColumnSearchProps("orderItem.service.name", "Dich vụ"),
    },
    {
      title: "Chi nhánh",
      width: 200,
      fixed: "left",
      dataIndex: "orderItem.branch.name",
      key: "orderItem.branch.name",
      sorter: (a, b) =>
        a?.orderItem.branch.name?.localeCompare(b?.orderItem.branch.name),
      ...getColumnSearchProps("orderItem.branch.name", "Dich vụ"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "assetUrls",
      key: "assetUrls",
      width: 150,
      render: (data, record) => {
        // Chuyển đổi dữ liệu ảnh từ mảng đối tượng sang mảng URL
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
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      width: 150,
      filters: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 },
        { text: "4", value: 4 },
        { text: "5", value: 5 },
      ],
      onFilter: (value, record) => record.rating === value,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 150,
      ...getColumnSearchProps("content", "Nội dung"),
    },
    {
      title: "Trả lời của shop",
      dataIndex: "reply",
      key: "reply",
      width: 150,
      ...getColumnSearchProps("reply", "Trả lời"),
    },
    {
      title: "Thời gian đánh giá",
      dataIndex: "createdTime",
      key: "createdTime",
      width: 150,
      sorter: (a, b) => new Date(a.createdTime) - new Date(b.createdTime),
      ...getColumnApprox("createdTime", "Thời gian"),
      render: (data, record) => (
        <>
          <ComDateConverter time>{data}</ComDateConverter>
        </>
      ),
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 150,
    //   // ...getColumnApprox("status", "Trạng thái"),
    // },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center flex-col">
          <ComMenuButonTable
            record={record}
            showModalDetails={() => {
              modalDetail.handleOpen();
              setSelectedData(record);
            }}
            showModalEdit={() => {
              modalEdit.handleOpen();
              setSelectedData(record);
            }}
            showModalDelete={() => {
              ComConfirmDeleteModal(
                `/services`,
                record.id,
                `Bạn có chắc chắn muốn xóa?`,
                reloadData,
                notificationSuccess,
                notificationError
              );
            }}
            // extraMenuItems={extraMenuItems}
            excludeDefaultItems={["edit", "delete"]}
          />
        </div>
      ),
    },
  ];
  const notificationSuccess = () => {
    notificationApi("success", "Thành công", "Đã xóa ");
  };
  const notificationError = () => {
    notificationApi("error", "Lỗi", "Lỗi");
  };
  useImperativeHandle(ref, () => ({
    reloadData,
  }));
  const reloadData = () => {
    table.handleOpenLoading();
    getData(`/feedbacks/business/${user?.businessId}?pageIndex=1&pageSize=9999`)
      .then((e) => {
        const activeItems = e?.data?.data?.items
          ?.filter((item) => item.status === "ACTIVE") // Lọc những item có status là ACTIVE
          ?.sort((a, b) => b.id - a.id); // Sắp xếp theo id giảm dần

        setData(activeItems);
        console.log("====================================");
        console.log(e?.data.data?.items);
        console.log("====================================");
        table.handleCloseLoading();
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
  useEffect(() => {
    reloadData();
  }, []);
  return (
    <div>
      <ComTable
        y={"60vh"}
        x={1020}
        columns={columns}
        dataSource={data}
        loading={table.loading}
      />

      <ComModal
        isOpen={modalDetail?.isModalOpen}
        onClose={modalDetail?.handleClose}
        width={800}
      >
        <DetailFeedback
          selectedFeedback={selectedData}
          tableRef={reloadData}
          onClose={modalDetail?.handleClose}
        />
      </ComModal>
      <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={1000}
      >
        <EditUpgrede
          selectedUpgrede={selectedData}
          tableRef={reloadData}
          onClose={modalEdit?.handleClose}
        />
      </ComModal>
    </div>
  );
});
