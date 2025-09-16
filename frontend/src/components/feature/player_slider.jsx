import styled from "styled-components";
import { useState } from "react";

const Card = styled.div`
  position: relative;
  padding: 12px;
  color: black;
  line-height: 1;
  background: #dfe7fd;
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
function PlayerSlider({ players, host }) {
    return (
        <div>
            <PlayerCard key={0} name={host} color={"#f1c0e8"} role={0} />
            {players.map((p, i) => (
                <PlayerCard key={i+1} name={p} color={i % 2 === 0 ? "#dfe7fd" : "#cddafd"} role={1} />
            ))}
        </div>
    );
}

function PlayerCard({ name, color, role }) {
    const [open, setOpen] = useState(false);

    return (
        <Card style={{ background: color }}>
            {name}
            {role===1 ?
            (
                <MenuButton onClick={() => setOpen(!open)}>⋯</MenuButton>
            ): null}

            {open && role===1 && (
                <Panel>
                    <Button>kick</Button>
                </Panel>
            )}
        </Card>
    );
}

export default PlayerSlider;
