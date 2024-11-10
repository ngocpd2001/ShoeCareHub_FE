// Khi login thành công
const handleLoginSuccess = (response) => {
  if (response.data.token) {
    // Đảm bảo token được lưu không có dấu ngoặc kép
    const token = response.data.token.replace(/^"|"$/g, '');
    localStorage.setItem('token', token);
  }
};

// Debug để xem format token
console.log('Token from storage:', localStorage.getItem('token'));