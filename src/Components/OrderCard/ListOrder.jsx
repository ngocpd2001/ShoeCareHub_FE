import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import { getData } from "../../api/api";
import { useStorage } from "../../hooks/useLocalStorage";

export default function ListOrder() {
  const [data, setData] = useState([]);
  const [user, setUser] = useStorage("user", null);

  useEffect(() => {
    getData(`/orders/accounts/${user.id}`)
      .then((data) => {
        setData(data?.data.data);
        console.log(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {data.map((e, index) => (
        <div className="mt-4">
          <OrderCard order={e} />
        </div>
      ))}
    </>
  );
}
