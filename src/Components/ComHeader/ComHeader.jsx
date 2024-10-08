import { Fragment, useEffect, useState } from "react";
import { Affix } from "antd";
import { Link, useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FaFacebookF,
  FaInstagram,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
const navigation = [
  { name: "Dashboard", href: "/admin/institute", current: false },
  { name: "Team", href: "/Team", current: false },
  { name: "Projects", href: "/", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "/" },
  { name: "Settings", href: "/" },
  { name: "Sign out", href: "/login" },
];
const language = [
  { name: "Việt Nam", href: "vn" },
  { name: "English", href: "en" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComHeader({ children }) {
  const [headerNavigation, setheaderNavigation] = useState(navigation);
  const location = useLocation();
  const currentPath = location.pathname;

  const methods = useForm({
    resolver: yupResolver(),
    defaultValues: {
      search: "",
    },
  });

  const { handleSubmit, register, setFocus, watch, setValue } = methods;

  useEffect(() => {
    changeNavigation2(currentPath);
  }, []);

  const changeNavigation2 = (path) => {
    setheaderNavigation((prevNavigation) =>
      prevNavigation.map((item) => {
        if (item.href === path) {
          return { ...item, current: true };
        } else {
          return { ...item, current: false };
        }
      })
    );
  };

  const changeNavigation = (itemName) => {
    setheaderNavigation((prevNavigation) =>
      prevNavigation.map((item) => {
        if (item.name === itemName) {
          return { ...item, current: true };
        } else {
          return { ...item, current: false };
        }
      })
    );
  };
  return (
    <>
      <div className="min-h-full">
        <Affix offsetTop={0} className="fixed-sidebar ">
          <header className="font-sans">
            <div className="bg-blue-900 text-white py-2 px-4 sm:px-16">
              <div className="container mx-auto flex justify-between items-center max-w-[1250px]">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Kết nối:</span>
                  <Link
                    to=""
                    className="text-white hover:text-gray-200  text-lg"
                  >
                    <FaFacebookF />
                  </Link>
                  <Link
                    to=""
                    className="text-white hover:text-gray-200  text-lg"
                  >
                    <FaInstagram />
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <Link to="" className="hover:underline">
                    Hỗ trợ
                  </Link>
                  <Link to="" className="hover:underline">
                    Đăng Ký
                  </Link>
                  <Link to="/login" className="hover:underline">
                    Đăng Nhập
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-white py-4  shadow-md   ">
              <div className="max-w-[1250px]  mx-auto">
                <div className="container mx-auto flex justify-between items-center ">
                  <Link to="/" className="text-2xl font-bold text-blue-900">
                    ShoeCare<span className="text-blue-500">Hub</span>
                  </Link>
                  <div className="flex-grow mx-10  text-lg">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500">
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                  <div>
                    <button className="text-gray-600 hover:text-blue-500">
                      <FaShoppingCart size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <nav className="bg-white border-t border-gray-200">
              <div className="container mx-auto">
                <ul className="flex justify-center space-x-8 py-3 text-sm font-medium">
                  <li>
                    <Link
                      to="/"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      DỊCH VỤ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      KÊNH CUNG CẤP
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      GỎI LÊN SÀN
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      VỀ CHÚNG TÔI
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
        </Affix>

        {/* <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header> */}
        <main>
          <div className="">{children}</div>
        </main>
      </div>
      <footer className="min-h-full  bg-white text-gray-600  font-sans  shadow-lg border-t-[#002278] border-t-4 pt-6">
        <div className="container mx-auto text-center max-w-[1250px]">
          <div className="grid grid-cols-2 justify-center  md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">VỀ CHÚNG TÔI</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Giới thiệu về TP4SCS
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Quy chế hoạt động
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Điều khoản sử dụng
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">DÀNH CHO KHÁCH HÀNG</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Trung tâm hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Hướng dẫn đặt dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Chính sách hoàn tiền
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Trở thành nhà cung cấp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">DÀNH CHO NHÀ CUNG</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Trung tâm hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Gói lên sàn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Chính sách sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Hệ thống xếp hạng
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">TẢI ỨNG DỤNG</h3>
              <div className=" space-x-2 mb-4 flex flex-col justify-center  items-center">
                <img
                  src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png?hl=vi "
                  alt="Google Play"
                  className="w-52"
                />

                <img
                  src="https://qrcode-gen.com/images/qrcode-default.png"
                  className="w-52"
                  alt="QR Code"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className=" pt-8 border-t border-gray-200 text-center bg-[#F4F4F4]">
        <div className="font-bold text-xl mb-2">LOGO</div>
        <p className="text-sm">Bản Quyền © 2024 TP4SCS</p>
        <p className="text-sm mt-2">
          Địa Chỉ: Lô E2a-7, Đường D1, D. Đ1, Long Thạnh Mỹ, Thành Phố Thủ Đức,
          Hồ Chí Minh
        </p>
        <p className="text-sm mt-1">
          Điện Thoại: (024) XXXXXXX - Email: contact@TP4SCS.vn
        </p>
      </div>
    </>
  );
}
