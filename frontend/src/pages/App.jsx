import { BrowserRouter, Routes, Route } from "react-router-dom";
import PIN_Lobby from "./lobby/pin_lobby.jsx";
import Lobby from "./lobby/lobby.jsx";
export default function IconTest() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby/:rname/:lobby_id" element={<PIN_Lobby />} />
        <Route path="/lobby/:rname" element={<PIN_Lobby />} />
        <Route path="/lobby/room" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  )
}
