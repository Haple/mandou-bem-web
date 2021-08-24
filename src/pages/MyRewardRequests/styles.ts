import styled from 'styled-components';

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

export const RewardRequestsContainer = styled.div`
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

export const RewardRequest = styled.div`
  margin-bottom: 10px;
  background: #fff;
  border: 2px solid #c5ced6;
  width: 100%;
  padding: 15px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .summary {
    text-align: left;
    width: 60%;

    span {
      label {
        font-weight: bold;
      }
    }

    img {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
      margin: 10px 0px;
      max-width: 250px;
    }
  }

  .actions {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const SearchOptions = styled.div`
  background: #fff;
  border: 2px solid #c5ced6;
  width: 80%;
  padding: 15px;

  div {
    margin: 5px;
    display: flex;
    flex-direction: row;
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

export const QrCodeModal = styled.div`
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

export const DetailsModal = styled.div`
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

export const ReprovedModal = styled.div`
  p {
    text-align: justify;
    font-style: italic;
    font-size: 16px;
  }

  img {
    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
    /* margin: 10px 0px; */
    max-width: 250px;
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
