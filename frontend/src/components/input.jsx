import React, { useState } from "react";

function Input({ hint = "", type = "text", onChange , defaultValue = "", keyDown = null, element_name =  ""}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    setValue(e.target.value);       // ✅ Cập nhật state bên trong
    if (onChange) onChange(e.target.value); // ✅ Gửi ra ngoài nếu cần
  };

  return (
    <div style={wrapperStyle} className={value ? "focused" : ""}>
      <label
        style={{
          ...labelStyle,
          ...(value ? activeLabelStyle : {}),
        }}
      >
        {hint}
      </label>
      <input
        style={inputStyle}
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={keyDown}
        onFocus={(e) => e.target.parentElement.classList.add("focused")}
        onBlur={(e) =>
          e.target.parentElement.classList.toggle("focused", !!e.target.value)
        }
        name ={element_name}
      />
    </div>
  );
}

// 🎨 Enhanced Gradient Styles
const wrapperStyle = {
  position: "relative",
  display: "inline-block",
  width: "350px",
  padding: "3px",
  borderRadius: "12px",
  // Gradient viền như cũ
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  // Thêm animation cho gradient
  backgroundSize: "300% 300%",
  animation: "gradientShift 4s ease infinite",
  // Shadow với màu viền cũ
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
  transition: "all 0.3s ease",
};

const inputStyle = {
  width: "100%",
  padding: "16px 14px 8px 14px",
  // Background với màu mới
  background: "linear-gradient(145deg, #98f5e1 0%, #a3c4f3 100%)",
  border: "none",
  outline: "none",
  borderRadius: "10px",
   boxSizing: "border-box",
  color: "#1a202c", // Đổi màu text thành tối để đọc được trên nền sáng
  fontSize: "16px",
  fontWeight: "500",
  // Bỏ text shadow vì nền sáng
  transition: "all 0.3s ease",
};

const labelStyle = {
  position: "absolute",
  top: "16px",
  left: "16px",
  color: "#4a5568", // Đổi màu label thành tối để đọc được trên nền sáng
  fontSize: "16px",
  fontWeight: "500",
  pointerEvents: "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const activeLabelStyle = {
  top: "-10px",
  left: "12px",
  fontSize: "13px",
  fontWeight: "600",
  // Màu text tối cho nền sáng
  color: "#2d3748",
  // Background sáng cho label
  background: "#ffffff",
  padding: "2px 6px",
  borderRadius: "6px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  // Border gradient với màu viền cũ cho label
  backgroundImage: "linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
};

// CSS Animation cho gradient
const styles = `
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  /* Hover effect với màu viền cũ */
  .gradient-input-wrapper:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4) !important;
  }
  
  /* Focus effect với màu viền cũ */
  .gradient-input-wrapper.focused {
    transform: translateY(-1px);
    box-shadow: 0 10px 36px rgba(102, 126, 234, 0.5) !important;
  }
  
  .gradient-input-wrapper.focused input {
    background: linear-gradient(145deg, #a3c4f3 0%, #98f5e1 100%) !important;
  }
`;

// Inject styles vào head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  if (!document.head.querySelector('style[data-gradient-input]')) {
    styleSheet.setAttribute('data-gradient-input', 'true');
    document.head.appendChild(styleSheet);
  }
}

// Enhanced component với className để apply hover effects
function EnhancedInput({hint = "", type = "text", defaultValue = ""}) {
  const [value, setValue] = useState("");

  return (
    <div 
      style={wrapperStyle} 
      className={`gradient-input-wrapper ${value ? "focused" : ""}`}
    >
      <label
        style={{
          ...labelStyle,
          ...(value ? activeLabelStyle : {}),
        }}
      >
        Tên của bạn
      </label>
      <input
        style={inputStyle}
        type="text"
        value={defaultValue ?? value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={(e) => e.target.parentElement.classList.add("focused")}
        onBlur={(e) =>
          e.target.parentElement.classList.toggle("focused", !!e.target.value)
        }
        placeholder=""
      />
    </div>
  );
};

export default Input;