import styled from 'styled-components';
import { shade } from 'polished';
import Button from '~/components/Button';

export const Container = styled.div``;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  width: 100%;

  form {
    background: #f7f9fa;
    border: 2px solid #c5ced6;
    padding: 20px;
    margin: 30px 0;
    width: 100%;
    max-width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
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

    input[name='old_password'] {
      margin-top: 24px;
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    /* border: 2px solid #cca8e9; */
    width: 140px;
    height: 140px;
    border-radius: 50%;
  }

  label {
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

    position: absolute;
    width: 48px;
    height: 48px;
    background: #7955c3;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #fff;
    }

    &:hover {
      background: ${shade(0.2, '#7955c3')};
    }
  }
`;

export const LogoutButton = styled(Button)`
  background: #d3455b;
  &:hover {
    background: ${shade(0.2, '#d3455b')};
  }
`;
