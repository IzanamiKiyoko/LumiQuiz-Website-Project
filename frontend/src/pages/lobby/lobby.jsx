import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./lobby.css";
// components
import PlayerSlider from "../../components/feature/player_slider.jsx";
import SettingSlider from "../../components/feature/setting_slider.jsx";
import CopyButton from "../../components/copy_btn.jsx";
import ShowHideButton from "../../components/hide_btn.jsx";
import ShareButton from "../../components/share_btn.jsx";
import Modal from "../../components/modal.jsx";
import NameCard from "../../components/name_tag.jsx";
import Toast from "../../components/toast_notify.jsx";
// services
import socket from "../../services/socket.js";
export default function Lobby() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, pin, role, quizId } = location.state || {};
  if (!name) {
    navigate(`/lobby/${role || "client"}`);
  }

  const [playersCount, setPlayersCount] = useState(0);
  const [gameinfo, setGameinfo] = useState({});
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState(0);
  const [players, setPlayers] = useState([]); // luôn là array rỗng
  const [hostName, setHostName] = useState("Host");
  const [loading, setLoading] = useState(false);
  const [hidePin, setHidePin] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "" });
  const [toast, setToast] = useState({ show: false, message: "", duration: 3000 });
  const [initialSetting, setInitialSetting] = useState(null);
  const [hostStatus, setHostStatus] = useState(false);
  const origin = window.location.origin;
  // --- Xử lý cập nhật room ---
  const handleRoomUpdate = (data) => {
    console.log("Received room update:", data);
    if (data.pin === pin) {
      const newPlayers = Array.isArray(data.players) ? data.players : [];
      setPlayers(newPlayers);
      setPlayersCount(newPlayers.length);
      setHostName(data.host || "Host");
      setHidePin(data.hide)
      setHostStatus(data.isPlayWith)
      setGameinfo({id: quizId, title: data.quiz.title, slides: data.quiz.questions.length, image_url: data.quiz.image_url});
      if (data.isPlayWith) {
        setPlayers((prevPlayers) => {
          const updated = [data.host, ...prevPlayers];
          setPlayersCount(updated.length);
          return updated;
        });
      }
      else {
        setPlayers((prevPlayers) => {
          const updated = prevPlayers.filter((p) => p !== data.host);
          setPlayersCount(updated.length);
          return updated;
        });
      }
    }
    else {
      navigate(`/lobby/${role || "client"}`); // nếu pin không đúng thì quay về trang nhập pin
      alert("Phòng không tồn tại hoặc đã đóng.");
    }
  };
  const confirmNotify = (title, message, action = null) => {
    setModal({
      show: true,
      title: title || t("warning"),
      message: message,
      buttons: [
        {
          label: t("confirm"),
          onClick: () => {
            setModal({ ...modal, show: false });
            action?.();
          }
        }
      ],
    });
  };
  const confirmCancelNotify = (title, message, action = null) => {
    setModal({
      show: true,
      title: title || t("warning"),
      message: message,
      buttons: [
        {
          label: t("confirm"),
          onClick: () => {
            setModal({ ...modal, show: false });
            action?.();
          }
        },
        {
          label: t("cancel"),
          onClick: () => {
            setModal({ ...modal, show: false });
          }
        }
      ],
    });
  };
  const handleSetToast = (message, duration) => {
    console.log("Toast set:", { message, duration });
    setToast({
      show: true,
      message: message,
      duration: duration || 3000
    });

  }

  const startGame = () => {
    setLoading(true);
    socket.emit("requestStartGame", pin, (data) => {
      if (data?.success) {
        navigate(`/lobby/room/playing`, { state: { name, pin } });
      }
      else {
        setLoading(false);
        if (localStorage.getItem("language") === "vi") {
          confirmNotify("Lỗi", "Đã xảy ra lỗi khi bắt đầu trò chơi, vui lòng thử lại");
        }
        else {
          confirmNotify("Error", "Something wrong when starting game, please try again later")
        }
      }
    });
  }
  useEffect(() => {
    const handleSomeoneJoin = (data) => {
      if (data?.name) {
        setPlayers((prevPlayers) => {
          const updated = [data.name, ...prevPlayers];
          setPlayersCount(updated.length);
          return updated;
        });
      }
    };

    const handleAcceptHidePin = (data) => setHidePin(data.hide);

    const handleSomeoneLeave = (data, message) => {
      if (data.name === name) {
        confirmNotify(t("notification"), message, () =>
          navigate(`/lobby/${role || "client"}`)
        );
        return;
      }
      setPlayers((prevPlayers) => {
        const updated = prevPlayers.filter((p) => p !== data.name);
        setPlayersCount(updated.length);
        return updated;
      });
    };
    const handleCloseLobby = () => {
      confirmNotify(t("notification"), localStorage.getItem("language") === "vi" ? "Chủ phòng đã đóng phòng chờ" : "The host has closed the lobby.", () =>
        navigate(`/lobby/${role || "client"}`)
      );
      return;
    }

    const handlePlayWith = (data) => {
      console.log("host: " + hostName)
      setHostStatus(data.isPlayWith);
      if (data.isPlayWith) {
        setPlayers((prevPlayers) => {
          const updated = [hostName, ...prevPlayers];
          setPlayersCount(updated.length);
          return updated;
        });
        setToast({
          show: true,
          message: localStorage.getItem("language") === "vi" ? `${hostName} đã tham gia chơi cùng mọi người` : `${hostName} joined in playing with everyone.`,
          duration: 3000
        });
      }
      else {
        setPlayers((prevPlayers) => {
          const updated = prevPlayers.filter((p) => p !== hostName);
          setPlayersCount(updated.length);
          return updated;
        });
        setToast({
          show: true,
          message: localStorage.getItem("language") === "vi" ? `${hostName} đã chuyển trạng thái người xem` : `${hostName} changed status to viewer`,
          duration: 3000
        });
      }
    }
    
    const handleStartGame = (data) => {
      if (data?.playNow) {
        setLoading(true);
        navigate(`/lobby/room/playing`, { state: { name, pin } });
      }
    }
    socket.on("someoneJoin", handleSomeoneJoin);
    socket.on("acceptRequestHidePin", handleAcceptHidePin);
    socket.on("responseKickPlayer", (data) => handleSomeoneLeave(data, localStorage.getItem("language") === "vi" ? "Bạn đã bị đá khỏi phòng chờ" : "You have been kicked from the lobby."));
    socket.on("responseCloseLobby", handleCloseLobby);
    socket.on("responseSomeoneLeave", (data) => handleSomeoneLeave(data, localStorage.getItem("language") === "vi" ? "Rời phòng chờ thành công" : "Leave the lobby successfully."));
    socket.on("responePlayWith", handlePlayWith);
    socket.on("responseStartGame", handleStartGame);
    socket.emit("getCurrentLobbyState", pin, (data) => {
      if (data?.success) {
        handleRoomUpdate(data.room);
        setInitialSetting(data.setting || null);
      }
    });
    i18n.changeLanguage(localStorage.getItem("language") || "vi");
    return () => {
      socket.off("someoneJoin", handleSomeoneJoin);
      socket.off("acceptRequestHidePin", handleAcceptHidePin);
      socket.off("responseKickPlayer", handleSomeoneLeave);
      socket.off("responseSomeoneLeave", handleSomeoneLeave);
      socket.off("responseCloseLobby", handleCloseLobby);
      socket.off("responePlayWith", handlePlayWith);
      socket.off("responseStartGame", handleStartGame);
    };
  }, [hostName]);

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
        {t("rotate_device")}
      </div>

      <header className="header">
        <img src="/img/logo.png" alt="Logo" className="logo" />
        <div className="title" name="title">{t("lobby_title", { name: hostName })}</div>
        <div className="players-count" name="player_count" onClick={() => {
          setOpen(!open);
          setNav(0);
        }}>
          <Users className="icon" /> {playersCount + (hostStatus ? 0 : 1)}
        </div>
      </header>

      <div className="main">
        <div className="pin-card">
          <div className="pin-top-bar">
            <div className="pin-game-info">
              <img
                src={gameinfo.image_url}
                alt="Game Thumbnail"
                className="game-thumbnail"
              />
              <div style={{ textAlign: "left" }}>
                <h4 className="text-game-detail">{gameinfo.title}</h4>
                <p className="text-game-detail">{gameinfo.slides} slides</p>
              </div>
            </div>
            <img src="/img/icon.png" className="pin-img" />
            <div className="pin-code-detail">
              <p className="pin-label">{t("pin_code")}</p>
              <h2 className="pin-number" name="pin_code">{hidePin ? "******" : pin}</h2>
              <div className="pin-actions">
                <CopyButton textToCopy={pin} style={{ width: "10px", height: "10px" }} name={"btn_copy_pin"} />
                {role === "host" ? <ShowHideButton name={"btn_hide_pin"} onToggle={(isHidden) => requestHidePin(isHidden)} /> : ""}
                <ShareButton textToCopy={`Join ${hostName}'s game using PIN: ${pin}. URL: ${origin}/lobby/client/${pin}`} name={"btn_share_lobby"} />
              </div>
            </div>
          </div>

          <div className="pin-player-list">
            {playersCount === 0 ? <h3 className="waiting">{t("waiting_for_player")} <span className="waiting_ani"></span></h3> : ""}
            <div
              className="players"
              onClick={() => {
                setOpen(!open);
                setNav(0);
              }}
              id="player-list"
            >
              {players?.map((p) => (
                <NameCard key={p} name={p} />
              ))}
            </div>
          </div>

          {role === "host" ? <button className="btn" disabled={playersCount === 0} onClick={startGame}>{t("start_game")}</button> : ""}
          {role === "host" ? <button className="btn" name="playWith" onClick={() => {
            socket.emit("requestPlayWith", pin, (data) => {
              if (!data?.success) {
                if (localStorage.getItem("language") === "vi")
                  confirmNotify("Cảnh báo", "Lỗi không thể tham gia cùng mọi người");
                else
                  confirmNotify("Warning", "Error cannot join everyone");
              }
            })
          }}>{hostStatus ? t("spectator_view") : t("play_with_everyone")}</button> : ""}
          <button
            className="btn"
            onClick={() => {
              setOpen(!open);
              setNav(1);
            }}
            name="btn_setting"
          >
            {t("setting")}
          </button>
        </div>

        <div name="nav_board" className={`sidebar ${open ? "open" : ""}`}>
          {nav === 0 ? <h2 name="nav_title">{t("players")}</h2> : <h2 name="nav_title">{t("setting")}</h2>}
          {nav === 0 ? (
            <PlayerSlider
              players={players}
              host={hostName}
              name={name}
              enableMenu={role === "host" ? true : false}
              confirmNotify={confirmNotify}
              pin={pin} />
          ) : (
            <SettingSlider
              pin={pin}
              name={name}
              role={name === hostName ? 0 : 1}
              confirmNotify={confirmNotify}
              confirmCancelNotify={confirmCancelNotify}
              toast={handleSetToast}
              initialSetting={initialSetting}
              clearSetting={() => setInitialSetting(null)} />
          )}
        </div>
        
        <div
          className={`overlay ${open ? "show" : ""}`}
          onClick={() => setOpen(false)}
          name="overlay"
        ></div>

        <div className="right-panel" style={{ display: "none" }}></div>
        {toast.show && (
          <Toast
            message={toast.message || "Error"}
            duration={toast.duration || 3000}
            onClose={() => setToast({ ...toast, show: false })}
            name={"toast_notification"}
          />
        )}
        <Modal
          show={modal.show}
          onClose={() => setModal({ ...modal, show: false })}
          title={modal.title}
          message={modal.message}
          buttons={modal.buttons}
          element_name={"modal"}
        />
        {loading && (
          <div className="overlay_loading">
            <span className="loader"></span>
          </div>
        )}
      </div>
    </div>
  );
}
