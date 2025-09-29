import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { ChevronDown, Check } from "lucide-react";

// --- Styled Components ---
const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  text-align: left;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 16px;
  width: 160px;

  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }
`;

const Menu = styled(motion.ul)`
  position: absolute;
  left: 0;
  margin-top: 8px;
  width: 160px;

  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;

  /* Bỏ bullet mặc định */
  list-style: none;
  padding: 0;
  margin: 0;

  /* Nếu nhiều hơn 5 mục thì bật scroll */
  max-height: 200px; /* khoảng ~5 items */
  overflow-y: auto;

  /* Thanh cuộn nhẹ nhàng */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;

  /* Đặt sẵn không gian cho icon tick */
  padding: 10px 16px 10px 12px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  /* Icon container */
  .icon {
    width: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    background: #eef2ff;
    color: #4f46e5;
  }
`;

// --- Component ---
const Dropdown = ({ label = "Chọn mục", items = [], disabled = false, name="" }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <DropdownWrapper>
      <DropdownButton onClick={() => {if (!disabled) setOpen((prev) => !prev)}} name={"btn_" + name}>
        <span>{selected ? selected.label : label}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </DropdownButton>

      <AnimatePresence>
        {open && (
          <Menu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            name={"list_" + name}
          >
            {items.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  setSelected(item);
                  setOpen(false);
                  item.onClick?.();
                }}
              >
                <span className="icon">
                  {selected?.label === item.label && (
                    <Check size={16} color="#4f46e5" />
                  )}
                </span>
                <span>{item.label}</span>
              </MenuItem>
            ))}
          </Menu>
        )}
      </AnimatePresence>
    </DropdownWrapper>
  );
};

export default Dropdown;
