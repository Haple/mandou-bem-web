import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    margin: 20px 0;
    color: #788896;
  }
  h3 {
    margin-top: 1em;
    color: #788896;
    text-align: center;
  }
`;

export const RewardRequest = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

  /* width: 65%; */
  width: 100%;
  max-width: 900px;
  margin: 1em;
  padding: 20px;

  .content {
    display: flex;
    flex-direction: row;
    @media (max-width: 500px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    justify-content: left;
    margin-top: 10px;

    img {
      border-radius: 50%;
      margin-right: 10px;
      max-width: 60px;
      max-height: 60px;
      min-width: 60px;
      min-height: 60px;
    }

    > div {
      margin: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      font-size: 16px;
      color: #293845;
      label {
        font-weight: bold;
      }
    }
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    button {
      margin: 10px;
    }
    @media (max-width: 500px) {
      flex-direction: column;
      justify-content: center;
      button {
        margin: 5px 0px;
      }
    }
  }
`;

export const ReproveModal = styled.div`
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
