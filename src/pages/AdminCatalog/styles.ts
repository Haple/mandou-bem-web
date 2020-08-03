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

export const CatalogReward = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

  max-width: 300px;
  margin: 5px;
  padding: 20px;

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

    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;

export const AddCatalogReward = styled.button`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

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
