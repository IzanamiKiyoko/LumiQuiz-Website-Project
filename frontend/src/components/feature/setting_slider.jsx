import styled from "styled-components";
import { useState, useEffect } from "react";
import { BadgeQuestionMark } from "lucide-react";
import { useTranslation } from "react-i18next";
//component
import Switch from "../switch.jsx";
import Button from "../button.jsx";
import Dropdown from "../dropdown.jsx";
import Slider from "../slider.jsx";
// services
import socket from "../../services/socket.js";

function SettingSlider({ pin, name, role, confirmNotify, confirmCancelNotify, toast, initialSetting, clearSetting }) {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // đổi ngôn ngữ
  };
  const [musicValue, setMusicValue] = useState(50);
  const [soundValue, setSoundValue] = useState(50);
  const [timePerSlideValue, setTimePerSlideValue] = useState(initialSetting?.timePerSlide || 20);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "vi");
  const [minusPoint, setMinusPoint] = useState(initialSetting?.minusPoint || false);
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

  const handleFullScreen = (state) => state ? openFullscreen() : closeFullscreen();

  const handleSetTimePerSlide = (value) => {
    setTimePerSlideValue(value);
    socket.emit("requestChangeTimePerSlide", pin, value, (data) => {
      if (!data.success) {
        if (localStorage.getItem("language") === "vi")
          confirmNotify("Cảnh báo", "Thay đổi thời gian mỗi slide thất bại");
        else
          confirmNotify("Warning", "Fail when changing time per slide");
      }
    });
  }
  useEffect(() => {
    const handleFullscreenChange = () => { setIsFullscreen(!!document.fullscreenElement); }
    document.addEventListener("fullscreenchange", handleFullscreenChange);


    socket.on("responseChangeTimePerSlide", (data) => {
      setTimePerSlideValue(data.value);
      if (localStorage.getItem("language") === "vi")
        toast(`${data.host} đã thay đổi thời gian mỗi slide thành ${data.value}s`, 3000);
      else
        toast(`${data.host} changed the time of each slide to ${data.value}s`, 3000);
    });

    socket.on("responseMinusPoint", (data) => {
      setMinusPoint(data.value);
      if (localStorage.getItem("language") === "vi")
        toast(`${data.host} đã ${data.value ? `bật` : `tắt`} tính năng trừ điểm`, 3000);
      else
        toast(`${data.host} has turned ${data.value ? `on` : `off`} the minus point feature`, 3000);
    });
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      socket.off("responseChangeTimePerSlide");
      socket.off("responseMinusPoint");
    }
  }, []);
  clearSetting?.();
  return (
    <div>
      <Card name="st_music">
        <span>{t("music")}</span>
        <Slider
          value={[musicValue]}
          onValueChange={(newValue) => { setMusicValue(newValue[0]); localStorage.setItem("musicVolume", newValue[0]) }}
          max={100}
          step={1}
          unit="%"
        />
      </Card>

      <Card name="st_sound">
        <span>{t("sound")}</span>
        <Slider
          value={[soundValue]}
          onValueChange={(newValue) => { setSoundValue(newValue[0]); localStorage.setItem("soundVolume", newValue[0]) }}
          max={100}
          step={1}
          unit="%"
        />
      </Card>
      <Card>
        <Switch
          color="blue"
          size="medium"
          label={t("fullscreen")}
          labelPosition="left"
          isOn={isFullscreen}
          onToggle={handleFullScreen}
        />
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span>{t("language")}</span>
          <Dropdown label={language === "vi" ? "Tiếng Việt" : "English"} items={[
            { label: "Tiếng Việt", onClick: () => { localStorage.setItem("language", "vi"); changeLanguage("vi"); } },
            { label: "English", onClick: () => { localStorage.setItem("language", "en"); changeLanguage("en"); } },
          ]} />
        </div>
      </Card>
      <Card name="st_minusPoint">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span>{t("minus_point")}</span>
          <div style={{ width: "60%" }} name="info"> <BadgeQuestionMark onClick={() => {
            if (localStorage.getItem("language") === "vi")
              confirmNotify("Thông tin", "Khi bật tính năng này, mỗi câu trả lời sai sẽ bị trừ số điểm bị mất trong thanh điểm.");
            else
              confirmNotify("Infomation", "When this feature is enabled, Each wrong answer will deduct the lost points from the score bar.");
          }} /> </div>
          <Switch
            name={"sw_minusPoint"}
            color="blue"
            size="medium"
            label={""}
            labelPosition="left"
            isOn={minusPoint}
            disabled={role != 0 ? true : false}
            onToggle={(state) => {
              socket.emit("requestMinusPoint", pin, state, (data) => {
                setMinusPoint(state);
                if (!data.success) {
                  if (localStorage.getItem("language") === "vi")
                    confirmNotify("Cảnh báo", state ? "Bật" : "Tắt" + "Tính năng trừ điểm thất bại");
                  else
                    confirmNotify("Warning", state ? "Enable" : "Disable" + "Minus point feature failed");
                }
              });
            }}
          />
        </div>
      </Card>
      <Card name="st_tps">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span>{t("time_per_slide")}</span>
          <Dropdown label={timePerSlideValue + "s"} items={[
            { label: "10s", onClick: () => handleSetTimePerSlide(10) },
            { label: "15s", onClick: () => handleSetTimePerSlide(15) },
            { label: "20s", onClick: () => handleSetTimePerSlide(20) },
            { label: "25s", onClick: () => handleSetTimePerSlide(25) },
            { label: "30s", onClick: () => handleSetTimePerSlide(30) },
            { label: "45s", onClick: () => handleSetTimePerSlide(45) },
            { label: "60s", onClick: () => handleSetTimePerSlide(60) },
          ]} disabled={role != 0 ? true : false} name={"dd_tps"} />
        </div>
      </Card>

      <Card style={{ textAlign: "center" }}>
        <Button children={t("leave_lobby")}
          customStyle={`background: red`}
          name={"btn_leave"}
          onClick={() => {
            if (!name) return;
            {
              localStorage.getItem("language") === "vi" ?
                confirmCancelNotify("Cảnh báo", "Bạn có chắc chắn muốn rời phòng chờ?" + (role === 0 ? " (Với tư cách chủ phòng, rời phòng sẽ đóng phòng chờ với tất cả người chơi.)" : ""), () => {
                  socket.emit("requestLeave", pin, name, (data) => {
                    if (!data.success) {
                      confirmNotify("Cảnh báo", "Rời phòng chờ thất bại");
                    }
                  });
                }) :
                confirmCancelNotify("Warning", "Are you sure you want to leave the lobby?" + (role === 0 ? " (As host, leaving will close the lobby for all players.)" : ""), () => {
                  socket.emit("requestLeave", pin, name, (data) => {
                    if (!data.success) {
                      confirmNotify("Warning", "Fail when leaving lobby");
                    }
                  });
                });
            }
          }} />
      </Card>

    </div>
  );
}

const Card = styled.div`
  position: relative;
  padding: 15px;
  color: black;
  line-height: 1;
  background: #98f5e1;
  font-weight: bold;
`;



export default SettingSlider;
