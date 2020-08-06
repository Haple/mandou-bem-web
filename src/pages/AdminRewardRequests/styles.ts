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

  button {
    /* width: 100%; */
    flex-grow: 0;
    align-self: right;
  }

  div {
    display: flex;
    flex-direction: row;
    justify-content: left;
    margin-top: 10px;

    img {
      border-radius: 50%;
      margin-right: 10px;
      height: 60px;
    }

    > div {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      color: #293845;

      strong {
        font-weight: bold;
        padding-bottom: 5px;
      }
    }
  }
`;
