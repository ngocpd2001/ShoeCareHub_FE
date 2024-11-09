import axios from 'axios';


// Custom Axios Type
const AxiosClientFactoryEnum = {
  LOGIN: 'login'
};

// ----------------------------------------------------------------------
//  const API_ROOT = 'http://localhost:5129/api';
const API_ROOT = 'https://shoecarehub.site/api';
 
const parseParams = (params) => {
  const keys = Object.keys(params);
  let options = '';

  keys.forEach((key) => {
    const isParamTypeObject = typeof params[key] === 'object';
    const isParamTypeArray = isParamTypeObject && Array.isArray(params[key]) && params[key].length >= 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

const account = `${API_ROOT}`;

const requestWebAdmin = axios.create({
  baseURL: account,
  paramsSerializer: parseParams
});

requestWebAdmin.interceptors.request.use((options) => {
  const { method } = options;

  if (method === 'put' || method === 'post') {
    Object.assign(options.headers, {
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  return options;
});

const requestLogin = axios.create({
  baseURL: account,
  paramsSerializer: parseParams
});

requestLogin.interceptors.request.use((options) => {
  const { method } = options;

  if (method === 'put' || method === 'post') {
    Object.assign(options.headers, {
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  return options;
});

requestLogin.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Có lỗi xảy ra')
);

// Thêm interceptor cho axiosInstances.login
requestLogin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AxiosClientFactory {
  getAxiosClient(type, config = {}) {
    switch (type) {
      case 'login':
        return requestLogin;
    }
  }
}

const axiosClientFactory = new AxiosClientFactory();

export const axiosInstances = {
  login: axiosClientFactory.getAxiosClient(AxiosClientFactoryEnum.LOGIN)
};

export default axiosInstances.webAdmin;