export const isWithin7Days = (finishedTime) => {
  if (!finishedTime) return false;
  
  const finishedDate = new Date(finishedTime);
  const currentDate = new Date();
  
  // Tính khoảng cách thời gian (số mili giây)
  const diffTime = currentDate - finishedDate;
  
  // Chuyển đổi thành số ngày
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 7;
}; 