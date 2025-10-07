import React, { useState, useEffect } from "react";

export default function CountdownCircle({ onFinish }) {
  const [count, setCount] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0 && !isFinished) {
      setIsFinished(true);

      // chạy hiệu ứng xong mới callback
      setTimeout(() => {
        setShowFinal(true);

        // sau hiệu ứng (1.3s) → gọi callback nếu có
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 1300);
      }, 1000);
    }
  }, [count, isFinished, onFinish]);

  return (
    <div style={styles.container}>
      <div style={styles.circleWrapper}>
        <div
          style={{
            ...styles.circle,
            transform: showFinal ? "scale(1.2)" : "scale(1)",
            opacity: showFinal ? 0 : 1,
            transition: "all 0.6s ease",
          }}
        >
          {/* sweep 4 màu pastel */}
          {count <= 4 && <div style={{ ...styles.layer, animation: "sweepPink 1s forwards" }} />}
          {count <= 3 && <div style={{ ...styles.layer, animation: "sweepBlue 1s forwards" }} />}
          {count <= 2 && <div style={{ ...styles.layer, animation: "sweepYellow 1s forwards" }} />}
          {count <= 1 && <div style={{ ...styles.layer, animation: "sweepGreen 1s forwards" }} />}
          {count === 0 && !showFinal && (
            <div style={{ ...styles.layer, animation: "sweepFull 1s forwards" }} />
          )}
        </div>

        {/* số */}
        <div style={styles.numberWrapper}>
          <span
            style={{
              ...styles.number,
              color: count === 0 ? "white" : "#374151",
              transform: count === 0 ? "scale(1.2)" : "scale(1)",
              transition: "all 0.3s ease",
            }}
          >
            {count}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes sweepPink {
          from { background: conic-gradient(from -90deg, #FFB5E8 0deg, transparent 0deg); }
          to   { background: conic-gradient(from -90deg, #FFB5E8 90deg, transparent 90deg); }
        }
        @keyframes sweepBlue {
          from { background: conic-gradient(from 0deg, #AEC6FF 0deg, transparent 0deg); }
          to   { background: conic-gradient(from 0deg, #AEC6FF 90deg, transparent 90deg); }
        }
        @keyframes sweepYellow {
          from { background: conic-gradient(from 90deg, #FFF9AE 0deg, transparent 0deg); }
          to   { background: conic-gradient(from 90deg, #FFF9AE 90deg, transparent 90deg); }
        }
        @keyframes sweepGreen {
          from { background: conic-gradient(from 180deg, #B4F8C8 0deg, transparent 0deg); }
          to   { background: conic-gradient(from 180deg, #B4F8C8 90deg, transparent 90deg); }
        }
        @keyframes sweepFull {
          from { background: conic-gradient(from -90deg, #E0BBE4 0deg, transparent 0deg); }
          to   { background: conic-gradient(from -90deg, #E0BBE4 360deg, transparent 360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  circleWrapper: {
    position: "relative",
    width: "240px",
    height: "240px",
  },
  circle: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    overflow: "hidden",
  },
  layer: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
  },
  numberWrapper: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: "90px",
    fontWeight: "bold",
  },
};
