import express from "express";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./config/socket.js";
import db from "./config/db.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Import xử lý socket
socketHandler(io, db);

server.listen(3001, () => {
  console.log("💛 Server chạy ở http://localhost:3001");
});
