import axios from "axios";

export const axiosInstance = axios.create({
   baseURL: import.meta.env.MODE === "production"  ? "https://realchat-backends-9v8u.onrender.com/api/v1"  : "/",
   withCredentials: true,
});


