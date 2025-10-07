import Quizzes from '../models/quizzes.js';
import Room from '../models/rooms.js';
import { ObjectId } from "mongodb";
// Danh sách phòng
let rooms = {};

// Hàm tạo pin ngẫu nhiên
function generatePIN() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export default function socketHandler(io, db) {
    const collection = db.collection("quizzes");
    io.on("connection", (socket) => {
        console.log("🔌", socket.id, "đã kết nối");

        // --- Host tạo phòng ---
        socket.on("createRoom", async (hostName, quizId, callback) => {
            let pin;
            do {
                pin = generatePIN();
            } while (rooms[pin]);

            const quizData = await collection.findOne({ _id: new ObjectId(quizId) });
            if (!quizData) {
                return callback?.({ success: false, message: "Quiz not exist" });
            }

            const quiz = new Quizzes(quizData);
            rooms[pin] = new Room(pin, hostName, [], false, 20, false, false, quiz);

            socket.join(pin);

            console.log(`🌟 ${hostName} đã tạo phòng ${pin}`);
            callback?.({ success: true, pin });
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
                room: room.detail(),
                setting: room.setting(),
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

        socket.on("requestStartGame", (pin, callback) => {
            if (!rooms[pin]) {
                return callback?.({ success: false, message: "Phòng không tồn tại" });
            }

            io.to(pin).emit("responeStartGame", { playNow: true });
            callback?.({ success: true });

            const quiz = rooms[pin].quiz;
            const questions = quiz.questions;
            questions.forEach((question, index) => {
                console.log(`${index} → ${fruit}`);
            });
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
                    if (name === room.host) {
                        io.to(pin).emit("responseCloseLobby");
                        delete rooms[pin];
                    } else {
                        io.to(pin).emit("responseSomeoneLeave", { name });
                    }
                    break;
                }
            }
        });
    });
}
