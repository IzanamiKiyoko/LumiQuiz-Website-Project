import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./lobby/pin_lobby.jsx";
export default function IconTest() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby/:role" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  )
}
