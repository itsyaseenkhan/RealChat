// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "https://realchat-backends-9v8u.onrender.com/api/v1",
//   withCredentials: true,
// });


import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://realchat-backends-9v8u.onrender.com/api/v1",
});

// ✅ request interceptor: har request ke sath token bhejo
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ya sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
