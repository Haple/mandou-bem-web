import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #7955c3;
  height: 50px;
  border-radius: 5px;
  border: 0;
  padding: 14px;
  color: #ffffff;
  width: 100%;
  font-weight: bold;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#7955C3')};
  }
`;
