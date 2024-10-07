import { Outlet, createBrowserRouter } from "react-router-dom";
import React from "react";
import LoginPage from "./page/login/LoginPage";
import ErrorPage from "./page/404/ErrorPage";
import ComHeaderAdmin from "./Components/ComHeaderAdmin/ComHeaderAdmin";
import Home from "./page/Home/Home";
import ComHeader from './Components/ComHeader/ComHeader';

export const routers = createBrowserRouter([
  {
    path: "*",
    element: (
      // <ComHeader>
      <ErrorPage goTo={"/"} statusCode={"404"} />
      // {/* </ComHeader> */}
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
