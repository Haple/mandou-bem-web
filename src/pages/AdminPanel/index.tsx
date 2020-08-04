import React from 'react';

import { useHistory } from 'react-router-dom';
import Header from '~/components/Header';
import people from '~/assets/draw-people.svg';
import gift from '~/assets/draw-gift.svg';
import acceptRequest from '~/assets/draw-accept-request.svg';

import { Container, Content, Option } from './styles';
import Button from '~/components/Button';

const AdminPanel: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <Header />
      <Container>
        <Content>
          <Option>
            <img src={people} alt="Ilustração de uma mulher e um homem" />
            <Button light onClick={() => history.push('/admin-panel/users')}>
              Colaboradores
            </Button>
          </Option>
          <Option>
            <img
              src={gift}
              alt="Ilustração de um rapaz sentado em uma grande caixa de presentes"
            />
            <Button light onClick={() => history.push('/admin-panel/catalog')}>
              Catálogo
            </Button>
          </Option>
          <Option>
            <img
              src={acceptRequest}
              alt="Ilustração de uma mulher analisando solicitações"
            />
            <Button light>Prêmios resgatados</Button>
          </Option>
        </Content>
      </Container>
    </>
  );
};

export default AdminPanel;
