import React from "react";
import { Menu, Dropdown, Button, Typography } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare, faTrash, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';


const ComMenuButonTable = ({
  record,
  showModalDetails,
  showModalEdit,
  showModalDelete,
  showModalAccept,
  showModalReject,
  extraMenuItems = [],
  excludeDefaultItems = [],
  order = [],
}) => {
  const defaultMenuItems = [
    {
      key: "details",
      label: (
        <>
          <FontAwesomeIcon
            icon={faEye}
            className="text-xl text-[#002278] mr-2"
          />
          Chi tiết
        </>
      ),
      onClick: () => showModalDetails(record),
      visible: !excludeDefaultItems.includes("details"),
    },
    {
      key: "edit",
      label: (
        <>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="text-xl text-green-500 mr-2"
          />
          Cập nhật
        </>
      ),
      onClick: () => showModalEdit(record),
      visible: !excludeDefaultItems.includes("edit"),
    },
    {
      key: "delete",
      label: (
        <>
          <FontAwesomeIcon
            icon={faTrash}
            className="text-xl text-red-500 mr-2"
          />
          Xóa
        </>
      ),
      onClick: () => showModalDelete(record),
      visible: !excludeDefaultItems.includes("delete"),
    },
    {
      key: "accept",
      label: (
        <>
          <FontAwesomeIcon
            icon={faCheck}
            className="text-xl text-green-600 mr-2"
          />
          Chấp nhận
        </>
      ),
      onClick: () => showModalAccept(record),
      visible: !excludeDefaultItems.includes("accept"),
    },
    {
      key: "reject",
      label: (
        <>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-xl text-red-600 mr-2"
          />
          Từ chối
        </>
      ),
      onClick: () => showModalReject(record),
      visible: !excludeDefaultItems.includes("reject"),
    },
  ];

  const allMenuItems = [
    ...extraMenuItems.map((item, index) => ({
      key: `extra-${index}`,
      label: item.label,
      onClick: () => item.onClick(record),
      visible: true,
      order:
      order.indexOf(item.label) !== -1
      ? order.indexOf(item.label)
      : defaultMenuItems.length + index,
    })),
    ...defaultMenuItems,
  ].filter((item) => item.visible);

  allMenuItems.forEach((item) => {
    if (!item.order && item.order !== 0) {
      item.order =
        order.indexOf(item.key) !== -1
          ? order.indexOf(item.key)
          : allMenuItems.length;
    }
  });

  const sortedMenuItems = allMenuItems.sort((a, b) => a.order - b.order);

  const menu = (
    <Menu>
      {sortedMenuItems.map((item) => (
        <Menu.Item key={item.key} onClick={item.onClick} style={item.style}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button icon={<EllipsisOutlined />} />
    </Dropdown>
  );
};

export default ComMenuButonTable;