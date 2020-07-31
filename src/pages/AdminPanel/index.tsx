import React from 'react';
// import { Link } from 'react-router-dom';

// import Input from '~/components/Input';
// import Button from '~/components/Button';

import {
  Container,
  Content,
  AnimationContainer,
  Header,
  HeaderContent,
} from './styles';

const AdminPanel: React.FC = () => {
  return (
    <Container>
      <Header>
        <HeaderContent>
          <h2>
            Mandou <b>Bem</b>
          </h2>
        </HeaderContent>
      </Header>

      <Content>
        <AnimationContainer>
          <h2>Painel administrativo</h2>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default AdminPanel;
