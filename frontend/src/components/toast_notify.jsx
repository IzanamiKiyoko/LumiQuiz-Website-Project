import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { X } from "lucide-react";

// --- Styled Components ---
const NotificationWrapper = styled(motion.div)`
  position: absolute;
  top: 16px;
  left: 16px;
  min-width: 260px;
  max-width: 320px;

  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
`;

const TextRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;

  &:hover {
    color: #ef4444;
  }
`;

const ProgressBar = styled(motion.div)`
  height: 4px;
  width: 100%;
  margin-top: 8px;
  border-radius: 4px;
  background: #4f46e5;
`;

// --- Component ---
const Notification = ({ message, duration = 3000, onClose, name }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <NotificationWrapper 
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          name = {name}
        >
          <TextRow>
            <span>{message}</span>
            <CloseButton
              onClick={() => {
                setShow(false);
                onClose?.();
              }}
            >
              <X size={16} />
            </CloseButton>
          </TextRow>

          <ProgressBar
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </NotificationWrapper>
      )}
    </AnimatePresence>
  );
};

export default Notification;
