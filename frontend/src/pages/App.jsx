import { BrowserRouter, Routes, Route } from "react-router-dom";
import PIN_Lobby from "./lobby/pin_lobby.jsx";
import Lobby from "./lobby/lobby.jsx";
import Quiz from "./quizing/quizApp.jsx";
import TestAni from "../components/countdown.jsx";
export default function IconTest() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby/:rname/:lobby_id" element={<PIN_Lobby />} />
        <Route path="/lobby/:rname" element={<PIN_Lobby />} />
        <Route path="/lobby/room" element={<Lobby />} />
        <Route path="/lobby/room/playing" element={<Quiz />} />
        <Route path="/test" element={<TestAni />} />
      </Routes>
    </BrowserRouter>
  )
}
