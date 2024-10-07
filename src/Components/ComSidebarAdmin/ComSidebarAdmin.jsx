import React, { useState } from "react";
import {
  UserOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
const { SubMenu } = Menu;

const Sidebar = () => {
  const [current, setCurrent] = useState("manage-users");

  const onClick = (e) => {
    setCurrent(e.key.toString());
    console.log(e.link);
    if (e.key === "manage-users") {
      window.location.href = window.location.origin + "/admin/tableUser";
    }
    if (e.key === "manage-report-posts") {
      window.location.href = window.location.origin + "/admin/tableFeedback";
    }
    if (e.key === "manage-report-users") {
      window.location.href = window.location.origin + "/admin/tablereportuser";
    }
    if (e.key === "manage-products") {
      window.location.href = window.location.origin + "/admin/tableproduct";
    }
    if (e.key === "manage-artwork") {
      window.location.href = window.location.origin + "/admin/tableartwork";
    }
    // window.location.href= window.location.origin + "/" + e.link
  };

  const items = [
    {
      label: "Quản lý người dùng",
      key: "manage-users",
      link: "/admin/tableUser",
      icon: <UserOutlined />,
    },
    {
      label: "Quản lý báo cáo bài viết",
      key: "manage-report-posts",
      icon: <FileTextOutlined />,
      link: "/admin/tableFeedback",
    },
    {
      label: "Quản lý báo cáo người dùng",
      key: "manage-report-users",
      link: "/admin/tablerpuser",

      icon: <FileTextOutlined />,
    },
    {
      label: "Quản lý sản phẩm",
      key: "manage-products",
      link: "/admin/tableproduct",

      icon: <ShoppingCartOutlined />,
    },
    {
      label: "Quản lý artwork",
      key: "manage-artwork",
      link: "/admin/tableartwork",
      icon: <ShoppingCartOutlined />,
    },
  ];

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="inline"
      items={items}
    />
  );
};

export default Sidebar;
