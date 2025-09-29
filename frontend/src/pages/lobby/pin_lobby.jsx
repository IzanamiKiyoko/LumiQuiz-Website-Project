import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./lobby.css";
import socket from "../../services/socket.js";
//components
import Input from "../../components/input.jsx";
import Modal from "../../components/modal.jsx";
export default function WelcomePin() {
    const { rname, lobby_id } = useParams();
    const [pin, setPin] = useState(lobby_id || "");
    const [name, setName] = useState("");
    const [host, setHost] = useState("");
    const [players, setPlayers] = useState([]);
    const [joined, setJoined] = useState(false);
    const [mode, setMode] = useState("");
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ show: false, title: "", message: "" });
    const navigate = useNavigate();
    const notifyDuplicateName = () => {
        setModal({
            show: true,
            title: "Warning",
            message: "This name already exists in the lobby. Please choose a different name.",
            buttons: [
                {
                    label: "Confirm",
                    onClick: () => {
                        setModal({ ...modal, show: false });
                    },
                },
            ],
        });
    };
    const notifyInput = () => {
        setModal({
            show: true,
            title: "Warning",
            message: "Please fill in all required fields.",
            buttons: [
                {
                    label: "Confirm",
                    onClick: () => {
                        setModal({ ...modal, show: false });
                    },
                },
            ],
        });
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            EnterLobby();
        }
    };
    function hasEmoji(text) {
        // Regex tìm emoji unicode phổ biến
        const emojiRegex = /\p{Extended_Pictographic}/u;
        return emojiRegex.test(text);
    }
    useEffect(() => {
        const onRoomUpdate = (data) => {
            setPin(data.pin);
            setHost(data.host);
            setPlayers(data.players);
            setJoined(true);
        };

        const onRoomClosed = () => {
            alert("💔 Host đã rời phòng, phòng đã đóng.");
            window.location.reload();
        };

        socket.on("roomUpdate", onRoomUpdate);
        socket.on("roomClosed", onRoomClosed);

        return () => {
            socket.off("roomUpdate", onRoomUpdate);
            socket.off("roomClosed", onRoomClosed);
        };
    }, []);

    const createRoom = () => {
        if (name.trim() !== "") {
            socket.emit("createRoom", name, (newPin) => {
                if (newPin.success) {
                    setPin(newPin.pin);
                    setMode("host");
                    setHost(name);
                    setTimeout(function () {
                        navigate(`/lobby/room`, { state: { name: name, pin: newPin.pin, role: "host" } });
                    }, 3000);
                }
                else {
                    alert("Error creating room, please try again.");
                    setLoading(false);
                }
            });
        }
    };

    const joinRoom = () => {
        if (name.trim() !== "" && pin.trim() !== "") {
            socket.emit("joinRoom", { pin, name }, (res) => {
                if (!res.success) {
                    if (res.error === "001") {
                        notifyDuplicateName();
                        setLoading(false);
                    }
                }
                else {
                    setMode("player");
                    setTimeout(function () {
                        navigate(`/lobby/room`, { state: { name: name, pin: pin, role: "client" } });
                    }, 1000);
                }
            });
        }
        else {
            setModal({
                show: true,
                title: "Warning",
                message: "Please fill in all required fields.",
                buttons: [
                    {
                        label: "Confirm",
                        onClick: () => {
                            setModal({ ...modal, show: false });
                        },
                    },
                ],
            });
            return;
        }
    };

    const EnterLobby = () => {
        if (name.trim() === "" || (rname === "client" && pin.trim() === "")) {
            notifyInput();
            return;
        }
        if (name.length > 15) {
            setModal({
                show: true,
                title: "Warning",
                message: "Username is too long. Please enter a name with 15 characters or less.",
                buttons: [
                    {
                        label: "Confirm",
                        onClick: () => {
                            setModal({ ...modal, show: false });
                        },
                    },
                ],
            });
            return;
        }
        if (hasEmoji(name)) {
            setModal({
                show: true,
                title: "Warning",
                message: "Username contains invalid characters. Please avoid using emojis.",
                buttons: [
                    {
                        label: "Confirm",
                        onClick: () => {
                            setModal({ ...modal, show: false });
                        },
                    },
                ],
            });
            return;
        }
        setLoading(true);

        if (rname === "host") createRoom();
        else joinRoom();
    };

    return (
        <div className="app">
            <div className="landscape-warning">
                Vui lòng xoay ngang màn hình để có trải nghiệm tốt nhất.
            </div>
            <header className="header">
                <img src="/img/logo.png" alt="Logo" className="logo" />
            </header>

            <div className="main">
                <div className="enter-pin-card">
                    <img src="/img/icon.png" className="enter-pin-icon" />
                    {rname === "client" && (
                        <Input hint="Enter PIN" onChange={setPin} defaultValue={lobby_id} keyDown={handleKeyDown} element_name="input pin" />
                    )}
                    <Input hint="Enter Username" onChange={setName} keyDown={handleKeyDown} element_name="input name" />
                    <button className="btn" onClick={EnterLobby} name="btn enter lobby">
                        Enter Lobby
                    </button>
                    {loading && (
                        <div className="overlay_loading">
                            <span className="loader"></span>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                show={modal.show}
                onClose={() => setModal({ ...modal, show: false })}
                title={modal.title}
                message={modal.message}
                buttons={modal.buttons}
                element_name="modal"
            />
        </div>
    );
}
