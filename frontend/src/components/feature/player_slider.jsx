import styled from "styled-components";
import { useState } from "react";
// services
import socket from "../../services/socket.js";

const handleKickPlayer = (playerName, hostName, pin, confirmNotify) => {
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
};

function PlayerSlider({ players, host, enableMenu = false, name, pin, confirmNotify = null }) {
  const [activePlayer, setActivePlayer] = useState(false);
  const rm_host = players.filter((p) => p !== host);
  const reverse_players = [...rm_host].reverse();
  return (
    <div>
      <PlayerCard
        key={host}
        name={host}
        color={"#f1c0e8"}
        role={0}
        enableMenu={enableMenu}
        activePlayer={activePlayer}
        setActivePlayer={setActivePlayer}
        hostName={host}
        pin={pin}
        setModal={confirmNotify}
      />
      {reverse_players.map((p, i) => (
        <PlayerCard
          key={p}
          name={p}
          color={p === name ? "#B9FBC0" : i % 2 === 0 ? "#dfe7fd" : "#cddafd"}
          role={1}
          enableMenu={enableMenu}
          activePlayer={activePlayer}
          setActivePlayer={setActivePlayer}
          hostName={host}
          pin={pin}
        setModal={confirmNotify}
        />
      ))}
    </div>
  );
}

function PlayerCard({
  name,
  color,
  role,
  enableMenu,
  activePlayer,
  setActivePlayer,
  hostName,
  pin,
  setModal = null,
}) {
  const isOpen = activePlayer === name;

  return (
    <Card style={{ background: color }} name={"card_"+name}>
      {name}
      {enableMenu && role === 1 ? (
        <MenuButton name={"menu_"+name}
          onClick={() => setActivePlayer(isOpen ? null : name)}
        >
          ⋯
        </MenuButton>
      ) : null}

      {enableMenu && isOpen && role === 1 && (
        <Panel>
          <Button onClick={() => {handleKickPlayer(name, hostName, pin, setModal)}}>Kick</Button>
        </Panel>
      )}
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  padding: 12px;
  color: black;
  line-height: 1;
  font-weight: bold;
`;

const MenuButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const Panel = styled.div`
  margin-top: 8px;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  background: #fb6f92;
  color: black;
  width: 75%;
  border: none;
  border-radius: 10px;
  padding: 5px;
  font-weight: bold;
`;

export default PlayerSlider;
