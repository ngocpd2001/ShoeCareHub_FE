import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Input, Select, InputNumber, Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getMaterialById, updateMaterial } from '../../../api/material';
import { useNotification } from '../../../Notification/Notification';
import { getBranchByBusinessId } from '../../../api/branch';
import { firebaseImgs } from "../../../upImgFirebase/firebaseImgs";

const { Option } = Select;

const UpdateMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificationApi } = useNotification();
  
  const [formData, setFormData] = useState({
    branchId: [],
    name: '',
    price: 0,
    status: 'available',
    assetUrls: []
  });

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchMaterials, setBranchMaterials] = useState([]);
  const [allBranches, setAllBranches] = useState([]);

  const fetchAllBranches = async () => {
    try {
      const businessId = 1;
    //   console.log('Đang gọi API getBranchByBusinessId với businessId:', businessId);
      const response = await getBranchByBusinessId(businessId);
    //   console.log('Kết quả API getBranchByBusinessId:', response);
      setAllBranches(response.data || []);
    } catch (error) {
      console.error('Lỗi khi gọi API getBranchByBusinessId:', error);
      notificationApi('error', 'Lỗi', 'Không thể tải danh sách chi nhánh');
    }
  };

  const fetchMaterialData = async () => {
    try {
      const response = await getMaterialById(id);
      const materialData = response.data;

      setFormData({
        branchId: materialData.branchMaterials?.map(bm => bm.branch.id) || [],
        name: materialData.name || '',
        price: materialData.price || 0,
        status: materialData.status === 'Hoạt Động' ? 'available' : 'unavailable',
        assetUrls: materialData.assetUrls || []
      });

      setBranchMaterials(materialData.branchMaterials || []);

      if (materialData.assetUrls && materialData.assetUrls.length > 0) {
        const files = materialData.assetUrls.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url,
          type: 'image'
        }));
        setFileList(files);
      }
    } catch (error) {
      notificationApi('error', 'Lỗi', 'Không thể tải thông tin vật liệu');
    }
  };

  useEffect(() => {
    fetchMaterialData();
    fetchAllBranches();
  }, [id]);

  const handleInputChange = (name, value) => {
    if (name === 'price') {
      const numericValue = Math.max(0, Number(value) || 0);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async ({ fileList: newFileList }) => {
    try {
      setLoading(true);
      
      // Xử lý từng file một
      for (let i = 0; i < newFileList.length; i++) {
        const file = newFileList[i];
        
        // Nếu là file mới và chưa có URL
        if (file.originFileObj && !file.url) {
          try {
            const uploadedUrls = await firebaseImgs([file.originFileObj]);
            newFileList[i] = {
              ...file,
              status: 'done',
              url: uploadedUrls[0]
            };
          } catch (error) {
            console.error('Lỗi upload file:', error);
            continue;
          }
        }
      }

      // Cập nhật fileList
      setFileList(newFileList);

      // Lấy tất cả URLs từ fileList
      const urls = newFileList
        .map(file => file.url)
        .filter(Boolean); // Lọc bỏ các giá trị undefined/null

      console.log('URLs mới:', urls);

      // Cập nhật formData
      setFormData(prev => ({
        ...prev,
        assetUrls: urls
      }));

    } catch (error) {
      console.error('Lỗi xử lý ảnh:', error);
      notificationApi('error', 'Lỗi', 'Không thể xử lý ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Kiểm tra dữ liệu
      if (!formData.name || formData.price < 0 || formData.branchId.length === 0) {
        notificationApi('error', 'Lỗi', 'Vui lòng điền đầy đủ thông tin');
        return;
      }

      // Chuẩn bị dữ liệu gửi đi
      const submitData = {
        name: formData.name,
        price: Number(formData.price), // Đảm bảo price là số
        status: formData.status === 'available' ? 'Hoạt Động' : 'Ngưng Hoạt Động', // Chuyển đổi status sang tiếng Việt
        branchId: formData.branchId.map(id => Number(id)), // Đảm bảo branchId là mảng số
        assetUrls: Array.isArray(formData.assetUrls) ? formData.assetUrls : [] // Đảm bảo assetUrls là mảng
      };

      // Log để kiểm tra
      console.log('Dữ liệu gửi đi:', submitData);

      Modal.confirm({
        title: 'Xác nhận cập nhật',
        content: 'Bạn có chắc chắn muốn cập nhật thông tin vật liệu này?',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            const response = await updateMaterial(id, submitData);
            console.log('Phản hồi từ API:', response); // Thêm log để kiểm tra response
            
            if (response && response.data) {
              notificationApi('success', 'Thành công', 'Cập nhật vật liệu thành công');
              navigate('/owner/material');
            }
          } catch (error) {
            console.error('Chi tiết lỗi:', error.response?.data || error);
            throw error;
          }
        }
      });

    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      notificationApi('error', 'Lỗi', 'Không thể cập nhật vật liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-blue-800">
          Cập nhật vật liệu
        </h2>
        <Breadcrumb
          separator=">"
          items={[
            { title: "Cửa hàng" },
            { title: <Link to="/owner/material">Vật liệu</Link> },
            { title: <span className="text-[#002278]">Cập nhật vật liệu</span> },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Tên vật liệu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên vật liệu
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nhập tên vật liệu"
            />
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá
            </label>
            <InputNumber
              className="w-full"
              value={formData.price}
              onChange={(value) => handleInputChange('price', value)}
              min={0}
              step={1000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập giá"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <Select
              className="w-full"
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
            >
              <Option value="available">Hoạt động</Option>
              <Option value="unavailable">Ngưng hoạt động</Option>
            </Select>
          </div>

          {/* Phần chỉ hiển thị thông tin storage - không thể update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng trong kho
            </label>
            <div className="bg-gray-50 p-4 rounded">
              <span className="text-lg font-medium">
                {branchMaterials.reduce((total, bm) => total + (bm.storage || 0), 0)}
              </span>
            </div>
          </div>

          {/* Phần có thể update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn chi nhánh
            </label>
            <Select
              mode="multiple"
              className="w-full"
              value={formData.branchId}
              onChange={(value) => handleInputChange('branchId', value)}
              placeholder="Chọn chi nhánh"
            >
              {allBranches.map(branch => (
                <Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh
            </label>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              maxCount={5}
              beforeUpload={() => false}
              accept="image/*"
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div className="mt-2">Tải lên</div>
                </div>
              )}
            </Upload>
          </div>
        </div>

        {/* Nút submit */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => navigate('/owner/material')}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMaterial;