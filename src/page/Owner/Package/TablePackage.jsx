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

import DetailService from "./DetailService";
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
  // Định dạng số thành tiền tệ Việt Nam
  if (typeof number === "number") {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } else if (typeof number === "string" && !isNaN(Number(number))) {
    return Number(number).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } else {
    return number;
  }
}
export const TablePackage = forwardRef((props, ref) => {
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
      title: "Mã gói",
      width: 100,
      // fixed: "left",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id", "Mã gói"),
    },
    {
      title: "Tên gói",
      width: 200,
      // fixed: "left",
      dataIndex: "packName",
      key: "packName",
      sorter: (a, b) => a?.packName?.localeCompare(b?.packName),
      ...getColumnSearchProps("packName", "Dich vụ"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
      width: 150,
      ...getColumnPriceRangeProps("balance", "Giá tiền"),
      render: (text, record) => <>{formatCurrency(record.balance)}</>,
    },
    {
      title: "Thanh toán bằng",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 150,
      ...getColumnSearchProps("paymentMethod", "Thanh toán bằng"),
    },

    {
      title: "Thời gian giao dịch",
      dataIndex: "processTime",
      key: "processTime",
      width: 150,
      sorter: (a, b) => new Date(a.processTime) - new Date(b.processTime),
      ...getColumnApprox("processTime", "Thời gian"),
      render: (data, record) => (
        <>
          <ComDateConverter>{data}</ComDateConverter>
        </>
      ),
    },
    {
      title: "Trạng thái ",
      width: 100,
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Thành công", value: "COMPLETED" },
        { text: "Thất bại", value: "FAILED" },
        { text: "Chờ thanh toán", value: "PROCESSING" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => (
        <div>
          {record.status === "COMPLETED" && "Thành công"}
          {record.status === "FAILED" && "Thất bại"}
          {record.status === "PROCESSING" && "Chờ thanh toán"}
        </div>
      ),
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 150,
    // ...getColumnApprox("status", "Trạng thái"),
    // },
    // {
    //   title: "",
    //   key: "operation",
    //   fixed: "right",
    //   width: 100,
    //   render: (_, record) => (
    //     <div className="flex items-center flex-col">
    //       <ComMenuButonTable
    //         record={record}
    //         showModalDetails={() => {
    //           modalDetail.handleOpen();
    //           setSelectedData(record);
    //         }}
    //         showModalEdit={() => {
    //           modalEdit.handleOpen();
    //           setSelectedData(record);
    //         }}
    //         showModalDelete={() => {
    //           ComConfirmDeleteModal(
    //             `/services`,
    //             record.id,
    //             `Bạn có chắc chắn muốn xóa?`,
    //             reloadData,
    //             notificationSuccess,
    //             notificationError
    //           );
    //         }}
    //         // extraMenuItems={extraMenuItems}
    //         excludeDefaultItems={["details", "edit", "delete"]}
    //       />
    //     </div>
    //   ),
    // },
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
    getData(
      `/transactions?AccountId=${user?.id}&IsDecsending=false&PageSize=1000&PageNum=1`
    )
      .then((e) => {
        const activeItems = e?.data?.data;
        setData(activeItems);
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
        <DetailService selectedUpgrede={selectedData} />
      </ComModal>
    </div>
  );
});
