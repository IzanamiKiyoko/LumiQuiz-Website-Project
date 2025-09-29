import React from "react";
export default function Modal({ show, onClose, title, message, buttons = [], element_name = "" }) {
  if (!show) return null;
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const contentStyle = {
    background: "#fff",
    padding: "25px 30px",
    borderRadius: "12px",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    animation: "slideDown 0.3s ease-out",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "20px",
  };

  const buttonStyle = {
    padding: "8px 20px",
    background: "#ff6b81",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  };

  const handleMouseOver = (e) => (e.target.style.background = "#ff4757");
  const handleMouseOut = (e) => (e.target.style.background = "#ff6b81");

  return (
    <div style={overlayStyle} name={element_name}>
      <div style={contentStyle}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={buttonContainerStyle}>
          {buttons.map((btn, index) => (
            <button
              key={index}
              style={buttonStyle}
              onClick={btn.onClick}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              name={"modal_btn_"+btn.label}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes slideDown {
            from {opacity:0; transform:translateY(-20px);}
            to {opacity:1; transform:translateY(0);}
          }
        `}
      </style>
    </div>
  );
}
