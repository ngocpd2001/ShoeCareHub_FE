import React, { useState } from "react";
import OrderCard from "./OrderCard";

export default function ListOrder() {
  const [data, setData] = useState([{}, {}]);
  return (
    <>
      {data.map((e, index) => (
        <div className="mt-4"><OrderCard/></div>
      ))}
    </>
  );
}
