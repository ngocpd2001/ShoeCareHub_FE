import React, { useRef, useEffect, useState } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableMaterial } from './TableMaterial';
import { Breadcrumb, Modal } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../../../Notification/Notification";
import { getBusinessById } from "../../../api/businesses";
import { XCircle } from "lucide-react";

export default function MaterialManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const { notificationApi } = useNotification();
  const [business, setBusiness] = useState(null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      if (user?.businessId) {
        const businessData = await getBusinessById(user.businessId);
        setBusiness(businessData);
      }
    };

    fetchBusiness();
  }, [user?.businessId]);

  const handleAddMaterial = () => {
    if (business && !business.isMaterialSupported) {
      Modal.error({
        content: (
          <div className="flex flex-col justify-center items-center">
            <span className="text-yellow-600">Vui lòng nâng cấp gói đăng ký để sử dụng tính năng thêm phụ kiện.</span>
            <button onClick={() => Modal.destroyAll()} className="border-none bg-transparent cursor-pointer absolute top-2 right-2.5">
              <XCircle className="text-orange-500" />
            </button>
          </div>
        ),
        okText: <span className="text-white">Đăng ký gói tính năng</span>,
        onOk: () => {
          navigate("/owner/feature-packs");
        },
        centered: true,
        icon: null,
        className: "w-[300px] p-4",
      });
      return;
    } else {
      navigate("/owner/material/create");
    }
  };

  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Phụ kiện</h3>
          <Breadcrumb
            items={[
              {
                title: <span className="text-base">Cửa hàng</span>,
              },
              {
                title: <span className="text-base text-[#002278]">Phụ kiện</span>,
              },
            ]}
          />
        </div>
        <div>
          <ComButton onClick={handleAddMaterial}>
            + Thêm phụ kiện
          </ComButton>
        </div>
      </div>
      <TableMaterial ref={tableRef} />
    </>
  );
}
