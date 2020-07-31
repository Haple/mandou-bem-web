import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  flex-direction: column;

  height: 100vh;
  background: #b987e1;

  display: flex;
  align-items: stretch;
`;

export const Header = styled.header`
  align-items: left;
  width: auto;
  margin: 0;
  display: flex;
`;

export const HeaderContent = styled.div`
  padding: 26px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;

  width: 100%;
  /* max-width: 700px; */
`;

const appearFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  animation: ${appearFromTop} 1s;
`;
