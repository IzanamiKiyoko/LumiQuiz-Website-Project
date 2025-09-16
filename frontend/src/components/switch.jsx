import React, { useState } from "react";
import styled, { css } from "styled-components";

const sizes = {
  small: { w: "40px", h: "20px", dot: "16px", move: "20px" },
  medium: { w: "48px", h: "24px", dot: "20px", move: "24px" },
  large: { w: "64px", h: "32px", dot: "28px", move: "32px" },
};

const colors = {
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  pink: "#ec4899",
  orange: "#f97316",
  off: "#d1d5db",
};

const Wrapper = styled.div`
   display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: space-between;
  ${(p) => p.reverse && css`flex-direction: row-reverse;`}
  width: 100%; /* để chiếm đủ chiều ngang cha */
`;

const Button = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  background: ${(p) => (p.on ? colors[p.color] : colors.off)};
  width: ${(p) => sizes[p.size].w};
  height: ${(p) => sizes[p.size].h};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  transition: background-color 0.3s ease-in-out;
  outline: none;

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}
`;

const Dot = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  background: #ffffff;
  border-radius: 9999px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  width: ${(p) => sizes[p.size].dot};
  height: ${(p) => sizes[p.size].dot};
  transform: ${(p) => (p.on ? `translateX(${sizes[p.size].move})` : "none")};
  transition: transform 0.3s ease-in-out;
`;

const Label = styled.span`
  color: #374151;
  font-weight: bold;
  user-select: none;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

const Switch = ({
  isOn = false,
  onToggle,
  disabled = false,
  size = "medium",
  color = "blue",
  label = "",
  labelPosition = "right",
}) => {
  const [state, setState] = useState(isOn);

  const handleToggle = () => {
    if (disabled) return;
    const newState = !state;
    setState(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <Wrapper reverse={labelPosition === "left"}>
      <Button
        type="button"
        role="switch"
        aria-checked={state}
        onClick={handleToggle}
        on={state}
        color={color}
        size={size}
        disabled={disabled}
      >
        <Dot size={size} on={state} />
      </Button>

      {label && <Label disabled={disabled}>{label}</Label>}
    </Wrapper>
  );
};

export default Switch;
