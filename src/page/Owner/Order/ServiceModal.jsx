import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { createOrderDetail } from "../../../api/order";
import { getServiceByBranchId } from "../../../api/branch";

const { Option } = Select;

const CreateOrderDetailPopup = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);

  const fetchServices = async (branchId) => {
    try {
      const response = await getServiceByBranchId(branchId);
      setServices(response.data.items);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
    }
  };

  useEffect(() => {
    const branchId = form.getFieldValue("branchId");
    if (branchId) {
      fetchServices(branchId);
    }
  }, [form]);

  const onCreate = async (values) => {
    try {
      const response = await createOrderDetail(values);
      console.log("Chi tiết đơn hàng đã được tạo:", response);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Lỗi khi tạo chi tiết đơn hàng:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      title={<span className="text-[#002278]">Tạo thêm dịch vụ</span>}
      okText="Tạo"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="orderId"
          label="Mã đơn hàng"
          rules={[{ required: true, message: "Vui lòng nhập mã đơn hàng!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="branchId"
          label="Chi nhánh"
          rules={[{ required: true, message: "Vui lòng nhập chi nhánh!" }]}
        >
          <Input onChange={(e) => fetchServices(e.target.value)} />
        </Form.Item>
        <Form.Item
          name="serviceId"
          label="Dịch vụ"
          rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}
        >
          <Select placeholder="Chọn dịch vụ">
            {services.map((service) => (
              <Option key={service.id} value={service.id}>
                {service.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* <Form.Item
          name="materialId"
          label="Material ID"
          rules={[{ required: true, message: 'Vui lòng chọn Material ID!' }]}
        >
          <Select placeholder="Chọn Material ID">
            <Option value="1">Material 1</Option>
            <Option value="2">Material 2</Option>
          </Select>
        </Form.Item> */}
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrderDetailPopup;
