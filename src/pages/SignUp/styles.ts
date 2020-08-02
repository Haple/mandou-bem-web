import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  /* height: 100vh; */
  flex-direction: column;
  /* flex: 1; */

  background: #b987e1;

  display: flex;
  /* align-items: stretch; */

  > img {
    max-height: 200px;
  }
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
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 100px;

  /* width: 100%; */

  > span {
    margin-bottom: auto;
    margin-right: 100px;
    max-width: 450px;
    font-size: 30px;
  }
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: auto;

  animation: ${appearFromRight} 1s;

  form {
    background: #ffffff;
    padding: 16px;
    border: 2px solid #c5ced6;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#F4EDE8')};
      }
    }
  }

  > a {
    color: #fff;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#fff')};
    }
  }
`;
