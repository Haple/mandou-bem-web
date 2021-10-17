import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    margin-top: 1em;
    color: #788896;
    text-align: center;
  }
`;

export const Content = styled.div`
  /* @media (min-width: 800px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  } */
  width: 100%;
  max-width: 1000px;
  /* padding: 1em; */
  /* display: grid;
  place-items: center; */

  h3 {
    font-weight: bold;
  }
`;

export const RewardRequestsContainer = styled.div`
  overflow-x: auto;
  width: 100%;
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

export const SearchOptions = styled.div`
  background: #fff;
  border: 2px solid #c5ced6;
  width: 100%;
  padding: 15px;

  div {
    margin: 5px;
    display: flex;
    flex-direction: row;
    @media (max-width: 500px) {
      flex-direction: column;
    }
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;
