import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #ffffff;
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  transition: border-color 0.2s;

  border: 2px solid #C5CED6;
  color: #666360;

  display: flex;
  align-items: center;
  position: relative;

  & + div {
    margin-top: 8px;
  }

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      color: #7955c3;
      border-color: #7955c3;
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: #7955c3;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #35434F;
    width: 100%;

    &::placeholder {
      color: #C5CED6;
      font-weight: bold;
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active  {
      -webkit-box-shadow: 0 0 0 30px white inset !important;
  }

  svg {
    margin-right: 16px;
  }

  div{
    position: relative;
    width: 100%;
  }

  label {
    position: absolute;
    transform: translate(1px, 1px) scale(1);
    transition: all 150ms ease-in;
    color: #B0B0B0;

    ${(props) =>
      (props.isFocused || props.isFilled) &&
      css`
        transform: translateY(-15px);
        /* transform: translate(0, 4px) scale(0.75); */
        font-size: 0.8em;
        color: #636161;
      `}
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
