import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #b987e1;
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
  margin: 1em;
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 500px) {
    flex-direction: column;
    justify-content: space-between;
  }

  .welcome {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;

    > span {
      font-size: 30px;
    }

    > img {
      align-self: center;
      width: 100%;
      max-height: 250px;
    }
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
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: auto;
  width: 100%;
  max-width: 500px;

  animation: ${appearFromRight} 1s;

  form {
    background: #ffffff;
    padding: 16px;
    border: 2px solid #c5ced6;
    width: 100%;
    max-width: 340px;
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
