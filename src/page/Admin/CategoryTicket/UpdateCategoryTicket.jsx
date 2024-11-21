import React from "react";
import { Modal, Form, Input, Select, InputNumber, message } from "antd";

const UpdateCategoryTicket = ({ 
  isVisible, 
  onClose, 
  onUpdate, 
  initialValues,
  form 
}) => {
  const handleUpdate = async (values) => {
    try {
      const payload = {
        updateTicketCategoryRequest: {
          name: values.name,
          priority: values.priority,
          status: values.status
        }
      };
      await onUpdate(payload);
      message.success('Cập nhật thành công');
      onClose();
    } catch (error) {
      if (error.response?.data?.message === "Tên Loại Phiếu Đã Tồn Tại!") {
        message.error('Tên loại phiếu đã tồn tại, vui lòng chọn tên khác');
      } else {
        message.error('Có lỗi xảy ra khi cập nhật');
      }
    }
  };

  return (
    <Modal
      title="Cập nhật loại phiếu"
      open={isVisible}
      onOk={() => form.submit()}
      onCancel={onClose}
      className="w-[500px]"
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        layout="vertical"
        initialValues={initialValues}
        className="p-4"
      >
        <Form.Item
          name="name"
          label="Tên loại khiếu nại"
          rules={[{ required: true, message: 'Vui lòng nhập tên loại khiếu nại' }]}
          className="mb-4"
        >
          <Input className="w-full rounded-md" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Độ ưu tiên"
          rules={[
            { required: true, message: 'Vui lòng nhập độ ưu tiên' },
            { type: 'number', min: 1, message: 'Độ ưu tiên phải lớn hơn hoặc bằng 1' },
            { type: 'number', max: 5, message: 'Độ ưu tiên không được vượt quá 5' }
          ]}
          className="mb-4"
        >
          <InputNumber 
            min={1} 
            max={5}
            keyboard={false}
            className="w-full rounded-md"
            formatter={(value) => {
              const val = Number(value);
              if (val > 5) return '5';
              if (val < 1) return '1';
              return value;
            }}
            parser={(value) => {
              const val = Number(value);
              if (val > 5) return 5;
              if (val < 1) return 1;
              return val;
            }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          className="mb-4"
        >
          <Select className="w-full rounded-md">
            <Select.Option value="AVAILABLE">Hoạt động</Select.Option>
            <Select.Option value="UNAVAILABLE">Ngưng hoạt động</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCategoryTicket; 