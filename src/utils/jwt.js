import { jwtDecode } from 'jwt-decode';

// ----------------------------------------------------------------------

const isValidToken = (token) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const setSession = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Sau khi đăng nhập thành công
const loginSuccess = (token) => {
  setSession(token);
};

// Kiểm tra trước khi truy cập trang cần đăng nhập
const canAccessPage = () => {
  const token = localStorage.getItem('token');
  return isValidToken(token);
};

export { isValidToken, setSession, loginSuccess, canAccessPage };
