import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { createOrderDetail } from "../../../api/order";
import { getServiceByBranchId } from "../../../api/branch";
import { getMaterialByServiceId } from "../../../api/material";

const { Option } = Select;

const CreateOrderDetailPopup = ({
  visible,
  onCancel,
  orderId,
  branchId,
  onServiceAdded,
}) => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [materials, setMaterials] = useState([]);

  const fetchServices = async (branchId) => {
    try {
      const response = await getServiceByBranchId(branchId);
      const activeServices = response.data.items.filter(
        (service) => service.status !== "INACTIVE"
      );
      setServices(activeServices);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
    }
  };

  const fetchMaterials = async (serviceId) => {
    console.log("serviceId gửi vào:", serviceId);
    if (!serviceId) {
      console.warn("serviceId không hợp lệ");
      setMaterials([]);
      return;
    }
    try {
      const response = await getMaterialByServiceId(serviceId);
      console.log("Dữ liệu vật liệu nhận được:", response.data);
      if (Array.isArray(response.data.items)) {
        setMaterials(response.data.items);
      } else {
        console.warn("Dữ liệu không phải là mảng:", response.data);
        setMaterials([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách vật liệu:", error);
      setMaterials([]);
    }
  };

  useEffect(() => {
    // console.log("Order ID:", orderId);
    form.setFieldsValue({ orderId, branchId });
  }, [orderId, branchId, form]);

  useEffect(() => {
    if (branchId) {
      fetchServices(branchId);
    }
  }, [branchId]);

  const onCreate = async (values) => {
    try {
      const payload = {
        orderId: orderId || 0,
        branchId: branchId || 0,
        serviceId: values.serviceId || 0,
        materialId: values.materialId || 0,
      };
      console.log("Payload gửi đi:", payload);
      const response = await createOrderDetail(payload);
      console.log("Chi tiết đơn hàng đã được tạo:", response);
      form.resetFields();
      onCancel();
      onServiceAdded();
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
          name="serviceId"
          label="Dịch vụ"
          rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}
        >
          <Select
            placeholder="Chọn dịch vụ"
            showSearch
            onChange={fetchMaterials}
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {services.map((service) => (
              <Option key={service.id} value={service.id}>
                {service.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="materialId"
          label="Mã vật liệu"
          rules={[{ required: true, message: "Vui lòng nhập mã vật liệu!" }]}
        >
          <Select
            placeholder="Chọn vật liệu"
            showSearch
            disabled={materials.length === 0}
            filterOption={(input, option) =>
              (option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {materials.length === 0 ? (
              <Option disabled>{`Dịch vụ không có vật liệu`}</Option>
            ) : (
              materials.map((material) => (
                <Option key={material.id} value={material.id}>
                  {material.name}
                </Option>
              ))
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrderDetailPopup;
