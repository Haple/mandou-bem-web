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
  }}

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

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  background: #fff;
  border: 2px solid #c5ced6;

  max-width: 300px;
  margin: 5px;
  padding: 20px;

  div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;

    img {
      border-radius: 50%;
      margin-right: 10px;
      height: 60px;
    }

    > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      font-size: 16px;
      color: #293845;

      strong {
        font-weight: bold;
        padding-bottom: 5px;
      }

      span {
        overflow-wrap: break-word;
        inline-size: 150px;
      }
    }
    button:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;

export const AddUser = styled.button`
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
