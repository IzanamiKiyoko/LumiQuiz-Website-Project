import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./lobby.css";
//component
import Input from "../../components/input.jsx";
export default function WelcomePin() {
    const [pin, setPin] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const { role } = useParams();
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 2200);
        return () => clearTimeout(t);
    }, []);

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
                    { role === "client" ? <Input hint={"Enter PIN"} /> : "" }
                    <Input hint={"Enter Username"} />
                    <button className="btn">Enter Lobby</button>
                    <div class="overlay_loading">
                        <span className="loader"></span>
                    </div>
                </div>
            </div>
        </div >
    );
}
