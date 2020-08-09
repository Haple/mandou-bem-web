import styled from 'styled-components';

export const Container = styled.div`
  /* background: #5c5c; */
  margin: 20px 160px;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 700px) {
    aside {
      display: none;
    }
  }
`;

export const Content = styled.div`
  /* background: #fff444; */

  /* flex-wrap: wrap; */
  display: flex;
  flex-direction: column;
  width: 650px;
  margin-right: 20px;

  h2 {
    font-size: 24px;

    color: #788896;
    strong {
      font-weight: bold;
    }
    margin-bottom: 10px;
  }
`;

export const PostsList = styled.div``;
export const Post = styled.div``;
export const NewPost = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #c5ced6;
  background: #fff;
  padding: 20px;
  width: auto;
  & > div {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
    button {
      border: 2px solid #c5ced6;
      font-weight: normal;
      margin-top: 0;
      margin-right: 5px;
      width: auto;
    }
  }

  textarea {
    width: 100%;
    min-height: 100px;
    min-width: 100%;
    max-width: 100%;
    border: 2px solid #c5ced6;
    border-radius: 5px;
    padding: 10px;
    color: #293845;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }
  form {
    div {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    button {
      /* width: 150px;
      height: 50px; */
    }
  }
`;
export const Ranking = styled.div``;

export const CatalogCallToAction = styled.div`
  border: 2px solid #c5ced6;
  background: #fff;
  color: #3b4955;
  padding: 25px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  text-align: center;
  /* justify-content: center; */

  h2 {
    font-size: 18px;
    > strong {
      font-weight: bold;
    }
    margin-bottom: 20px;
  }

  button {
    font-size: 20px;
    font-weight: normal;
    height: 50px;
    width: auto;
  }
`;

export const UserItem = styled.div`
  color: #293845;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  div {
    display: flex;
    flex-direction: row;
  }

  img {
    border-radius: 50%;
    margin-right: 10px;
    height: 35px;
  }
`;
