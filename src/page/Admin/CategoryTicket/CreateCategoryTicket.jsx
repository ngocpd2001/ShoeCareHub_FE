import React, { useState } from "react";
import { Form, Input, Modal, message } from "antd";
import { createTicketCategory } from "../../../api/categoryTicket";
import { useNavigate } from "react-router-dom";

export default function CreateCategoryTicket({ open, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await createTicketCategory(values);
      message.success("Tạo danh mục thành công");
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/ticket-category');
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title="Thêm danh mục khiếu nại"
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Độ ưu tiên"
          name="priority"
          rules={[{ required: true, message: "Vui lòng nhập độ ưu tiên" }]}
        >
          <Input type="number" placeholder="Nhập độ ưu tiên" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 border rounded"
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tạo mới"}
            </button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
