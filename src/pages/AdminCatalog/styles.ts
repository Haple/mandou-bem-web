import styled from 'styled-components';

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
  margin: 1em;
  padding: 1em;
  width: 100%;
  max-width: 700px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-row-gap: 1em;
  grid-column-gap: 1em;
`;

export const CatalogReward = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

  padding: 20px;

  span {
    font-size: 16px;
    color: #293845;
    font-weight: bold;
  }

  img {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 10px 0px;
    width: 100%;
    height: 100%;
    max-width: 250px;
    max-height: 250px;
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
  border: 2px dashed #c5ced6;

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

export const SelectedGiftCardModal = styled.div`
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

export const SwitchGiftCardModal = styled.div`
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
