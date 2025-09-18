import React, { useState } from 'react';

const CopyButton = ({ textToCopy = "Hello World! 🌟\nĐây là văn bản demo để share\nClick vào nút share để thử!" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonState, setButtonState] = useState('idle'); // idle, copying, success
  const [statusText, setStatusText] = useState('Nhấn để share văn bản');

  const handleCopy = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setButtonState('copying');
    setStatusText('Đang share...');
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      
      setTimeout(() => {
        setButtonState('success');
        setStatusText('Đã share thành công!');
        
        setTimeout(() => {
          setButtonState('idle');
          setStatusText('Nhấn để share văn bản');
          setIsAnimating(false);
        }, 2000);
      }, 600);
      
    } catch (err) {
      console.error('Copy failed: ', err);
      fallbackCopyTextToClipboard(textToCopy);
      
      setTimeout(() => {
        setButtonState('success');
        setStatusText('Đã share thành công!');
        
        setTimeout(() => {
          setButtonState('idle');
          setStatusText('Nhấn để share văn bản');
          setIsAnimating(false);
        }, 2000);
      }, 600);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  };

  const handleMouseEnter = () => {
    if (!isAnimating) {
      setStatusText('Click để share!');
    }
  };

  const handleMouseLeave = () => {
    if (!isAnimating && buttonState !== 'success') {
      setStatusText('Nhấn để share văn bản');
    }
  };

  return (
    <div style={{...styles.copyDIV}}>  
      
      <button 
        style={{
          ...styles.copyButton,
          ...(buttonState === 'success' ? styles.successButton : {})
        }}
        className={`copy-button ${buttonState}`}
        onClick={handleCopy}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Share Icon */}
        <svg 
          style={{
            ...styles.icon,
            ...styles.copyIcon,
            opacity: buttonState === 'idle' ? 1 : 0,
            transform: buttonState === 'idle' ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(90deg)'
          }} 
          viewBox="0 0 24 24"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        
        {/* Check Icon */}
        <svg 
          style={{
            ...styles.icon,
            ...styles.checkIcon,
            opacity: buttonState === 'success' ? 1 : 0,
            transform: buttonState === 'success' ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-90deg)',
            stroke: '#10b981'
          }} 
          viewBox="0 0 24 24"
        >
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        
        {/* Loading Ring */}
        <div 
          style={{
            ...styles.loadingRing,
            opacity: buttonState === 'copying' || buttonState === 'success' ? 1 : 0,
            transform: buttonState === 'copying' || buttonState === 'success' ? 'scale(1)' : 'scale(0.8)'
          }}
        ></div>
      </button>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        .copy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
        }
        
        .copy-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    textAlign: 'center'
  },
  
    copyDIV: {
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  copyButton: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden'
  },
  
  successButton: {
    
  },
  
  icon: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    stroke: '#374151',
    strokeWidth: '2',
    fill: 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  copyIcon: {
    opacity: 1,
    transform: 'scale(1) rotate(0deg)'
  },
  
  checkIcon: {
    opacity: 0,
    transform: 'scale(0.3) rotate(-90deg)'
  },
  
  loadingRing: {
    position: 'absolute',
    width: '36px',
    height: '36px',
    border: '2px solid rgba(16, 185, 129, 0.3)',
    borderTop: '2px solid #10b981',
    borderRadius: '50%',
    opacity: 0,
    transform: 'scale(0.8)',
    transition: 'all 0.3s ease',
    animation: 'spin 1s linear infinite'
  },
  
  statusText: {
    marginTop: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    minHeight: '20px',
    transition: 'all 0.3s ease'
  },
  
  demoText: {
    marginTop: '40px',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '400px',
    fontFamily: "'Courier New', monospace",
    lineHeight: '1.6',
    whiteSpace: 'pre-line'
  }
};

export default CopyButton;