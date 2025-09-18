import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Users, Copy, EyeOff } from "lucide-react";
import "./lobby.css";
// components
import PlayerSlider from "../../components/feature/player_slider.jsx";
import SettingSlider from "../../components/feature/setting_slider.jsx";
import CopyButton from "../../components/copy_btn.jsx";
import ShowHideButton from "../../components/hide_btn.jsx";
import ShareButton from "../../components/share_btn.jsx";
import Modal from "../../components/modal.jsx";
import socket from "../../services/socket.js";
export default function Lobby() {

  const navigate = useNavigate();
  const location = useLocation();
  const { name, pin, role } = location.state || {};
  if (!name) {
    navigate(`/lobby/${role || "client"}`);
  }
  const [playersCount, setPlayersCount] = useState(0);
  const [volume, setVolume] = useState(50);
  const [gameinfo, setGameinfo] = useState({
    title: "Sample Game",
    slides: 10,
    author: "none",
  });
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState(0);
  const [players, setPlayers] = useState([]); // luôn là array rỗng
  const [hostName, setHostName] = useState("Host");
  const [joined, setJoined] = useState(false);
  const [hidePin, setHidePin] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "" });
  const origin = window.location.origin;
  // --- Xử lý cập nhật room ---
  const handleRoomUpdate = (data) => {
    console.log("Received room update:", data);
    if (data.pin === pin) {
      const newPlayers = Array.isArray(data.players) ? data.players : [];
      setPlayers(newPlayers);
      setPlayersCount(newPlayers.length);
      setHostName(data.host || "Host");
      setJoined(true);
      setHidePin(data.hide)
    }
    else {
      navigate(`/lobby/${role || "client"}`); // nếu pin không đúng thì quay về trang nhập pin
      alert("Phòng không tồn tại hoặc đã đóng.");
    }
  };
  const handleLeaveLobbyNotify = () => {
    setModal({
      show: true,
      title: role === "host" ? "Warning" : "Confirm",
      message: "Are youu sure you want to leave the lobby?" + (role === "host" ? " (As host, leaving will close the lobby for all players.)" : ""),
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            setModal({ ...modal, show: false });
          },
        },
        {
          label: "Cancel",
          onClick: () => setModal({ ...modal, show: false }),
        },
      ],
    });
  };
  const confirmNotify = (title, message, action = null) => {
    setModal({
      show: true,
      title: title || "Warning",
      message: message,
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            setModal({ ...modal, show: false });
            action?.();
          },
        },
      ],
    });
  };
  const handleLeaveLobby = () => {
    socket.emit("requestLeaveLobby", pin, (data) => {

    });
  }
  const handleKickPlayer = (playerName) => {
    console.log("Attempting to kick player:", playerName);
    if (!playerName) return;
    if (playerName === hostName) {
      alert("You cannot kick the host.");
      return;
    }
    confirmNotify("Warning", "Are you sure to kick this player " + playerName, () => {
      socket.emit("requestKickPlayer", pin, playerName, (data) => {
        if (!data.success) {
          confirmNotify("Warning", "Fail when kicking player " + playerName);
        }
      });
    });

  }
  useEffect(() => {
    // Nhận update từ server
    socket.on("roomUpdate", handleRoomUpdate);
    // Nhận phản hồi ẩn pin
    socket.on("acceptRequestHidePin", (data) => setHidePin(data.hide));
    // Nhận phản hồi đá người chơi
    socket.on("responseKickPlayer", (data) => {
      setPlayers((prevPlayers) => {
        const updated = prevPlayers.filter((p) => p !== data.name);
        setPlayersCount(updated.length);
        return updated;
      });
      if (data.name === name) {
        confirmNotify("Alert", "You have been kicked from the lobby.", () => navigate(`/lobby/${role || "client"}`))
      }
    });
    // Nếu host đóng phòng
    const handleRoomClosed = () => {
      alert("💔 Host đã rời phòng, phòng đã đóng.");
      navigate(`/lobby/${role || "client"}`);
    };
    socket.on("roomClosed", handleRoomClosed);

    // Lấy trạng thái hiện tại khi join
    socket.emit("getCurrentLobbyState", pin, (data) => {
      if (data?.success) {
        handleRoomUpdate({ pin: pin, host: data.host, players: data.players, hide: data.hide });
      }
    });

    // Cleanup khi rời component
    return () => {
      socket.off("roomUpdate", handleRoomUpdate);
      socket.off("roomClosed", handleRoomClosed);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pin, navigate, role]);

  const requestHidePin = (isHidden) => {
    // Yêu cầu tất cả client ẩn/hiện pin 
    socket.emit("requestHidePin", pin, (data) => {
      if (data?.success) {
        setHidePin(isHidden);
      }
    });
  }
  return (
    <div className="app">
      <div className="landscape-warning">
        Vui lòng xoay ngang màn hình để có trải nghiệm tốt nhất.
      </div>

      <header className="header">
        <img src="/img/logo.png" alt="Logo" className="logo" />
        <div className="title">{hostName}'s lobby</div>
        <div className="players-count" onClick={() => {
          setOpen(!open);
          setNav(0);
        }}>
          <Users className="icon" /> {playersCount + 1}
        </div>
      </header>

      <div className="main">
        <div className="pin-card">
          <div className="pin-top-bar">
            <div className="pin-game-info">
              <img
                src="/img/thumb-example.png"
                alt="Game Thumbnail"
                className="game-thumbnail"
              />
              <div style={{ textAlign: "left" }}>
                <h4 className="text-game-detail">{gameinfo.title}</h4>
                <p className="text-game-detail">{gameinfo.slides} slides</p>
                <p className="text-game-detail">Author: {gameinfo.author}</p>
              </div>
            </div>
            <img src="/img/icon.png" className="pin-img" />
            <div className="pin-code-detail">
              <p className="pin-label">pin code:</p>
              <h2 className="pin-number">{hidePin ? "******" : pin}</h2>
              <div className="pin-actions">
                <CopyButton textToCopy={pin} style={{ width: "10px", height: "10px" }} />
                {role === "host" ? <ShowHideButton onToggle={(isHidden) => requestHidePin(isHidden)} /> : ""}
                <ShareButton textToCopy={`Join ${hostName}'s game using PIN: ${pin}. URL: ${origin}/lobby/client/${pin}`} />
              </div>
            </div>
          </div>

          <div className="pin-player-list">
            {playersCount === 0 ? <h3 className="waiting">Waiting for players <span className="waiting_ani"></span></h3> : ""}
            <div
              className="players"
              onClick={() => {
                setOpen(!open);
                setNav(0);
              }}
            >
              {players?.map((p, idx) => (
                <span key={idx} className="player">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {role === "host" ? <button className="btn" disabled={playersCount === 0}>Start game</button> : ""}
          {role === "host" ? <button className="btn">Play with everyone</button> : ""}
          <button
            className="btn"
            onClick={() => {
              setOpen(!open);
              setNav(1);
            }}
          >
            Setting
          </button>
          <button
            className="btn"
            onClick={handleLeaveLobbyNotify}
            style={{ background: "red", color: "white" }}
          >
            Leave lobby
          </button>
        </div>

        <div className={`sidebar ${open ? "open" : ""}`}>
          {nav === 0 ? <h2>Players</h2> : <h2>Setting</h2>}
          {nav === 0 ? (
            <PlayerSlider players={players} host={hostName} kickPlayer={handleKickPlayer} enableMenu={role === "host" ? true : false} />
          ) : (
            <SettingSlider />
          )}
        </div>

        <div
          className={`overlay ${open ? "show" : ""}`}
          onClick={() => setOpen(false)}
        ></div>

        <div className="right-panel" style={{ display: "none" }}></div>
        <Modal
          show={modal.show}
          onClose={() => setModal({ ...modal, show: false })}
          title={modal.title}
          message={modal.message}
          buttons={modal.buttons}
        />
      </div>
    </div>
  );
}
