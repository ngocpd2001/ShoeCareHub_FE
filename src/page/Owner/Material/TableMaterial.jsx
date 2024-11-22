import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useNotification } from "../../../Notification/Notification";
import { useNavigate, useLocation } from "react-router-dom";

import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { getMaterialsByBusiness } from "../../../api/material";

function formatCurrency(number) {
  if (typeof number === "number") {
    return number.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
}

export const TableMaterial = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const table = useTableState();
  const { notificationApi } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    getColumnSearchProps,
    getColumnPriceRangeProps,
    getColumnFilterProps,
  } = useColumnFilters();

  const columns = [
    {
      title: "Tên vật liệu",
      dataIndex: "name",
      key: "name",
      width: 250,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name", "Tên vật liệu"),
      render: (text, record) => (
        <div className="flex items-center gap-3">
          {record.assetUrls?.[0]?.url ? (
            <img
              src={record.assetUrls[0].url}
              alt={text}
              className="w-10 h-10 object-cover rounded-md"
              onError={(e) => {
                e.target.parentNode.replaceChild(
                  document.createTextNode("No image"),
                  e.target
                );
              }}
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      sorter: (a, b) => a.price - b.price,
      ...getColumnPriceRangeProps("price", "Giá"),
      render: (text) => formatCurrency(text),
    },
    {
      title: "Chi nhánh",
      dataIndex: "branchMaterials",
      key: "branchName",
      width: 250,
      render: (branchMaterials) => (
        <div className="max-h-20 overflow-y-auto">
          <ul className="space-y-1">
            {branchMaterials?.map((bm, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {bm.branch.name}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "Số lượng trong kho",
      dataIndex: "branchMaterials",
      key: "storage",
      width: 150,
      render: (branchMaterials) => (
        <ul>
          {branchMaterials?.map((bm, index) => (
            <li key={index}>
              {bm.storage}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: [
        { text: 'Hoạt Động', value: 'Hoạt Động' },
        { text: 'Ngưng Hoạt Động', value: 'Ngưng Hoạt Động' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === "Hoạt Động"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <div className="flex items-center flex-col">
          <ComMenuButonTable
            record={record}
            showModalEdit={() => {
              navigate(`/owner/material/update/${record.id}`);
            }}
            excludeDefaultItems={["delete", "details"]}
          />
        </div>
      ),
    },
  ];

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  const reloadData = async () => {
    table.handleOpenLoading();
    try {
      const response = await getMaterialsByBusiness(1);
      setData(response.data.items);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu vật liệu");
      setData([]);
    } finally {
      table.handleCloseLoading();
    }
  };

  useEffect(() => {
    if (location.state?.refresh) {
      reloadData();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      reloadData();
    }
  }, [location.state, navigate]);

  return (
    <div>
      <ComTable
        y={"calc(100vh - 200px)"}
        x={1020}
        columns={columns}
        dataSource={data}
        loading={table.loading}
        rowKey="id"
        bordered
        className="w-full"
      />
    </div>
  );
});