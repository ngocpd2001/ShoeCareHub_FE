import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import TableBusiness from './TableBusiness';
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function BusinessManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Quản lý doanh nghiệp</h3>
          {/* <Breadcrumb
            items={[
              {
                title: <span className="text-lg">Doanh nghiệp</span>,
              },
            ]}
          /> */}
        </div>
        {/* <div>
          <ComButton onClick={() => navigate("/admin/store/create")}>
            + Thêm doanh nghiệp
          </ComButton>
        </div> */}
      </div>
      <TableBusiness ref={tableRef} />
    </>
  );
}