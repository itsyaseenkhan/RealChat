import { Server } from "socket.io";

const userSocketMap = {};
let io;

export function initSocket(server) {
 io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});


  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[String(userId)] = socket.id;

      // ✅ Jaise hi user connect ho turant broadcast karo
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      console.log("❌ A user disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
