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

import ComModal from "../../../Components/ComModal/ComModal";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComConfirmDeleteModal from "../../../Components/ComConfirmDeleteModal/ComConfirmDeleteModal";
import { getData } from "../../../api/api";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { useStorage } from "../../../hooks/useLocalStorage";
import UpdateCategoryService from "./UpdateCategoryService";

export const TableCategoryService = forwardRef((props, ref) => {
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
      title: "Tên danh mục",
      width: 100,
      // fixed: "left",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a?.name?.localeCompare(b?.name),
      ...getColumnSearchProps("name", "Tên danh mục"),
    },

    // {
    //   title: "Hình ảnh",
    //   dataIndex: "thumbnail",
    //   key: "thumbnail",
    //   width: 50,
    //   render: (_, record) => (
    //     <>
    //       <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
    //         <Image
    //           wrapperClassName=" w-full h-full object-cover object-center flex items-center justify-center "
    //           src={record?.thumbnail}
    //           alt={record?.thumbnail}
    //           preview={{ mask: "Xem ảnh" }}
    //         />
    //       </div>
    //     </>
    //   ),
    // },
    // {
    //   title: "Địa chỉ",
    //   dataIndex: "province",
    //   key: "province",
    //   width: 150,
    //   // ...getColumnSearchProps("province", "Nội dung"),
    //   render: (_, record) => (
    //     <>
    //       <p className="">
    //         {record.address} ,{record.ward}
    //       </p>
    //       <p className="">
    //         {record.province} ,{record.district}
    //       </p>
    //     </>
    //   ),
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 50,
      ...getColumnSearchProps("status", "Trạng thái"),
      render: (_, record) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            record.status === "Hoạt Động"
              ? "bg-green-100 text-green-600 text-lg text-center"
              : "bg-gray-100 text-gray-600 text-lg text-center"
          }`}
        >
          {record.status}
        </span>
      ),
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      align: "center",
      width: 30,
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
                `/categories`,
                record.id,
                `Bạn có chắc chắn muốn xóa?`,
                reloadData,
                notificationSuccess,
                notificationError,
                "put"
              );
            }}
            excludeDefaultItems={["details", "delete", "reject", "accept"]}
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
    getData(`/categories?PageIndex=1&PageSize=101`)
      .then((e) => {
        setData(e?.data?.data?.items);
        console.log("====================================");
        console.log("ok", e?.data);
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
        y={"50vh"}
        // x={1020}
        x
        columns={columns}
        dataSource={data}
        loading={false}
      />

      <ComModal
        isOpen={modalDetail?.isModalOpen}
        onClose={modalDetail?.handleClose}
        width={800}
      >
        {/* <DetailBranch selectedData={selectedData} /> */}
      </ComModal>
      <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={800}
      >
        <UpdateCategoryService
          selectedData={selectedData}
          tableRef={reloadData}
          onClose={modalEdit?.handleClose}
        />
      </ComModal>
    </div>
  );
});
