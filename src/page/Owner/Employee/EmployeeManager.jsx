import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import TableEmployee from './TableEmployee';
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function EmployeeManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Nhân viên</h3>
          <Breadcrumb
            items={[
              {
                title: <span className="text-base">Cửa hàng</span>,
              },
              {
                title: <span className="text-base text-[#002278]">Nhân viên</span>,
              },
            ]}
          />
        </div>
        <div>
          <ComButton onClick={() => navigate("/owner/employee/create")}>
            + Thêm nhân viên
          </ComButton>
        </div>
      </div>
      <TableEmployee ref={tableRef} />
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
