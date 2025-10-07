import React, { useState, useEffect } from 'react';
import { Settings, Users, Trophy, CircleStar } from 'lucide-react';
import { useTranslation } from "react-i18next";
import "./quiz.css";

//component
import PlayerSlider from "../../components/feature/player_slider.jsx";
import SettingSlider from "../../components/feature/setting_slider.jsx";
import CountdownCircle from '../../components/countdown.jsx';
export default function QuizInterface() {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(1000);
  const [selectedSingle, setSelectedSingle] = useState(null);
  const [cdStart, setCdStart] = useState(true);
  const [selectedMultiple, setSelectedMultiple] = useState([]);
  const [sortOrder, setSortOrder] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  const [textAnswer, setTextAnswer] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [nav, setNav] = useState(0);
  const totalTime = 60;
  const circumference = 283;
  const progress = (timeLeft / totalTime) * circumference;

  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (!cdStart) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        setScore(prev => prev > 0 ? Math.max(0, prev - 16.67) : 0); // Giảm từ 1000 -> 0 trong 60 giây
      }, 1000);
      return () => clearInterval(timer);
    }
    i18n.changeLanguage(localStorage.getItem("language") || "vi");
  }, [cdStart]);

  const handleSingleChoice = (index) => {
    setSelectedSingle(index);
  };

  const handleMultipleChoice = (index) => {
    setSelectedMultiple(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newOrder = [...sortOrder];
    const temp = newOrder[draggedIndex];
    newOrder[draggedIndex] = newOrder[dropIndex];
    newOrder[dropIndex] = temp;

    setSortOrder(newOrder);
    setDraggedIndex(null);
  };

  return (
    <div className="container">
      {cdStart?
      <div>
        <CountdownCircle onFinish={() => setCdStart(false)}></CountdownCircle>
      </div>:``}
      <div style={{ display: cdStart ? "none" : "block" }}>
        <header className="header" >
          <img src="/img/logo.png" alt="Logo" className="logo" />
          <div>
            <h3 style={{ margin: "5px" }}></h3>
            <div className="player-detail">
              <Trophy></Trophy>6
              <CircleStar></CircleStar>6000
            </div>
          </div>
          <div>
            <Settings style={{ marginRight: "10px" }} onClick={() => {
              setOpen(!open);
              setNav(1);
            }}></Settings>
            <Users style={{ marginRight: "10px" }} onClick={() => {
              setOpen(!open);
              setNav(0);
            }}></Users>
          </div>
        </header>

        <div className="mainContainer">
          {/* Question Card */}
          <div className="questionCard">
            <div className="questionHeader">
              Câu hỏi số 1
            </div>
            <div className="questionBody">
              <div>
                <p className="questionText">
                  Hãy chọn câu trả lời đúng nhất trong các phương án dưới đây. Đây là câu hỏi về địa lý Việt Nam. Hãy chọn câu trả lời đúng nhất trong các phương án dưới đây. Đây là câu hỏi về địa lý Việt Nam.Hãy chọn câu trả lời đúng nhất trong các phương án dưới đây. Đây là câu hỏi về địa lý Việt Nam.Hãy chọn câu trả lời đúng nhất trong các phương án dưới đây. Đây là câu hỏi về địa lý Việt Nam.Hãy chọn câu trả lời đúng nhất trong các phương án dưới đây. Đây là câu hỏi về địa lý Việt Nam.
                </p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
                  alt="Quiz"
                  className="questionImage"
                />
              </div>
            </div>
          </div>

          {/* Answer Sections */}
          <div className="answerCard">
            <div className="questionHeader">
              Câu trả lời
            </div>
            <div className="scoreBar">
              <div className="progressBarContainer">
                <div
                  className="progressBarFill"
                  style={{ width: `${(score / 1000) * 100}%` }}
                >
                  {score > 0 && (
                    <span className="scoreText">
                      {Math.round(score)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="answerSection">
              <h3 className="answerTitle">
                Chọn 1 trong 4 đáp án dưới đây
              </h3>
              {['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'].map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSingleChoice(idx)}
                  className={`option ${selectedSingle === idx ? "optionSelectedSingle" : ""}`}
                >
                  <div className={`radioCircle ${selectedSingle === idx ? "radioSelected" : ""}`}>
                    {selectedSingle === idx && <div className="radioInner"></div>}
                  </div>
                  <span className="optionText">{option}</span>
                </button>
              ))}
              <button className="submitBtn">
                Nộp bài
              </button>
            </div>
          </div>
        </div>

        <div name="nav_board" className={`sidebar ${open ? "open" : ""}`}>
          {nav === 0 ? <h2 name="nav_title">{t("players")}</h2> : <h2 name="nav_title">{t("setting")}</h2>}
          {nav === 0 ? (""
          ) : (""
          )}
        </div>

        <div
          className={`overlay ${open ? "show" : ""}`}
          onClick={() => setOpen(false)}
          name="overlay"
        ></div>
      </div>
    </div >
  );
}