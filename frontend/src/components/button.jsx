// CuteButton.jsx
import React from "react";
import styled, { keyframes, css } from "styled-components";

// Animation nhún nhảy khi hover
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    animation: ${bounce} 0.4s ease;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  /* Style có thể override từ props */
  ${props => props.customStyle && css`${props.customStyle}`}
`;

const btn = ({ children, onClick, customStyle, name}) => {
  return <Button onClick={onClick} customStyle={customStyle} name={name}>{children}</Button>;
};

export default btn;
