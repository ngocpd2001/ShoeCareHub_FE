import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ComModal from "../../Components/ComModal/ComModal";
import CreateAddressesUser from "./CreateAddressesUser";
import { useModalState } from "./../../hooks/useModalState";
import { useStorage } from "../../hooks/useLocalStorage";
import { deleteData, getData, putData } from "../../api/api";
import confirm from "antd/es/modal/confirm";
import { Modal } from "antd";

export default function AddressesUser() {
  const modal = useModalState();
  const [user, setUser] = useStorage("user", null);
  const [data, setData] = useState([]);

  const setDefaultAddress = (id) => {
    // Hiển thị modal xác nhận của Ant Design
    Modal.confirm({
      title: "Xác nhận thay đổi địa chỉ mặc định",
      content: "Bạn có chắc chắn muốn đổi địa chỉ mặc định không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk() {
        // Nếu người dùng xác nhận
        putData(`/addresses`, `${id}/default`)
          .then((data) => {
            console.log(data);
            getdataaddresses(); // Gọi hàm getData để làm mới dữ liệu sau khi đổi
          })
          .catch((error) => {
            console.log(error);
          });
      },
      onCancel() {
        console.log("Hủy thao tác đổi địa chỉ mặc định."); // Nếu người dùng hủy
      },
    });
  };

      const setDeleteAddress = (id) => {
        // Hiển thị modal xác nhận của Ant Design
        Modal.confirm({
          title: "Xác nhận xóa",
          content: "Bạn có chắc chắn muốn xóa địa chỉ này không?",
          okText: "Xác nhận",
          okType: "danger",
          cancelText: "Hủy",
          onOk() {
            // Nếu người dùng xác nhận
            deleteData(`/addresses`, `${id}`)
              .then((data) => {
                console.log(data);
                getdataaddresses(); // Gọi hàm getData để làm mới dữ liệu sau khi đổi
              })
              .catch((error) => {
                console.log(error);
              });
          },
          onCancel() {
            console.log("Hủy thao tác đổi địa chỉ mặc định."); // Nếu người dùng hủy
          },
        });
      };
  const getdataaddresses = () => {
    getData(`/addresses/account/${user.id}`)
      .then((data) => {
        setData(data?.data.data);
        console.log(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getdataaddresses();
  }, []);


  return (
    <div className="pb-4 mb-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1   sm:pt-1 sm:pb-6 sm:px-6 ">
      <div className=" mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-gray-900">
            Địa chỉ của tôi
          </h1>
          <button
            onClick={modal.handleOpen}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900  text-white rounded-md hover:bg-blue-600  transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm địa chỉ mới
          </button>
        </div>
        <ComModal
          width={800}
          isOpen={modal?.isModalOpen}
          onClose={modal?.handleClose}
        >
          <CreateAddressesUser
            onClose={modal?.handleClose}
            tableRef={() => {}}
          />
        </ComModal>
        <div className="space-y-4">
          {data.map((address) => (
            <div
              key={address.id}
              className="border-b-2 border-gray-200  p-4 bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {address.isDefault && (
                    <span className="px-2 py-1 text-sm text-red-500 border border-red-500 rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-blue-500 hover:text-blue-700 text-sm">
                    Cập nhật
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => setDeleteAddress(address.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              <div className="text-gray-600 mb-3">
                <p>{address.address}</p>
                <p>
                  {address.ward}, {address.district}, {address.province}
                </p>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => setDefaultAddress(address.id)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                >
                  Thiết lập mặc định
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
