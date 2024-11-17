import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useModalState } from "../../../hooks/useModalState";
import { Image } from "antd";
import { useNotification } from "../../../Notification/Notification";
import { useNavigate } from "react-router-dom";

import ComModal from "../../../Components/ComModal/ComModal";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComConfirmDeleteModal from "../../../Components/ComConfirmDeleteModal/ComConfirmDeleteModal";
import { getData } from "../../../api/api";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { useStorage } from "../../../hooks/useLocalStorage";
import { getServiceByBranchId } from "../../../api/branch";

function formatCurrency(number) {
  if (typeof number === "number") {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
}

export const TableService_Emp = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const { employeeId } = props;
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const table = useTableState();
  const modalDetail = useModalState();
  const modalEdit = useModalState();
  const { notificationApi } = useNotification();
  const [user, setUser] = useStorage("user", null);

  const {
    getColumnSearchProps,
    getColumnPriceRangeProps,
    getColumnApprox,
  } = useColumnFilters();

  const statusColors = {
    "Hoạt Động": "text-green-600 bg-green-50 rounded-full px-3 py-1",
    "Ngưng Hoạt Động": "text-red-600 bg-red-50 rounded-full px-3 py-1"
  };

  const columns = [
    {
      title: "Dịch vụ",
      width: 200,
      fixed: "left",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a?.name?.localeCompare(b?.name),
      ...getColumnSearchProps("name", "Dịch vụ"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "assetUrls",
      key: "assetUrls",
      width: 150,
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
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 150,
      ...getColumnSearchProps("category.name", "Nội dung"),
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      key: "price",
      width: 150,
      sorter: (a, b) => a.price - b.price,
      ...getColumnPriceRangeProps("price"),
      render: (_, record) => (
        <div>
          <h1>{formatCurrency(record.price)}</h1>
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "promotion",
      key: "promotion.newPrice",
      width: 150,
      ...getColumnPriceRangeProps("promotion.newPrice", "giá"),
      render: (e, record) => (
        <div>
          <h1>
            {record?.promotion?.newPrice
              ? formatCurrency(record?.promotion?.newPrice)
              : formatCurrency(record.price)}
          </h1>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createTime",
      key: "createTime",
      width: 150,
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      ...getColumnApprox("createTime", "Ngày tạo"),
    },
    {
      title: "Đơn hàng",
      dataIndex: "orderedNum",
      key: "orderedNum",
      sorter: (a, b) => a.orderedNum - b.orderedNum,
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: [
        { text: "Hoạt Động", value: "Hoạt Động" },
        { text: "Ngưng Hoạt Động", value: "Ngưng Hoạt Động" }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <div className={`inline-block ${statusColors[status]}`}>
          {status === "Hoạt Động" ? "Hoạt động" : "Ngưng hoạt động"}
        </div>
      )
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center flex-col">
          {/* <ComMenuButonTable
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
                `/employee-services`,
                record.id,
                `Bạn có chắc chắn muốn xóa dịch vụ này?`,
                reloadData,
                notificationSuccess,
                notificationError
              );
            }}
            excludeDefaultItems={["eidt", "delete"]}
          /> */}
                <ComMenuButonTable
            record={record}
            showModalDetails={() => {
              const serviceId = record.id;
              navigate(`/employee/service/${serviceId}`);
            }}
            excludeDefaultItems={["delete", "edit"]} 
          />
        </div>
      ),
    },
  ];

  const notificationSuccess = () => {
    notificationApi("success", "Thành công", "Đã xóa dịch vụ");
  };

  const notificationError = () => {
    notificationApi("error", "Lỗi", "Không thể xóa dịch vụ");
  };

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  const reloadData = () => {
    table.handleOpenLoading();
    console.log("Đang gọi API với branchId:", user?.branchId);
    
    getServiceByBranchId(user?.branchId)
      .then((response) => {
        const items = response?.data?.items || [];
        console.log("Dữ liệu API trả về:", response?.data);
        setData(items.sort((a, b) => b.id - a.id));
        console.log("Dữ liệu sau khi set:", items);
        table.handleCloseLoading();
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        table.handleCloseLoading();
      });
  };

  useEffect(() => {
    console.log("user?.branchId changed:", user?.branchId);
    if (user?.branchId) {
      reloadData();
    }
  }, [user?.branchId]);

  return (
    <div>
      <ComTable
        y={"60vh"}
        x={1020}
        columns={columns}
        dataSource={data}
        loading={table.loading}
      />

      {/* <ComModal
        isOpen={modalDetail?.isModalOpen}
        onClose={modalDetail?.handleClose}
        width={800}
      >
        <DetailService selectedUpgrede={selectedData} />
      </ComModal>

      <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={1000}
      >
        <EditService
          selectedUpgrede={selectedData}
          tableRef={reloadData}
          onClose={modalEdit?.handleClose}
        />
      </ComModal> */}
    </div>
  );
});