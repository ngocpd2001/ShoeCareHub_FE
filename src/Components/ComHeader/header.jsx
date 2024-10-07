import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  List,
  Avatar,
  Button,
  DatePicker,
} from "antd";
import {
  MenuOutlined,
  PoweroffOutlined,
  LayoutFilled,
  FolderAddFilled,
  FlagFilled,
  ReconciliationFilled,
  DatabaseFilled,
  FileExclamationFilled,
  HomeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { useParseUrl } from "../../../hooks/use-parse-url";
import profile from "./profile.svg";
import { useStorage } from "../../../hooks/useLocalStorage";
const Menu = () => {
  return (
    <List
      min-width="100%"
      className={styles.headerNotificationsDropdown}
      itemLayout="horizontal"
      dataSource={[
        {
          title: "Log out",
          path: "logout",
          avatar: <PoweroffOutlined />,
          // onclick:dispatch(actLogout());
        },
        {
          title: "Back to home",
          path: "",
          avatar: <HomeOutlined />,
        },
      ]}
      renderItem={(item) => (
        <>
          <List.Item>
            <Link to={`/${item.path}`}>
              <List.Item.Meta
                avatar={<Avatar shape="square" src={item.avatar} />}
                title={item.title}
              />
            </Link>
          </List.Item>
        </>
      )}
    />
  );
};

function Header({ onPress, setLastVisible }) {
  const { search, pathname } = useParseUrl();
  const [token, setToken] = useStorage("user", {});
  useEffect(() => window.scrollTo(0, 0));
  const listPaths = [
    {
      to: "admin/dashboard",
      icon: <LayoutFilled />,
      label: "Dashboard",
    },
    {
      to: "admin/tableUser",
      icon: <FolderAddFilled />,
      label: "Table User",
    },
    {
      to: "admin/tableartwork",
      icon: <FlagFilled />,
      label: "Table Artwork",
    },
    // {
    //   to: "/admin/tableProduct",
    //   icon: <DatabaseFilled />,
    //   label: "Table Product",
    // },
    {
      to: "admin/tablereportuser",
      icon: <FileExclamationFilled />,
      label: "Report User",
    },
    {
      to: "admin/tableFeedback",
      icon: <ReconciliationFilled />,
      label: "Report Artwork",
    },
    {
      to: "admin/category",
      icon: <DatabaseFilled />,
      label: "Category",
    },
  ];
  const listPath = () => {
    const path = listPaths.find((path) => path.to === pathname);
    return (
      <>
        <Breadcrumb
          className={styles.antPageBreadcrumb}
          items={[
            {
              title: `Artwork / ${pathname} ${
                search.tab ? " / " + search?.tab : ""
              }`,
            },
          ]}
        />
        <div className={styles.antPageHeaderHeading}>
          <span className={styles.icon}>{path?.icon}</span>
          <span className={styles.antPageHeaderHeadingTitle}>{path.label}</span>
        </div>
      </>
    );
  };
  return (
    <Row gutter={[24, 0]}>
      <Col span={24} md={10}>
        {listPath()}
      </Col>
      <Col span={24} md={14} className={styles.headerControl}>
        <Badge size="small">
          <Dropdown
            dropdownRender={Menu}
            placement="bottom"
            trigger={["click"]}
          >
            <a className={styles.btnSignIn} onClick={(e) => e.preventDefault()}>
              <span>Good day {token?._doc?.name}</span>
              <div className={styles.iconProfile}>
                <img src={profile} alt="profile icon" />
              </div>
            </a>
          </Dropdown>
        </Badge>
        <Button
          type="link"
          className={styles.sidebarToggler}
          onClick={() => onPress()}
        >
          <MenuOutlined />
        </Button>
      </Col>
    </Row>
  );
}

export default Header;
