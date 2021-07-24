import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    margin-top: 20px;
    color: #788896;
  }
`;

export const Content = styled.div`
  @media (min-width: 700px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

interface EnpsScoreProps {
  score: number;
}

export const EnpsScore = styled.div<EnpsScoreProps>`
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin: 5px 10px;
    display: flex;
    flex-direction: column;

    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */

    text-align: center;
    vertical-align: middle;
    label{
      font-size: 12px;
    }
    span{
      font-size: 24px;
      font-weight: bold;
    }
    ${(props) =>
      props.score >= 50 &&
      css`
        background-color: #8dd7cf;
      `}
      ${(props) =>
        props.score >= 0 &&
        props.score < 50 &&
        css`
          background-color: #fbe192;
        `}
      ${(props) =>
        props.score < 0 &&
        css`
          background-color: #e9a2ad;
        `}
`;

export const EnpsSurvey = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  color: #293845;

  background: #fff;
  border: 2px solid #c5ced6;

  max-width: 300px;
  margin: 5px;
  padding: 20px;

  /* div:nth-of-type(2n) {
    margin: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  } */
`;

export const AddEnpsSurvey = styled.button`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px dashed #c5ced6;

  width: 300px;
  margin: 5px;
  padding: 30px;

  color: #7955c3;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.6;
  }
  svg {
    width: 80px;
    height: 80px;
  }
`;
