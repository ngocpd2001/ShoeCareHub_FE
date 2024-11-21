import React, { useEffect, useState } from "react";
import { useTableState } from "../../../hooks/useTableState";
import { useNotification } from "../../../Notification/Notification";
import { Tag, Modal, Form, Input, Select, InputNumber, message } from "antd";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnFilters from "../../../Components/ComTable/utils";
import { getTicketCategories, getCategoryTicketById, updateTicketCategory } from "../../../api/categoryTicket";
import ComMenuButonTable from "../../../Components/ComMenuButonTable/ComMenuButonTable";
import { useNavigate } from 'react-router-dom';

export const TableCategoryTicket = React.forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const table = useTableState();
  const { notificationApi } = useNotification();
  const { getColumnSearchProps } = useColumnFilters();
  const navigate = useNavigate();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();

  const getStatusColor = (status) => {
    return status === "AVAILABLE" ? "success" : "error";
  };

  const columns = [
    {
      title: "Tên loại khiếu nại",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name", "Tên loại khiếu nại"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: <Tag color="success">Hoạt động</Tag>, value: 'AVAILABLE' },
        { text: <Tag color="error">Ngưng hoạt động</Tag>, value: 'UNAVAILABLE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'AVAILABLE' ? 'Hoạt động' : 'Ngưng hoạt động'}
        </Tag>
      ),
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <ComMenuButonTable
          record={record}
          showModalEdit={() => showUpdateModal(record)}
          excludeDefaultItems={["delete", "details"]}
        />
      ),
    },
  ];

  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);
    reloadData(newPagination);
  };

  const reloadData = async (currentPagination = pagination) => {
    table.handleOpenLoading();
    try {
      const response = await getTicketCategories();
      if (response?.data) {
        const formattedData = response.data.map(item => ({
          id: item.id,
          name: item.name,
          status: item.status
        }));
        setData(formattedData);
        setPagination({
          ...currentPagination,
          total: response.data.length,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      notificationApi("error", "Lỗi", "Không thể tải danh sách loại dịch vụ");
    } finally {
      table.handleCloseLoading();
    }
  };

  const handleUpdate = async (values) => {
    try {
      const updateData = {
        name: values.name.trim(),
        priority: parseInt(values.priority),
        status: values.status
      };

      await updateTicketCategory(selectedCategory.id, updateData);
      notificationApi("success", "Thành công", "Cập nhật loại phiếu thành công");
      setIsUpdateModalVisible(false);
      reloadData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Không thể cập nhật loại phiếu";
      notificationApi("error", "Lỗi", errorMessage);
    }
  };

  const showUpdateModal = async (record) => {
    try {
      const response = await getCategoryTicketById(record.id);
      if (response?.data) {
        const categoryData = response.data;
        setSelectedCategory(categoryData);
        form.setFieldsValue({
          name: categoryData.name,
          priority: parseInt(categoryData.priority),
          status: categoryData.status
        });
        setIsUpdateModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      const errorMessage = error.response?.data?.message || "Không thể lấy thông tin loại phiếu";
      notificationApi("error", "Lỗi", errorMessage);
      setIsUpdateModalVisible(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Expose reloadData method thông qua ref
  React.useImperativeHandle(ref, () => ({
    reloadData
  }));

  const handleFetchCategory = async (id) => {
    try {
      const response = await getCategoryTicketById(id);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        message.error('Không tìm thấy loại phiếu này');
      } else {
        message.error('Có lỗi xảy ra khi lấy thông tin loại phiếu');
      }
      // Sử dụng reloadData thay vì fetchCategories
      reloadData();
      return null;
    }
  };

  const handleEdit = async (record) => {
    try {
      const categoryData = await handleFetchCategory(record.id);
      if (categoryData) {
        setSelectedCategory(categoryData);
        setIsUpdateModalVisible(true);
        form.setFieldsValue(categoryData);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <ComTable
          y={"calc(100vh - 250px)"}
          columns={columns}
          dataSource={data}
          loading={table.loading}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="id"
          bordered
        />
      </div>

      <Modal
        title="Cập nhật loại phiếu"
        open={isUpdateModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsUpdateModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleUpdate}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên loại khiếu nại"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại khiếu nại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: 'Vui lòng nhập độ ưu tiên' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="AVAILABLE">Hoạt động</Select.Option>
              <Select.Option value="UNAVAILABLE">Ngưng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});