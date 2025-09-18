import styled from "styled-components";
import { useState, useEffect } from "react";

//component
import Switch from "../switch.jsx";
const Card = styled.div`
  position: relative;
  padding: 15px;
  color: black;
  line-height: 1;
  background: #98f5e1;
  font-weight: bold;
`;

const sliderStyles = `
.slider {
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
}

.slider:hover {
  background: linear-gradient(
    to right,
    #f59e0b 0%,
    #f97316 var(--value, 50%),
    #ec4899 var(--value, 50%),
    #8b5cf6 100%
  );
}

.slider::-webkit-slider-track {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  height: 8px;
  border-radius: 4px;
}

.slider::-moz-range-track {
  background: transparent;
  cursor: pointer;
  height: 8px;
  border-radius: 4px;
  border: none;
}

.slider::-webkit-slider-thumb {
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

.slider::-moz-range-thumb {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  height: 18px;
  width: 18px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  transition: all 0.2s ease;
}

.slider:hover::-webkit-slider-thumb {
  transform: scale(1.1);
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
}

.slider:hover::-moz-range-thumb {
  transform: scale(1.1);
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
}

.slider:active::-webkit-slider-thumb {
  transform: scale(1.15);
  background: linear-gradient(135deg, #ea580c, #dc2626);
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
}

.slider:active::-moz-range-thumb {
  transform: scale(1.15);
  background: linear-gradient(135deg, #ea580c, #dc2626);
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
}

.slider:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

.slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
}

.slider:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
}
`;

const Slider = ({
  value = [0],
  onValueChange,
  max = 100,
  min = 0,
  step = 1,
  className = "",
  unit = "",
  ...props
}) => {
  const handleChange = (e) => {
    const newValue = [Number.parseInt(e.target.value)];
    onValueChange?.(newValue);
  };

  return (
    <div className={`relative flex w-full items-center ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="slider"
          style={{ "--value": `${Math.round((value[0] / max) * 100)}%` }}
          {...props}
        />
        <p>{unit === "%" ? Math.round(((value[0] + min) / max) * 100) + unit : (value[0] + min) + unit}</p>
      </div>
    </div>
  );
};

function SettingSlider() {
  const [musicValue, setMusicValue] = useState(50);
  const [soundValue, setSoundValue] = useState(50);
  const [timePerSlideValue, setTimePerSlideValue] = useState(23);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const openFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

  const closeFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  const handleToggle = (state) => state ? openFullscreen() : closeFullscreen();

  useEffect(() => {
    const handleFullscreenChange = () => {setIsFullscreen(!!document.fullscreenElement);}
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  return (
    <div>
      <Card>
        <span>Music</span>
        <Slider
          value={[musicValue]}
          onValueChange={(newValue) => setMusicValue(newValue[0])}
          max={100}
          step={1}
          unit="%"
        />
      </Card>

      <Card>
        <span>Sound</span>
        <Slider
          value={[soundValue]}
          onValueChange={(newValue) => setSoundValue(newValue[0])}
          max={100}
          step={1}
          unit="%"
        />
      </Card>

      <Card>
        <span>Time per slide</span>
        <Slider
          value={[timePerSlideValue]}
          onValueChange={(newValue) => setTimePerSlideValue(newValue[0])}
          max={110}
          min={10}
          step={5}
          unit="s"
        />
      </Card>
      <Card>
        <Switch
          color="blue"
          size="medium"
          label="Fullscreen mode"
          labelPosition="left"
          on={isFullscreen}
          onToggle={handleToggle}
        />
      </Card>
    </div>
  );
}

export default SettingSlider;
