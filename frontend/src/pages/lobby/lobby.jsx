import { useState } from "react";
import { Users, Copy, EyeOff } from 'lucide-react';
import "./lobby.css";

//Component
import PlayerSlider from "../../components/feature/player_slider.jsx";
import SettingSlider from "../../components/feature/setting_slider.jsx";

export default function App() {
  const [volume, setVolume] = useState(50);
  const [pin, setPin] = useState("525 458");
  const [playersCount, setPlayersCount] = useState(0);
  const [hostName, setHostName] = useState("Host");
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState(0);
  const [gameinfo, setGameinfo] = useState({
    title: "Movie Emoji Trivia",
    slides: 12,
    author: "none"
  });
  const players = [
    "Alex", "Sarah", "Mike", "Emma", "David",
    "Lisa", "Tom", "Anna", "Chris", "Maya"
  ];

  return (
    <div className="app">
      <div className="landscape-warning">
        Vui lòng xoay ngang màn hình để có trải nghiệm tốt nhất.
      </div>
      <header className="header">
        <img src="./img/logo.png" alt="Logo" className="logo" />
        <div className="title"> {hostName}'s lobby</div>
        <div className="players-count">
          <Users className="icon" />{playersCount}</div>


      </header>

      <div className="main">
        <div className="pin-card">
          <div className="pin-top-bar">
            <div className="pin-game-info">
              <img src="./img/thumb-example.png" alt="Game Thumbnail" className="game-thumbnail" />
              <div style={{ textAlign: "left" }}>
                <h4 className="text-game-detail">{gameinfo.title}</h4>
                <p className="text-game-detail"> {gameinfo.slides} slides</p>
                <p className="text-game-detail">Author: {gameinfo.author}</p>
              </div>
            </div>
            <img src="./img/icon.png" className="pin-img" />
            <div className="pin-code-detail">
              <p className="pin-label">PIN code:</p>
              <h2 className="pin-number">{pin}</h2>
              <div className="pin-actions">
                <button style={{ marginRight: "20px" }}><Copy style={{ width: "20px", height: "20px" }} /></button>
                <button><EyeOff style={{ width: "20px", height: "20px" }} /></button>
              </div>
            </div>

          </div>
          <div className="pin-player-list">
            <h3 className="waiting">Waiting for players...</h3>

            <div className="players" onClick={() => { setOpen(!open); setNav(0) }}>
              {players.map((p) => (
                <span key={p} className="player">{p}</span>
              ))}
            </div>
          </div>
          <button className="btn">Start game</button>
          <button className="btn">Play with everyone</button>
          <button className="btn" onClick={() => { setOpen(!open); setNav(1) }}>Setting</button>

        </div>
        <div className={`sidebar ${open ? "open" : ""}`}>
          {nav === 0 ? <h2>Players</h2> : <h2>Setting</h2>}
          {nav === 0 ? <PlayerSlider players={players} host={hostName} /> : <SettingSlider />}
        </div>

        <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)}></div>
        {/* RIGHT */}
        <div className="right-panel" style={{ display: "none" }}>
          <div className="game-card">
            <div className="game-actions">
              <h4>Spectator: </h4>
            </div>
          </div>

          <div className="settings-card">
            <h4>Settings</h4>
            <div className="volume-row">
              <label>Master Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
              <span>{volume}%</span>
            </div>

            <div className="sound-row">
              <span>🎵 Music</span>
              <input type="range" />
            </div>
            <div className="sound-row">
              <span>📺 YouTube</span>
              <input type="range" />
            </div>
            <div className="sound-row">
              <span>🎙 Voice</span>
              <input type="range" />
            </div>
            <div className="sound-row">
              <span>⚡ Effects</span>
              <input type="range" />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
