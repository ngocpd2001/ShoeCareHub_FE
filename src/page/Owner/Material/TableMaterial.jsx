import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useNotification } from "../../../Notification/Notification";
import { useNavigate, useLocation } from "react-router-dom";
import { Image } from "antd";

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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const table = useTableState();
  const { notificationApi } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const {
    getColumnSearchProps,
    getColumnPriceRangeProps,
    getColumnFilterProps,
  } = useColumnFilters();

  const columns = [
    {
      title: "Tên phụ kiện",
      dataIndex: "name",
      key: "name",
      width: 250,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name", "Tên phụ kiện"),
      
    },
    {
      title: "Hình ảnh",
      dataIndex: "assetUrls",
      key: "assetUrls",
      width: 150,
      render: (data, record) => {
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
        <div>
          <ul className="space-y-1">
            {branchMaterials?.map((bm, index) => (
              <li key={index} className="flex items-center gap-2">
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
        { text: "Hoạt Động", value: "Hoạt Động" },
        { text: "Ngưng Hoạt Động", value: "Ngưng Hoạt Động" },
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

  const handleTableChange = async (newPagination, filters, sorter) => {
    table.handleOpenLoading();
    try {
      const businessId = getBusinessId();
      const response = await getMaterialsByBusiness(
        businessId,
        newPagination.current,
        newPagination.pageSize
      );

      if (response?.data) {
        setData(response.data.items || []);
        setPagination({
          current: response.data.pageIndex,
          pageSize: response.data.pageSize,
          total: response.data.totalCount,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu vật liệu");
    } finally {
      table.handleCloseLoading();
    }
  };

  const reloadData = async () => {
    table.handleOpenLoading();
    try {
      const businessId = getBusinessId();
      if (!businessId) {
        notificationApi("error", "Lỗi", "Vui lòng đăng nhập lại để tiếp tục");
        navigate("/login");
        return;
      }

      const response = await getMaterialsByBusiness(
        businessId,
        pagination.current,
        pagination.pageSize
      );
      if (response?.data) {
        setData(response.data.items || []);
        setPagination({
          current: response.data.pageIndex,
          pageSize: response.data.pageSize,
          total: response.data.totalCount,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      notificationApi("error", "Lỗi", "Không thể tải dữ liệu vật liệu");
      setData([]);
    } finally {
      table.handleCloseLoading();
    }
  };

  const getBusinessId = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      return null;
    }
    return JSON.parse(userData)?.businessId;
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
        y={"50vh"}
        x={1020}
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        loading={table.loading}
        rowKey="id"
        bordered
        className="w-full"
        onChange={handleTableChange}
      />
    </div>
  );
});

