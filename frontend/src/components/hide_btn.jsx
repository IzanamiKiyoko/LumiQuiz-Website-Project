import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function HideButton({ onToggle, name="" }) {
    const [hidden, setHidden] = useState(false);
    const handleClick = () => {
        const newHidden = !hidden;
        setHidden(newHidden);
        if (onToggle) onToggle(newHidden); // gửi trạng thái cho App
    };
    return (
        <button
            className={`hide-btn ${hidden ? "hidden" : ""}`}
            onClick={handleClick}
            name={name}
        >
            <span className={`icon-wrapper ${!hidden ? "show" : "hide"}`}>
                <Eye className="icon" />
            </span>
            <span className={`icon-wrapper ${hidden ? "show" : "hide"}`}>
                <EyeOff className="icon" />
            </span>

            <style jsx>{`
        .hide-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
            background: rgba(255, 255, 255, 0.2);
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
            boxShadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          overflow: hidden;

          transition: background 0.3s ease, transform 0.2s ease;
        }

        .hide-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        }

        .icon-wrapper {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .icon {
          width: 20px;
          height: 20px;
          color: black;
        }

        .icon-wrapper.show {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          z-index: 1;
        }

        .icon-wrapper.hide {
          opacity: 0;
          transform: scale(0.8) rotate(-20deg);
          z-index: 0;
        }
      `}</style>
        </button>
    );
}
