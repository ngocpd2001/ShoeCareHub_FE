import React from "react";

const daysOfWeek  = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
  Sunday: "Chủ nhật",
};

function ComWeekConverter({ children }) {
  const vietnameseDay  = daysOfWeek[children] || children || " "; // Kiểm tra và chuyển đổi ngày trong tuần
  return <div>{vietnameseDay }</div>;
}

export default ComWeekConverter;
