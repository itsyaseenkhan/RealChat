import dotenv from "dotenv";
dotenv.config(); // must be at top

import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import { initSocket } from "./utils/socket.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server is working on port: ${PORT} `);
});
