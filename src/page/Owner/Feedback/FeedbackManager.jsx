import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";
import { TableFeedback } from "./TableFeedback";
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

export default function FeedbackManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">
            Đánh giá
          </h3>
          {/* <Breadcrumb
            items={[
              {
                title: "Cửa hàng",
              },
              {
                title: "Dịch vụ",
              },
            ]}
          /> */}
        </div>
        
      </div>
      <TableFeedback ref={tableRef} />
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