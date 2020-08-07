import React from 'react';

import Header from '~/components/Header';

import { Container, Content } from './styles';

const Feed: React.FC = () => {
  return (
    <>
      <Header />
      <Container>
        <Content>Opa</Content>
      </Container>
    </>
  );
};

export default Feed;
