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
    const pin = generatePIN();
    rooms[pin] = {
      host: hostName,
      players: [],
      hidePin: false,
    };
    socket.join(pin);
    console.log(`🌟 ${hostName} đã tạo phòng ${pin}`);
    io.to(pin).emit("roomUpdate", {
      pin,
      host: hostName,
      players: Object.values(rooms[pin].players),
      hide: rooms[pin].hidePin,
    });

    if (callback) callback({ success: true, pin });
  });

  // --- Player join phòng ---
  socket.on("joinRoom", ({ pin, name }, callback) => {
    if (!rooms[pin]) {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
      return;
    }
    const lowerName = name.toLowerCase();
    const isHost = lowerName === rooms[pin].host.toLowerCase();
    const isPlayer = rooms[pin].players.some(
      n => n.toLowerCase() === lowerName
    );

    if (isHost || isPlayer) {
      if (callback) callback({
        success: false,
        message: "Name Duplicate",
        error: "001"
      });
      return;
    }

    rooms[pin].players[socket.id] = name;
    socket.join(pin);

    console.log(`${name} đã vào phòng ${pin} 🏡`);
    console.log(rooms[pin].players);

    io.to(pin).emit("roomUpdate", {
      pin,
      host: rooms[pin].host,
      players: Object.values(rooms[pin].players),
    });

    if (callback) callback({ success: true });
  });

  // --- Lấy trạng thái hiện tại của lobby ---
  socket.on("getCurrentLobbyState", (pin, callback) => {
    if (!rooms[pin]) {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
      return;
    }

    const room = rooms[pin];
    const players = Object.values(room.players);
    // Emit realtime cho tất cả members
    io.to(pin).emit("roomUpdate", {
      pin,
      host: room.host,
      players,
    });

    if (callback) callback({ success: true, host: room.host, players, hide: rooms[pin].hidePin });
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
      for (const [key, value] of Object.entries(rooms[pin].players)) {
        if (value === name) {
          delete rooms[pin].players[key];
          break;
        }
      }
      if (callback) callback({ success: true });
      io.to(pin).emit("responseKickPlayer", { name });
      console.log(`Đã đá ${name} khỏi phòng ${pin}`);
    } else {
      if (callback) callback({ success: false, message: "Phòng không tồn tại" });
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    for (const pin in rooms) {
      const room = rooms[pin];
      if (room.players[socket.id]) {
        const name = room.players[socket.id];
        delete room.players[socket.id];

        console.log(`${name} đã rời phòng ${pin}`);

        // Nếu host rời, đóng phòng
        if (name === room.host) {
          io.to(pin).emit("roomClosed");
          delete rooms[pin];
        } else {
          io.to(pin).emit("roomUpdate", {
            pin,
            host: room.host,
            players: Object.values(room.players),
          });
        }
        break; // tìm thấy room rồi thoát vòng lặp
      }
    }
  });
});

server.listen(3001, () => {
  console.log("💛 Server chạy ở http://localhost:3001");
});
