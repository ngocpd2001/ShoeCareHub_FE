import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import styles from "./sidenav.module.css";
import {
  FundFilled,
  ExceptionOutlined,
  LayoutFilled,
  FolderAddFilled,
  FlagFilled,
  ReconciliationFilled,
  DatabaseFilled,
  FileExclamationFilled,
  ApiFilled,
  SignalFilled,
  SettingFilled,
  UserOutlined,
  PoweroffOutlined,
  FileTextFilled,
  ProjectFilled,
} from "@ant-design/icons";
const NavLinkItem = ({ item }) => {
  const location = useLocation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  return (
    <>
      <Menu.Item className={styles.menuItem}>
        <NavLink
          to={item.submenu ? location.pathname + location.search : item.to}
          className={
            location.pathname === "/dashboard" ||
            location.pathname === "/account-setting"
              ? location.pathname === item.search && styles.activeItem
              : location.search === ""
              ? location.pathname === item.search && styles.activeItem
              : location.search === item.search && styles.activeItem
          }
          onClick={() => item.submenu && setShowSubmenu(!showSubmenu)}
        >
          <div className={styles.flex}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </div>
          {item.submenu && (
            <DownOutlined className={`${showSubmenu && styles.downOutlined}`} />
          )}
        </NavLink>
      </Menu.Item>
      {item.submenu && showSubmenu && (
        <Menu theme="light" mode="inline" className={styles.menuSub}>
          {item.submenu.map((item, index) => (
            <Menu.Item key={index} className={styles.menuItem}>
              <NavLinkItem item={item} />
            </Menu.Item>
          ))}
        </Menu>
      )}
    </>
  );
};
function Sidenav() {
      const listMenuItemSidenav = [
        {
          to: "/admin/dashboard",
          search: "/admin/dashboard",
          icon: <LayoutFilled />,
          label: "Dashboard",
        },
        {
          to: "/admin/tableUser",
          search: "/admin/tableUser",
          icon: <FolderAddFilled />,
          label: "Table User",
        },
        {
          to: "/admin/tableartwork",
          search: "/admin/tableartwork",
          icon: <FlagFilled />,
          label: "Table Artwork",
        },
        // {
        //   to: "/admin/tableProduct",
        //   search: "/admin/tableProduct",
        //   icon: <DatabaseFilled />,
        //   label: "Table Product",
        // },
        {
          to: "/admin/tablereportuser",
          search: "/admin/tablereportuser",
          icon: <FileExclamationFilled />,
          label: "Report User",
        },
        {
          to: "/admin/tableFeedback",
          search: "/admin/tableFeedback",
          icon: <ReconciliationFilled />,
          label: "Report Artwork",
        },
        {
          to: "/admin/category",
          search: "/admin/category",
          icon: <DatabaseFilled />,
          label: "Category",
        },
      ];

  return (
    <>
      <div className={styles.brand}>
        {/* <img src={logo} alt="logo" /> */}
        <h2 style={{fontSize: "23px"}}>Artwork</h2>
      </div>
      <hr />
      <Menu theme="light" mode="inline" className={styles.menuInline}>
        {listMenuItemSidenav.map((item, index) => (
            <div key={index}>
              <NavLinkItem item={item} />
            </div>
          ))}
      </Menu>
    </>
  );
}

export default Sidenav;
