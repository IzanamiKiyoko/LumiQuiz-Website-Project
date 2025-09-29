import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

const expandBox = keyframes`
  from { width: 0; }
  to { width: var(--target-width); }
`;

const dropDown = keyframes`
  from { transform: translateY(-40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  height: 40px;
  @media (max-height: 400px) {
    height: 28px;
}
    @media (max-height: 600px) {
    height: 31px;
}
    
`;

const Box = styled.div`
  height: 40px;
  width: 0;
  background: transparent;
  border-radius: 12px;
  animation: ${expandBox} 0.8s forwards;
  @media (max-height: 400px) {
    height: 28px;
}
    @media (max-height: 600px) {
    height: 31px;
}
    @media (max-height: 800px) {
    height: 34px;
}
    @media (max-height: 1000px) {
    height: 37px;
}
  --target-width: 200px;
  
`;

const Name = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  @media (max-height: 400px) {
    height: 28px;
}
    @media (max-height: 600px) {
    height: 31px;
}
    @media (max-height: 800px) {
    height: 34px;
}
    @media (max-height: 1000px) {
    height: 37px;
}
  width: 100%;
  background: #cfbaf0;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight: 600;
  font-size: 1.2rem;
  animation: ${dropDown} 0.5s ease-out forwards;
`;

export default function NameTag({ name }) {
  const [showName, setShowName] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    // đo chiều rộng phù hợp tên
    const temp = document.createElement("span");
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "nowrap";
    temp.style.font = "600 1.2rem 'Segoe UI'";
    temp.innerText = name;
    document.body.appendChild(temp);

    const width = temp.offsetWidth + 40;
    document.body.removeChild(temp);

    boxRef.current.style.setProperty("--target-width", `${width}px`);

    // chỉ hiện name sau khi box mở xong
    const timer = setTimeout(() => setShowName(true), 800);
    return () => clearTimeout(timer);
  }, [name]);

  return (
    <Wrapper name={"player_"+name}>
      <Box ref={boxRef} />
      {showName && <Name>{name}</Name>}
    </Wrapper>
  );
}
