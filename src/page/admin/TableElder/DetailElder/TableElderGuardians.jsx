import React, { forwardRef, useImperativeHandle } from "react";
import { useEffect, useState } from "react";
import { Badge, Table, Typography } from "antd";
import { useTableState } from "../../../../hooks/useTableState";
import { useModalState } from "../../../../hooks/useModalState";
import ComDateConverter from "../../../../Components/ComDateConverter/ComDateConverter";
import ComMenuButonTable from "../../../../Components/ComMenuButonTable/ComMenuButonTable";
import ComModal from "../../../../Components/ComModal/ComModal";
import DetailHealthElder from "../../../Manager/Health/DetailHealthElder";
import DetailElder from "../DetailElder";
import DetailEmployee from "../../TableEmployee/DetailEmployee";
import ComTable from "../../../../Components/ComTable/ComTable";
import { getData } from "../../../../api/api";
import useColumnFilters from "../../../../Components/ComTable/utils";
import ComGenderConverter from "../../../../Components/ComGenderConverter/ComGenderConverter";
import ComPhoneConverter from "../../../../Components/ComPhoneConverter/ComPhoneConverter";

export const TableElderGuardians = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const table = useTableState();
  const modal = useModalState();
  const modalDetailEmployee = useModalState();
  const [selectedElder, setSelectedElder] = useState(null);
  const [selectedHealth, setSelectedHealth] = useState(null);
  const { idElder } = props;
  const { getColumnSearchProps, getColumnApprox } = useColumnFilters();

  const modalDetailElder = useModalState();

  const showModaldHealth = (record) => {
    modal.handleOpen();
    setSelectedHealth(record);
  };
  const columns = [
    {
      title: "Họ và tên",
      width: 100,
      fixed: "left",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
      ...getColumnSearchProps("name", "Họ và tên"),
      // render: (user, data) => (
      //   <Typography.Link onClick={() => showModaldElder(data.elder)}>
      //     {data.name}
      //   </Typography.Link>
      // ),
    },
    {
      title: "Quan hệ",
      width: 100,
      dataIndex: "relationship",
      key: "relationship",
      sorter: (a, b) => a?.relationship?.localeCompare(b?.relationship),
      ...getColumnSearchProps("relationship", "Quan hệ"),
    },
    {
      title: "Giới tính",
      width: 100,
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Nam", value: "Male" },
        { text: "Nữ", value: "Female" },
      ],
      onFilter: (value, record) => record.gender === value,
      sorter: (a, b) => a?.gender?.localeCompare(b?.gender),

      render: (_, record) => (
        <div>
          <ComGenderConverter>{record?.gender}</ComGenderConverter>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      width: 100,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber", "Số điện thoại"),
      sorter: (a, b) => a.phoneNumber - b.phoneNumber,

      render: (phone) => (
        <div>
          <ComPhoneConverter>{phone}</ComPhoneConverter>
        </div>
      ),
    },
    {
      title: "Năm sinh",
      width: 100,
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (_, render) => (
        <div>
          <ComDateConverter>{render?.dateOfBirth}</ComDateConverter>
        </div>
      ),
      sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),

      ...getColumnApprox("dateOfBirth"),
    },
    {
      title: "Gmail",
      width: 100,
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a?.email?.localeCompare(b?.email),

      ...getColumnSearchProps("email", "Gmail"),
    },
    {
      title: "Địa chỉ",
      width: 100,
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a?.address?.localeCompare(b?.address),
      ...getColumnSearchProps("address", "Địa chỉ"),
    },
    // {
    //   title: "Thao tác",
    //   key: "operation",
    //   fixed: "right",
    //   width: 80,
    //   render: (_, record) => (
    //     <div className="flex items-center flex-col">
    //       <ComMenuButonTable
    //         record={record}
    //         showModalDetails={() => showModaldHealth(record)}
    //         // showModalEdit={() => modal?.handleOpen(record)}
    //         excludeDefaultItems={["delete", "edit"]}
    //       />
    //     </div>
    //   ),
    // },
  ];
  // console.log(data);
  const reloadData = () => {
    table.handleOpenLoading();
    const urlApi = idElder
      ? `/family-member?ElderId=${idElder}&SortDir=Desc`
      : `/health-report?SortDir=Desc`;
    console.log(idElder);

    getData(urlApi)
      .then((e) => {
        const filteredData = e?.data?.contends?.filter(
          (item) => item.state === "Active"
        );
        setData(filteredData);
        table.handleCloseLoading();
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };
  useEffect(() => {
    reloadData();
  }, []);
  useImperativeHandle(ref, () => ({
    reloadData,
  }));
  return (
    <div>
      <ComTable
        columns={columns}
        dataSource={data}
        loading={table.loading}
        scroll={{
          x: 1020,
          y: "55vh",
        }}
      />
      <ComModal
        isOpen={modalDetailElder?.isModalOpen}
        onClose={modalDetailElder?.handleClose}
      >
        <DetailElder selectedData={selectedElder} />
      </ComModal>
    </div>
  );
});
