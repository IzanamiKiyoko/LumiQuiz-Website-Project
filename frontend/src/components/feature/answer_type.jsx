import react from "react";
import "./quiz.css";
export default function answerType() {
    return (
        <div>
            {/* Single Choice */}
            < div className="answerSection" >
                <h3 className="answerTitle">
                    Chọn 1 trong 4 đáp án dưới đây
                </h3>
                {
                    ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'].map((option, idx) => (
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
                    ))
                }
            </div >

            {/* Multiple Choice */}
            < div className="answerSection" >
                <h3 className="answerTitle">
                    <span className="answerNumber" style={{ backgroundColor: "#B9FBC0" }}>2</span>
                    Trắc nghiệm nhiều đáp án
                </h3>
                {
                    ['Python', 'JavaScript', 'HTML', 'CSS'].map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleMultipleChoice(idx)}
                            className={`option ${selectedMultiple.includes(idx) ? "optionSelectedMultiple" : ""}`}
                        >
                            <div className={`checkbox ${selectedMultiple.includes(idx) ? "checkboxSelected" : ""}`}>
                                {selectedMultiple.includes(idx) && <span className="checkmark">✓</span>}
                            </div>
                            <span className="optionText">{option}</span>
                        </button>
                    ))
                }
            </div >

            {/* Sort Order */}
            < div className="answerSection" >
                <h3 className="answerTitle">
                    <span className="answerNumber" style={{ backgroundColor: "#FFCFD2" }}>3</span>
                    Sắp xếp thứ tự
                </h3>
                {
                    sortOrder.map((item, idx) => (
                        <div
                            key={idx}
                            className="sortItem"
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(idx)}
                        >
                            <span className="dragHandle">☰</span>
                            <span className="optionText">{idx + 1}. {item}</span>
                        </div>
                    ))
                }
            </div >

            {/* Text Input */}
            < div className="answerSection" >
                <h3 className="answerTitle">
                    <span className="answerNumber" style={{ backgroundColor: "#F1C0E8" }}>4</span>
                    Nhập câu trả lời
                </h3>
                <input
                    type="text"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Nhập câu trả lời của bạn..."
                    className="textInput"
                />
            </div >
        </div>
    );
}