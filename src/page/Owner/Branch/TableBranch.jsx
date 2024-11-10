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

import DetailBranch from "./DetailBranch";
import EditBranch from "./EditBranch";
import ComModal from "../../../Components/ComModal/ComModal";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComConfirmDeleteModal from "../../../Components/ComConfirmDeleteModal/ComConfirmDeleteModal";
import { getData } from "../../../api/api";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { useStorage } from "../../../hooks/useLocalStorage";

export const TableBranch = forwardRef((props, ref) => {
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
      title: "Tên",
      width: 100,
      // fixed: "left",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a?.name?.localeCompare(b?.name),
      ...getColumnSearchProps("name", "Tên chi nhánh"),
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
    {
      title: "Địa chỉ",
      dataIndex: "province",
      key: "province",
      width: 150,
      // ...getColumnSearchProps("province", "Nội dung"),
      render: (_, record) => (
        <>
          <p className="">
            {record.address} ,{record.ward}
          </p>
          <p className="">
            {record.province} ,{record.district}
          </p>
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 50,
      ...getColumnSearchProps("status", "Trạng thái"),
      render: (_, record) => (
        // <>
        //   <div className="">
        //     {record.status === "ACTIVE" ? (
        //       <div className="  bg-green-200 rounded-full text-lg text-center text-green-600">
        //         Hoạt động
        //       </div>
        //     ) : (
        //       <div className="  bg-slate-400 rounded-full text-lg text-center text-black">
        //         Tạm ngưng
        //       </div>
        //     )}
        //   </div>
        // </>

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            record.status === "ACTIVE"
              ? "bg-green-100 text-green-600 text-lg text-center"
              : "bg-gray-100 text-gray-600 text-lg text-center"
          }`}
        >
          {record.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
        </span>
      ),
    },
    {
      title: "Action",
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
                `/branches`,
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
    getData(`/branches/business/${user.businessId}`)
      .then((e) => {
        setData(e?.data?.data);
        console.log("====================================");
        console.log(e?.data);
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
        <DetailBranch selectedData={selectedData} />
      </ComModal>
      <ComModal
        isOpen={modalEdit?.isModalOpen}
        onClose={modalEdit?.handleClose}
        width={800}
      >
        <EditBranch
          selectedData={selectedData}
          tableRef={reloadData}
          onClose={modalEdit?.handleClose}
        />
      </ComModal>
    </div>
  );
});
