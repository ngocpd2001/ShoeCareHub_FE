import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableMaterial } from './TableMaterial';
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function MaterialManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Nguyên liệu</h3>
          <Breadcrumb
            items={[
              {
                title: <span className="text-base">Cửa hàng</span>,
              },
              {
                title: <span className="text-base text-[#002278]">Nguyên liệu</span>,
              },
            ]}
          />
        </div>
      </div>
      <TableMaterial ref={tableRef} />
    </>
  );
}
