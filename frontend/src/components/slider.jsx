import React from "react";
import styled from "styled-components";

const SliderInput = styled.input.attrs({ type: "range" })`
  margin-top: 15px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  height: 8px;
  border-radius: 4px;
  outline: none;
  background: linear-gradient(
    to right,
    #fef3c7 0%,
    #fed7aa var(--value, 50%),
    #f9a8d4 var(--value, 50%),
    #c7d2fe 100%
  );
  background-size: 100% 100%;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(
      to right,
      #f59e0b 0%,
      #f97316 var(--value, 50%),
      #ec4899 var(--value, 50%),
      #8b5cf6 100%
    );
  }

  &::-webkit-slider-track {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    height: 8px;
    border-radius: 4px;
  }

  &::-moz-range-track {
    background: transparent;
    cursor: pointer;
    height: 8px;
    border-radius: 4px;
    border: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    height: 18px;
    width: 18px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    transition: all 0.2s ease;
    position: relative;
  }

  &::-moz-range-thumb {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    height: 18px;
    width: 18px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    transition: all 0.2s ease;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.1);
    background: linear-gradient(135deg, #f59e0b, #ea580c);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  }

  &:hover::-moz-range-thumb {
    transform: scale(1.1);
    background: linear-gradient(135deg, #f59e0b, #ea580c);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  }

  &:active::-webkit-slider-thumb {
    transform: scale(1.15);
    background: linear-gradient(135deg, #ea580c, #dc2626);
    box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
  }

  &:active::-moz-range-thumb {
    transform: scale(1.15);
    background: linear-gradient(135deg, #ea580c, #dc2626);
    box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
  }

  &:focus-visible {
    outline: 2px solid #f59e0b;
    outline-offset: 2px;
  }

  &:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
  }

  &:focus-visible::-moz-range-thumb {
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
  }
`;

export default function Slider({
  value = [0],
  onValueChange,
  max = 100,
  min = 0,
  step = 1,
  className = "",
  unit = "",
  ...props
}) {
  const handleChange = (e) => {
    const newValue = [Number.parseInt(e.target.value)];
    onValueChange?.(newValue);
  };

  return (
    <div className={`relative flex w-full items-center ${className}`}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
        <SliderInput
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          style={{ "--value": `${Math.round((value[0] / max) * 100)}%` }}
          {...props}
        />
        <p>
          {unit === "%"
            ? Math.round(((value[0] + min) / max) * 100) + unit
            : value[0] + min + unit}
        </p>
      </div>
    </div>
  );
}
