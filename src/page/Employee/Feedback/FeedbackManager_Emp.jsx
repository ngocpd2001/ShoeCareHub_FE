import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableFeedback_Emp } from './TableFeedback_Emp';
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function FeedbackManager_Emp() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">Phản hồi khách hàng</h3>
          <Breadcrumb
            items={[
              {
                title: <span className="text-lg">Phản hồi</span>,
              },
            ]}
          />
        </div>
        {/* <div>
          <ComButton onClick={() => navigate("/employee/feedback/create")}>
            + Thêm phản hồi
          </ComButton>
        </div> */}
      </div>
      <TableFeedback_Emp ref={tableRef} />
    </>
  );
}
