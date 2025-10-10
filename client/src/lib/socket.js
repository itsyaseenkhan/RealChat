import { io } from "socket.io-client";
import store from "../Store/Store";
import { setOnlineUsers } from "../Store/slices/authSlice";

let socket;

export const connectSocket = (userId) => {
  if (!userId) return;

     socket = io(
    "https://realchat-backends-9v8u.onrender.com",
    {
     query: {userId},
    }
  );
  socket.on("getOnlineUsers", (users) => {
   console.log("Online users from server:", users);
    store.dispatch(setOnlineUsers(users)); });

   return socket;
};

 export const getSocket = () => socket;
  export const disconnectSocket = () => {
  if (socket) { socket.disconnect();
  socket = null; } };
    