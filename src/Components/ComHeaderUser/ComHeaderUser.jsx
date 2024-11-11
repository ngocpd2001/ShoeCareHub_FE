import { useEffect, useState } from "react";
import { UsersIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useStorage } from "../../hooks/useLocalStorage";

const navigation = [
  {
    name: "Tài khoản",
    icon: UsersIcon,
    children: [
      { name: "Thông tin tài khoản", href: "/user/profile" },
      { name: "Đổi mật khẩu", href: "/user/reset-password" },
      { name: "Địa chỉ nhận hàng", href: "/user/addresses" },
      { name: "Trở thành nhà cung cấp", href: "/" },
      { name: "Yêu cầu khiếu nại", href: "/user/ticket" },
    ],
  },
  {
    name: "Lịch sử mua hàng",
    icon: UsersIcon,
    current: false,
    children: [{ name: "Đơn hàng", href: "/user/order-history" }],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ComHeaderUser({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeCategory, setActiveCategory] = useState(null);
  const [user, setUser] = useStorage("user", null);

  useEffect(() => {
    setActiveCategory(currentPath);
    window.scrollTo(0, 0);
  }, [currentPath]);

  return (
    <div className="max-w-[1250px] m-auto">
      <div className="flex  w-full mt-2 ">
        <div className=" w-60 ">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 pb-3 pt-5 bg-white mt-4 border border-gray-200 rounded-lg shadow-xl">
            <div className="flex h-16 gap-2 shrink-0 items-center justify-center">
              <img
                alt="Your Company"
                src={user.imageUrl}
                className="h-16 w-16 rounded-full object-cover"
              />
              {/* {user.fullname} */}
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Disclosure as="div" defaultOpen={true}>
                      {({ open }) => (
                        <>
                          <DisclosureButton
                            className={classNames(
                              "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700",
                              item.children
                                ? "hover:bg-gray-50 hover:text-[#002278]"
                                : ""
                            )}
                          >
                            <ChevronRightIcon
                              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                                open ? "rotate-90" : ""
                              }`}
                            />
                            <item.icon
                              aria-hidden="true"
                              className="h-6 w-6 shrink-0"
                            />
                            {item.name}
                          </DisclosureButton>
                          <DisclosurePanel as="ul" className="mt-1">
                            {item.children.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  to={subItem.href}
                                  className={classNames(
                                    subItem.href === activeCategory
                                      ? "text-[#002278]"
                                      : "hover:text-[#002278] text-black",
                                    "block rounded-md py-2 pl-9 pr-2 text-sm leading-6 my-2"
                                  )}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <section
          aria-labelledby="products-heading"
          className="px-4 pt-2 sm:px-6 lg:px-8 flex-1"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-6">
            <div className="lg:col-span-6 h-full w-full">
              <div>{children}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
