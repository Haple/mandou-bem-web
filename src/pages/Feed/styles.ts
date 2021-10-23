import styled from 'styled-components';

export const Container = styled.div`
  /* background: #5c5c; */
  /* margin: 20px 160px; */
  width: 100%;
  /* margin: 1em; */
  display: flex;
  flex-direction: row;
  justify-content: center;

  aside {
    margin: 1em;
  }

  @media screen and (max-width: 800px) {
    aside {
      display: none;
    }
  }
`;

export const Content = styled.div`
  margin: 0 1em;
  @media screen and (max-width: 500px) {
    margin: 0;
  }
  max-width: 700px;
  /* background: #fff444; */

  /* flex-wrap: wrap; */
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  /* max-width: 650px; */
  /* margin-right: 20px; */

  h2 {
    margin-top: 1em;
    color: #788896;
    text-align: center;
    strong {
      font-weight: bold;
    }
  }
`;

export const PostsList = styled.div``;
export const Post = styled.div`
  border: 2px solid #c5ced6;
  background: #fff;
  margin: 30px 0;
  padding: 20px;

  color: #293845;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;

  .fromTo {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    strong {
      margin: 0 10px;
      font-weight: bold;
      font-size: 20px;
      color: #44aea0;
    }

    img {
      border-radius: 50%;
      height: 45px;
    }
  }

  .content {
    li {
      list-style: none;

      hr {
        border: 0;
        border-top: 1px solid #ccc;
        margin: 10px 0;
      }
    }
  }

  .comments {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    textarea {
      /* max-width: 100%;
     */
      width: 100%;
      border: 2px solid #c5ced6;

      border-radius: 5px;
      padding: 10px;
      color: #293845;
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
    }
    button {
      margin: 5px 0px 5px 10px;
      width: auto;
    }

    @media screen and (max-width: 500px) {
      flex-direction: column;
      button {
        margin: 5px;
        width: 100%;
      }
    }
  }
`;

export const NewPost = styled.div`
  @media screen and (max-width: 500px) {
    ul {
      position: fixed;
      left: 1em;
      overflow-y: scroll;
      height: 10em;
    }
  }

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
      /* border: 2px solid #c5ced6; */
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
    border: 2px solid #cca8e9;
    border-radius: 5px;
    padding: 10px;
    color: #293845;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
  }
  form {
    div {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    button {
      /* width: auto; */
      font-size: 16px;
      /* border: none; */
    }
  }
`;
export const Ranking = styled.div`
  margin-top: 30px;
  border: 2px solid #c5ced6;
  background: #fff;
  color: #3b4955;
  padding-top: 25px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  text-align: center;

  img {
    border-radius: 50%;
    height: 45px;
  }

  ul {
    margin-top: 20px;
  }

  li {
    border-top: 2px solid #c3cfd9;
    border-bottom: 1px solid #c3cfd9;
    background: #f7f9fa;
    padding: 5px 15px;
    margin: 0;

    color: #293845;
    text-align: center;
    list-style: none;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    span {
      margin-left: 10px;
    }
  }
`;

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

export const UserItem = styled.span`
  /* white-space: initial; */
  box-sizing: border-box;
  position: relative;
  span {
    overflow-wrap: break-word;
    inline-size: 60%;
  }

  max-width: 250px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  color: #293845;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;

  img {
    border-radius: 50%;
    margin: 5px 10px;
    height: 35px;
  }
`;

export const EnpsSurveyModal = styled.div`
  input[type='radio'] {
    margin: 5px;
  }

  .score {
    width: 100%;

    div {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

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
      font-size: 1em;
      margin-left: 10px;
    }
  }
`;
