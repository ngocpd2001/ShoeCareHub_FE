import { Outlet, createBrowserRouter } from "react-router-dom";
import React from "react";
import LoginPage from "./page/login/LoginPage";
import ErrorPage from "./page/404/ErrorPage";
import ComHeaderAdmin from "./Components/ComHeaderAdmin/ComHeaderAdmin";
import Home from "./page/Home/Home";
import ComHeader from './Components/ComHeader/ComHeader';
import ServiceDetail from "./page/Service/ServiceDetail";
import ProviderLandingPage from "./page/Provider/ProviderLandingPage";
import Subscription from "./page/Provider/Subscription";
import ComHeaderUser from "./Components/ComHeaderUser/ComHeaderUser";
import UserCart from "./page/UserCart";
import Checkout from "./page/Checkout";
import OrderHistory from "./page/OrderHistory/OrderHistory";
import ProfilePage from './page/ProfileUser/ProfileUser';

export const routers = createBrowserRouter([
  
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
        path: "/servicedetail",
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
            <UserCart />
        ),
      },
      {
        path: "/checkout",
        element: (
            <Checkout />
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ComHeaderAdmin>
        <Outlet />
      </ComHeaderAdmin>
    ),
  },
]);
