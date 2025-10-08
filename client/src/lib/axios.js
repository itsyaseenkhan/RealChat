import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"? "http://localhost:5000/api/v1" : "https://realchat-backends-9v8u.onrender.com/api/v1",
  withCredentials: true,
});
