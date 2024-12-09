import React, { useEffect, useRef, useState } from "react";
import { useModalState } from "../../../hooks/useModalState";
import ComButton from "../../../Components/ComButton/ComButton";

import { Breadcrumb } from "antd";
import { Link, useNavigate } from "react-router-dom";
import ComModal from "../../../Components/ComModal/ComModal";

import { useStorage } from "../../../hooks/useLocalStorage";
import { TableWordBlack } from "./TableWordBlack";
import CreateWordBlack from "./CreateWordBlack";
import { getData } from "../../../api/api";

export default function WordBlackManager() {
  const modal = useModalState();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [linkBlacklist, setLinkBlacklist] = useState("");

  const reloadData = () => {
    getData(`/word-blacklist/export-blacklist`)
      .then((e) => {
        console.log(333333,e);
        
        const activeItems = e?.data?.data;
        setLinkBlacklist(activeItems);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
  useEffect(() => {
    reloadData();
  }, []);
  return (
    <>
      <div className="flex justify-between items-end pb-2 px-4 ">
        <div>
          <h3 className="text-[#002278] text-2xl mb-4 font-semibold">
            Quản lý từ cấm
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
        <div className="flex items-center gap-8">
          <Link
            to={"https://shoecarehub.site/api/word-blacklist/export-blacklist"}
          >
            Tải danh sách từ cấm
          </Link>
          <ComButton onClick={() => modal.handleOpen()}>Thêm từ cấm </ComButton>
        </div>
      </div>
      <TableWordBlack ref={tableRef} />
      <ComModal
        width={800}
        isOpen={modal?.isModalOpen}
        onClose={modal?.handleClose}
      >
        <CreateWordBlack onClose={modal?.handleClose} tableRef={tableRef} />
      </ComModal>
    </>
  );
}
