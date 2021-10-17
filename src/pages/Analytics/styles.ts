import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  h2 {
    margin-top: 20px;
    color: #788896;
  }
`;

export const Title = styled.h2`
  margin-top: 20px;
  color: #788896;
  text-align: center;
`;

export const Content = styled.div`
  padding: 0;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1100px) {
    flex-direction: column;
    overflow-x: auto;
  }
`;

export const ChartContainer = styled.div`
  margin: 10px;
`;
