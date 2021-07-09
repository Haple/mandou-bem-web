import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2,
  h3 {
    margin: 20px 0;
    color: #788896;
  }
`;

export const RewardRequest = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

  width: 65%;
  margin: 5px;
  padding: 20px;

  > div {
    display: flex;
    flex-direction: row;
    margin-top: 10px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    button {
      max-width: 49%;
    }
  }

  img {
    margin: 10px;
    width: 300px;
    align-self: center;
  }
`;

export const RewardRequestData = styled.div`
  width: 100%;
  font-size: 16px;
  color: #293845;

  label {
    font-weight: bold;
  }
`;

export const ValidateRewardModal = styled.div`
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

export const GetRewardModal = styled.div`
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

export const GetRewardWithQRCodeModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    margin-bottom: 10px;
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
