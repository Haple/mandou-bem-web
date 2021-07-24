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
  /* @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  } */
  width: 100%;
  display: grid;
  place-items: center;

  h3 {
    font-weight: bold;
  }
`;

interface ClassificationProps {
  type: 'detractor' | 'passive' | 'promoter';
}
export const Classification = styled.div<ClassificationProps>`
  border-radius: 25px;
  margin: 10px;
  background: #dfe6ed;
  display: flex;
  flex-direction: row;
  width: 100%;

  span {
    margin: 5px;
  }
  .score {
    text-align: center;
    min-width: 40px;
    height: 40px;
    border-radius: 25px;
    padding: 5px;
    display: grid;
    place-items: center;
    font-weight: bold;

    ${(props) =>
      props.type === 'detractor' &&
      css`
        background: #e9a2ad;
      `}
      ${(props) =>
        props.type === 'passive' &&
        css`
          background: #fbe192;
        `}
      ${(props) =>
        props.type === 'promoter' &&
        css`
          background: #8dd7cf;
        `}
  }

  .percentage{
    margin-left: 5px;
    display: grid;
    place-items: center;
  }
`;

export const Details = styled.div`
  /* padding: 30px; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80%;

  font-size: 16px;
  color: #293845;
`;

export const Results = styled.div`
  background: #fff;
  border: 2px solid #c5ced6;
  width: 54%;
  padding: 15px;

  .no-answers {
    width: 100%;
    display: grid;
    place-items: center;
    img {
      max-width: 200px;
    }
  }

  .enps-container {
    display: flex;
    flex-direction: row;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .classifications {
    width: 70%;
    margin: 10px;
  }

  .total-answers {
    font-style: italic;
    width: 100%;
    text-align: right;
    padding: 10px;
  }
`;

export const Configs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border: 2px solid #c5ced6;
  width: 44%;
  padding: 15px;
  label {
    font-weight: bold;
    margin-top: 50px;
  }

  .options {
    margin: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;

export const AnswerHeader = styled.div`
  background: #fff;
  border: 2px solid #c5ced6;
  padding: 15px;
  font-size: 16px;
  color: #293845;
  margin-bottom: 5px;
`;

export const AnswersContainer = styled.div`
  width: 80%;
  font-size: 16px;
  color: #293845;

  table {
    background: #fff;
    border: 2px solid #c5ced6;
    padding: 15px;
    width: 100%;
    border: 2px solid #c5ced6;
    border-collapse: collapse;

    th {
      text-align: left;
    }

    tr:hover {
      background-color: #ddd;
    }

    td,
    th {
      border: 2px solid #c5ced6;
      padding: 8px;
    }
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

export const EndEnpsSurveyModal = styled.div`
  div:nth-of-type(1n) {
    margin: 0;
    text-align: left;
    width: 100%;

    span {
      label {
        font-weight: bold;
      }
    }
  }

  div:nth-of-type(2n) {
    margin: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;
