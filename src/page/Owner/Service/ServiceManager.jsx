import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableService } from "./TableService";
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function ServiceManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Dịch vụ</h3>
          <Breadcrumb
            items={[
              {
                title: <span className="text-base">Cửa hàng</span>,
              },
              {
                title: <span className="text-base text-[#002278]">Dịch vụ</span>,
              },
            ]}
          />
        </div>
        <div>
          <ComButton onClick={() => navigate("/owner/service/create")}>
            + Thêm dịch vụ
          </ComButton>
        </div>
      </div>
      <TableService ref={tableRef} />
      {/* <ComModal
        width={800}
        isOpen={modal?.isModalOpen}
        onClose={modal?.handleClose}
      >
        <CreateBlog onClose={modal?.handleClose} tableRef={tableRef} />
      </ComModal> */}
    </>
  );
}