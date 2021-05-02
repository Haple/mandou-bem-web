import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    margin-top: 20px;
    color: #788896;
    span {
      font-weight: bold;
    }
  }

  form {
    h1 {
      font-size: 16px;
      color: #293845;
      font-weight: bold;
    }
  }
`;

export const Content = styled.div`
  @media (min-width: 700px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export const SelectedCatalogModal = styled.div`
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

export const GiftCardSuccessModal = styled.div`
  p {
    text-align: justify;
    font-style: italic;
    font-size: 16px;
  }

  div:nth-of-type(1n) {
    margin: 0;
    text-align: left;
    width: 100%;

    span {
      label {
        font-weight: bold;
      }
      div {
        margin: 0;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
        img:nth-of-type(1n) {
          max-height: 200px;
        }
        img:nth-of-type(2n) {
          max-height: 100px;
        }
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

export const CustomRewardSuccessModal = styled.div`
  p {
    text-align: justify;
    font-size: 16px;
  }
`;

export const CatalogReward = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

  max-width: 300px;
  margin: 5px;
  padding: 20px 40px;

  span {
    font-size: 16px;
    color: #293845;
    font-weight: bold;
  }

  img {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    /* border: 4px solid #c5ced6; */
    margin: 10px 0px;
    max-height: 130px;
  }

  div {
    margin: 0;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`;
