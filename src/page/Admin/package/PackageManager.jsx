import React, { useRef } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";

import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import ComModal from "../../../Components/ComModal/ComModal";

import { useStorage } from "../../../hooks/useLocalStorage";
import { TablePackage } from "./TablePackage";

export default function PackageManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">
            Quản lý gói
          </h3>
          {/* <Breadcrumb
            items={[
              {
                title: <span className="text-base">Cửa hàng</span>,
              },
              {
                title: <span className="text-base text-[#002278]">Chi nhánh</span>,
              },
            ]}
          /> */}
        </div>
        {/* <div>
          <ComButton onClick={() => modal.handleOpen()}>
            + Thêm danh mục
          </ComButton>
        </div> */}
      </div>
      <TablePackage ref={tableRef} />
      <ComModal
        width={800}
        isOpen={modal?.isModalOpen}
        onClose={modal?.handleClose}
      >
        {/* <CreateCategoryService
          onClose={modal?.handleClose}
          tableRef={tableRef}
        /> */}
      </ComModal>
    </>
  );
}
