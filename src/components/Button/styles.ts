import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ContainerProps {
  light?: boolean;
  disabled?: boolean;
}

export const Container = styled.button<ContainerProps>`
  /* background: #7955c3; */
  height: 40px;
  border-radius: 5px;
  border: 0;
  padding: 10px;
  /* color: #ffffff; */
  width: 100%;
  font-weight: bold;
  margin-top: 16px;
  transition: background-color 0.2s;

  ${(props) =>
    props.light &&
    css`
      border: 2px solid #cca8e9;
      color: #7955c3;
      background: #ffffff;
      &:hover {
        background: ${shade(0.1, '#ffffff')};
      }
    `}

  ${(props) =>
    !props.light &&
    css`
      color: #ffffff;
      background: #7955c3;
      &:hover {
        background: ${shade(0.2, '#7955c3')};
      }
    `}

    ${(props) =>
      props.disabled &&
      css`
        cursor: not-allowed;
        opacity: 0.6;
        &:hover {
          background: #ffffff;
        }
      `}

  svg {
    vertical-align: text-top;
    margin-right: 10px;
  }
`;
