import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Danh sách phòng: { pin: { host: string, players: { socketId: name } } }
let rooms = {};

// Tạo PIN ngẫu nhiên 6 số
function generatePIN() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

io.on("connection", (socket) => {
  console.log("🔌", socket.id, "đã kết nối");

  // --- Host tạo phòng ---
  socket.on("createRoom", (hostName, callback) => {
    let pin;

    // Sinh pin mới cho đến khi chưa tồn tại trong rooms
    do {
      pin = generatePIN();
    } while (rooms[pin]); // nếu rooms[pin] tồn tại, sinh lại

    // Tạo phòng mới
    rooms[pin] = {
      host: hostName,
      players: [],
      hidePin: false,
      timePerSlide: 20,
      minusPoint: false,
      isPlayWith: false,
    };

    // Socket tự động join vào phòng
    socket.join(pin);

    console.log(`🌟 ${hostName} đã tạo phòng ${pin}`);
    //console.log(rooms);
    // Gửi phản hồi về client
    if (callback) callback({ success: true, pin });
  });


  socket.on("joinRoom", ({ pin, name }, callback) => {
    if (!rooms[pin]) {
      return callback?.({ success: false, message: "Phòng không tồn tại" });
    }

    const lowerName = name.toLowerCase();
    const isHost = lowerName === rooms[pin].host.toLowerCase();
    const isPlayer = Object.values(rooms[pin].players).some(
      n => n.toLowerCase() === lowerName
    );

    if (isHost || isPlayer) {
      return callback?.({
        success: false,
        message: "Name Duplicate",
        error: "001"
      });
    }

    rooms[pin].players = {
      [socket.id]: name,
      ...rooms[pin].players
    };

    socket.join(pin);
    console.log(`${name} đã vào phòng ${pin} 🏡`);

    callback?.({ success: true });
    io.to(pin).emit("someoneJoin", { name });
  });

  // --- Lấy trạng thái hiện tại của lobby ---
  socket.on("getCurrentLobbyState", (pin, callback) => {
    if (!rooms[pin]) {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
      return;
    }

    const room = rooms[pin];
    const players = Object.values(room.players);
    if (callback) callback({
      success: true,
      room: { host: room.host, players, hide: rooms[pin].hidePin, isPlayWith: room.isPlayWith },
      setting: { timePerSlide: room.timePerSlide, minusPoint: room.minusPoint }
    });
  });

  // --- Player hoặc host yêu cầu danh sách ---
  socket.on("getPlayers", (pin, callback) => {
    if (rooms[pin]) {
      const players = Object.values(rooms[pin].players);
      if (callback) callback(players);
    } else {
      if (callback) callback([]);
    }
  });

  //Yêu cầu lobby ẩn/hiện pin 
  socket.on("requestHidePin", (pin, callback) => {
    if (rooms[pin]) {
      rooms[pin].hidePin = !rooms[pin].hidePin;
      if (callback) callback({ success: true });
    }
    io.to(pin).emit("acceptRequestHidePin", { hide: rooms[pin].hidePin });

    if (callback) callback({ success: true });
  });

  socket.on("requestKickPlayer", (pin, name, callback) => {
    if (rooms[pin]) {
      let player;
      for (const [key, value] of Object.entries(rooms[pin].players)) {
        if (value === name) {
          player = rooms[pin].players[key];
          delete rooms[pin].players[key];
          break;
        }
      }
      if (callback) callback({ success: true });
      io.to(pin).emit("responseKickPlayer", { name });
      socket.leave(player);
      console.log(`Đã đá ${name} khỏi phòng ${pin}`);
    } else {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
    }
  });
  // Rời lobby
  socket.on("requestLeave", (pin, name, callback) => {
    if (rooms[pin]) {
      let player;
      if (name === rooms[pin].host) {
        io.to(pin).emit("responseCloseLobby");
        delete rooms[pin];
        console.log(`Host đã rời, phòng ${pin} đóng`);
        return;
      }
      for (const [key, value] of Object.entries(rooms[pin].players)) {
        if (value === name) {
          player = rooms[pin].players[key];
          delete rooms[pin].players[key];
          break;
        }
      }
      if (callback) callback({ success: true });
      io.to(pin).emit("responseSomeoneLeave", { name });
      socket.leave(player);
      console.log(`${name} đã rời khỏi phòng ${pin}`);
    } else {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
    }
  });
  // Thay đổi thời gian mỗi slide
  socket.on("requestChangeTimePerSlide", (pin, value, callback) => {
    if (rooms[pin]) {
      rooms[pin].timePerSlide = value;
      if (callback) callback({ success: true });
      io.to(pin).emit("responseChangeTimePerSlide", { value, host: rooms[pin].host });
      console.log(`Lobby ${pin} đã đổi thời gian mỗi slide thành ${value}s`);
    } else {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
    }
  });
  // Bật/tắt tính năng trừ điểm
  socket.on("requestMinusPoint", (pin, value, callback) => {
    if (rooms[pin]) {
      rooms[pin].minusPoint = value;
      if (callback) callback({ success: true });
      io.to(pin).emit("responseMinusPoint", { value, host: rooms[pin].host });
      console.log(`Lobby ${pin} đã ${value ? "bật" : "tắt"} tính năng trừ điểm`);
    } else {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
    }
  });

  socket.on("requestPlayWith", (pin, callback) => {
    if (!rooms[pin]) {
      return callback?.({ success: false, message: "Phòng không tồn tại" });
    }
    const room = rooms[pin];
    room.isPlayWith = !room.isPlayWith;

    callback?.({ success: true });
    io.to(pin).emit("responePlayWith", { isPlayWith: room.isPlayWith });
  });
  // --- Disconnect ---
  socket.on("disconnect", () => {
    for (const pin in rooms) {
      const room = rooms[pin];
      if (room.players[socket.id]) {
        const name = room.players[socket.id];
        delete room.players[socket.id];

        console.log(`${name} đã rời phòng ${pin}`);
        socket.leave(pin);
        // Nếu host rời, đóng phòng
        if (name === room.host) {
          io.to(pin).emit("responseCloseLobby");
          delete rooms[pin];
          console.log(rooms);
        } else {
          io.to(pin).emit("responseSomeoneLeave", { name });
        }
        break; // tìm thấy room rồi thoát vòng lặp
      }
    }
  });
});

server.listen(3001, () => {
  console.log("💛 Server chạy ở http://localhost:3001");
});
