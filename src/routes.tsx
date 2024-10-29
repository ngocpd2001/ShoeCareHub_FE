import { Outlet, createBrowserRouter, Navigate } from "react-router-dom";
import React from "react";
import LoginPage from "./page/login/LoginPage";
import ErrorPage from "./page/404/ErrorPage";
import ComHeaderOwner from "./Components/ComHeaderOwner/ComHeaderOwner";
import Home from "./page/Home/Home";
import ComHeader from "./Components/ComHeader/ComHeader";
import ServiceDetail from "./page/Service/ServiceDetail";
import ProviderLandingPage from "./page/Provider/ProviderLandingPage";
import Subscription from "./page/Provider/Subscription";
import ComHeaderUser from "./Components/ComHeaderUser/ComHeaderUser";
import UserCart from "./page/Cart&Checkout/UserCart";
import Checkout from "./page/Cart&Checkout/Checkout";
import OrderHistory from "./page/OrderHistory/OrderHistory";
import ProfilePage from "./page/ProfileUser/ProfileUser";
import ServiceManager from "./page/Owner/Service/ServiceManager";
import DetailService from "./page/Owner/Service/DetailService";
import CreateSevice from "./page/Owner/Service/CreateService";
import OrderManager from "./page/Owner/Order/OrderManager";
import OrderDetail from "./page/Owner/Order/OrderDetail";
import Dashboard from "./page/Owner/Dashboard";
import EmployeeManager from "./page/Owner/Employee/EmployeeManager";
import EmployeeDetail from "./page/Owner/Employee/EmployeeDetail";
import CreateEmployee from "./page/Owner/Employee/CreateEmployee";
import UpdateEmployee from "./page/Owner/Employee/UpdateEmployee";
import ServiceGrid from "./Components/ServiceGrid/ServiceGrid";
import { isValidToken } from './utils/jwt';

// Giả sử bạn có một hàm để kiểm tra trạng thái đăng nhập
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return isValidToken(token);
};

// Thành phần bảo vệ
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export const routers = createBrowserRouter([
  {
    path: "*",
    element: (
      <ComHeader>
        <ErrorPage />
      </ComHeader>
    ),
  },
  {
    path: "/",
    element: (
      <ComHeader>
        <Outlet />
      </ComHeader>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/servicedetail/:id",
        element: <ServiceDetail />,
      },
      {
        path: "/provider-landingpage",
        element: <ProviderLandingPage />,
      },
      {
        path: "/subscription-provider",
        element: <Subscription />,
      },
      {
        path: "/user",
        element: (
          <ComHeaderUser>
            <Outlet />
          </ComHeaderUser>
        ),
        children: [
          {
            path: "/user/order-history",
            element: <OrderHistory />,
          },
          {
            path: "/user/profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "/cart",
        element: (
          <RequireAuth>
            <UserCart />
          </RequireAuth>
        ),
      },
      {
        path: "/checkout",
        element: (
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/owner",
    element: (
      <ComHeaderOwner>
        <Outlet />
      </ComHeaderOwner>
    ),
    children: [
      {
        path: "/owner/*",
        element: <ErrorPage />,
      },
      {
        path: "/owner/service",
        element: <ServiceManager />,
      },
      {
        path: "/owner/service/create",
        element: <CreateSevice />,
      },
      {
          path: "/owner/service/:id",
          element: <DetailService />,
        },
        {
          path: "/owner/order",
          element: <OrderManager />,
        },
      {
        path: "/owner/order/detail",
        element: <OrderDetail />,
      },
      {
        path: "/owner/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/owner/employee",
        element: <EmployeeManager />,
      },
      {
        path: "/owner/employee/:id",
        element: <EmployeeDetail />,
      },
      {
        path: "/owner/employee/create",
        element: <CreateEmployee />,
      },
      {
        path: "/owner/employee/update/:id",
        element: <UpdateEmployee />,
      },
    ],
  },
]);
