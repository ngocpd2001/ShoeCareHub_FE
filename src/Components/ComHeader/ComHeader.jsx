import { Fragment, useEffect, useState } from "react";
import { Affix } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/Shoe Care Hub Logo_NoneBack.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FaFacebookF,
  FaInstagram,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { RiFacebookBoxLine } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";
import { useStorage } from "../../hooks/useLocalStorage";
import { MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { getData } from "../../api/api";

const navigation = [
  { name: "Dashboard", href: "/admin/institute", current: false },
  { name: "Team", href: "/Team", current: false },
  { name: "Projects", href: "/", current: false },
  { name: "Calendar", href: "#", current: false },
  { name: "Reports", href: "#", current: false },
];
const userNavigation = [
  { name: "Hồ sơ của tôi", href: "/user/profile" },
  { name: "Đơn mua của tôi", href: "/user/order-history" },
  { name: "Đăng xuất", href: "/login" },
];
const userNavigationOwner = [
  { name: "Cửa hàng của tôi", href: "/owner/dashboard" },
  { name: "Hồ sơ của tôi", href: "/user/profile" },
  { name: "Đơn mua của tôi", href: "/user/order-history" },
  { name: "Đăng xuất", href: "/login" },
];

export default function ComHeader({ children }) {
  const [headerNavigation, setheaderNavigation] = useState(navigation);
  const location = useLocation();
  const [token, setToken, loadToken] = useStorage("token", "");
  const [user, setUser, loadUser] = useStorage("user", null);
  const currentPath = location.pathname;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
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

  useEffect(() => {
    loadToken();
    // chỗ để lấy thông tin người dùng
    loadUser();
  }, [currentPath]);
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchTerm("")
      navigate(`/service?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Hàm xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearchClick = () => {
    setSearchTerm('')
    navigate(`/service?search=${encodeURIComponent(searchTerm)}`);
  };
  return (
    <>
      <div className="min-h-full">
        <Affix offsetTop={0} className="fixed-sidebar ">
          <header className="font-sans">
            <div className="bg-blue-900 text-white py-2  sm:px-16">
              <div className="container mx-auto flex justify-between items-center max-w-[1250px]">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Kết nối:</span>
                  <Link
                    to=""
                    className="text-white hover:text-gray-200  text-lg"
                  >
                    <FaFacebookF size={16} />
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
                  {!token ? (
                    <>
                      <Link to="/register" className="hover:underline">
                        Đăng Ký
                      </Link>
                      <Link to="/login" className="hover:underline">
                        Đăng Nhập
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="bg-white  shadow-md   ">
              <div className="max-w-[1250px]  mx-auto">
                <div className="container mx-auto flex justify-between items-center ">
                  <Link
                    to="/"
                    className="text-xl font-bold text-blue-900 text-center block"
                  >
                    <img src={logo} alt="Logo" className="h-20" />
                  </Link>
                  <div className="flex-grow mx-10  text-lg">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full py-1 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSearchClick}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/cart"
                      className="text-gray-600 hover:text-blue-500 mr-[5px] block"
                    >
                      <div
                        style={{
                          backgroundColor: "#ebebeb",
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <BsCart3 size={20} color="black" />
                      </div>
                    </Link>
                    {token ? (
                      <>
                        <Menu as="div" className="relative">
                          <MenuButton className="-m-1.5 flex items-center p-1.5">
                            <span className="sr-only">Open user menu</span>
                            <img
                              alt=""
                              src={user?.imageUrl}
                              className="h-8 w-8 rounded-full bg-gray-50"
                            />
                            <span className="hidden lg:flex lg:items-center">
                              <span
                                aria-hidden="true"
                                className="ml-4 text-sm font-semibold leading-6 text-black"
                              >
                                {/* {user.fullname} */}
                              </span>
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="ml-2 h-5 w-5 text-gray-400"
                              />
                            </span>
                          </MenuButton>
                          <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-wbg-white/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                          >
                            {user.role !== "OWNER" &&
                              userNavigation.map((item) => (
                                <MenuItem key={item.name}>
                                  {item.name === "Đăng xuất" ? (
                                    <button
                                      onClick={() => {
                                        localStorage.clear();
                                        setToken(""); // Gọi hàm để xoá token khi người dùng chọn "Đăng xuất"
                                        setTimeout(() => {
                                          navigate("/login");
                                        }, 300);
                                      }}
                                      className="block px-3 py-1 text-sm leading-6 text-wbg-white data-[focus]:bg-gray-50"
                                    >
                                      {item.name}
                                    </button>
                                  ) : (
                                    <Link
                                      to={item.href}
                                      className="block px-3 py-1 text-sm leading-6 text-wbg-white data-[focus]:bg-gray-50"
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </MenuItem>
                              ))}
                            {user.role === "OWNER" &&
                              userNavigationOwner.map((item) => (
                                <MenuItem key={item.name}>
                                  {item.name === "Đăng xuất" ? (
                                    <button
                                      onClick={() => {
                                        localStorage.clear();
                                        // setToken(""); // Gọi hàm để xoá token khi người dùng chọn "Đăng xuất"
                                        setTimeout(() => {
                                          navigate("/login");
                                        }, 300);
                                      }}
                                      className="block px-3 py-1 text-sm leading-6 text-wbg-white data-[focus]:bg-gray-50"
                                    >
                                      {item.name}
                                    </button>
                                  ) : (
                                    <Link
                                      to={item.href}
                                      className="block px-3 py-1 text-sm leading-6 text-wbg-white data-[focus]:bg-gray-50"
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </MenuItem>
                              ))}
                          </MenuItems>
                        </Menu>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <nav className="bg-white border-t border-gray-300">
              <div className=" mx-auto shadow-md">
                <ul className="flex justify-center gap-8  py-2 text-sm font-medium bg-[#F9F9F9]">
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
                      to="/provider"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      KÊNH CUNG CẤP
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/subscription-provider"
                      className="text-blue-900 hover:text-blue-700 text-center"
                    >
                      GÓI LÊN SÀN
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
        <main className="bg-[#f9f9f9] pb-8">
          <div className="">{children}</div>
        </main>
      </div>
      <footer className="min-h-full  bg-white text-gray-600  font-sans  shadow-lg border-t-[#002278] border-4 ">
        <div className="container mx-auto text-center max-w-[1250px]">
          <div className="grid grid-cols-2 justify-center  md:grid-cols-3 gap-8 mb-8 mt-4">
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
                  <Link
                    to="/subscription-provider"
                    className="hover:text-blue-600"
                  >
                    Gói lên sàn
                  </Link>
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
            {/* <div>
              <h3 className="font-bold text-lg ">TẢI ỨNG DỤNG</h3>
              <div className=" space-x-2  flex flex-col justify-center  items-center">
                <img
                  src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png?hl=vi "
                  alt="Google Play"
                  className="w-40"
                />

                <img
                  src="https://qrcode-gen.com/images/qrcode-default.png"
                  className="w-40"
                  alt="QR Code"
                />
              </div>
            </div> */}
          </div>
        </div>
      </footer>
      <div className="py-2 border-t border-gray-200 text-center bg-[#F4F4F4]">
        <div className="">
          <img src={logo} alt="Logo" className="h-20 mx-auto" />
        </div>
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
