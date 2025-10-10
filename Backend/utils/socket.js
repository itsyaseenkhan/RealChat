// import { Server } from "socket.io";

// const userSocketMap = {};
// let io;

// export function initSocket(server) {
//  io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   },
// });


//   io.on("connection", (socket) => {
//     console.log("✅ A user connected:", socket.id);

//     const userId = socket.handshake.query.userId;

//     if (userId) {
//       userSocketMap[String(userId)] = socket.id;

//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     }

//     socket.on("disconnect", () => {
//       console.log(" A user disconnected:", socket.id);
//       if (userId) {
//         delete userSocketMap[userId];
//       }
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
//   });
// }

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// export { io };


import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const userSocketMap = {};
let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  // ✅ Middleware for JWT authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token; // frontend se aya hoga
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.userId = decoded.id; // verified userId
      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.userId);

    // JWT se aaya hua userId save karo
    if (socket.userId) {
      userSocketMap[socket.userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      console.log("❌ A user disconnected:", socket.userId);
      if (socket.userId) {
        delete userSocketMap[socket.userId];
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
