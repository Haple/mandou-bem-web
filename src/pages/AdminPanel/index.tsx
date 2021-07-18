import React from 'react';

import { useHistory } from 'react-router-dom';
import Header from '~/components/Header';
import people from '~/assets/draw-people.svg';
import gift from '~/assets/draw-gift.svg';
import connected from '~/assets/draw-connected.svg';
import connectingTeams from '~/assets/draw-connecting-teams.svg';
import acceptRequest from '~/assets/draw-accept-request.svg';
import giftCard from '~/assets/draw-gift-card.svg';
import analytics from '~/assets/draw-data.svg';
import survey from '~/assets/draw-survey.svg';

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
            <img
              src={connected}
              alt="Ilustração de três circulos conectados e com pessoas dentro"
            />
            <Button
              light
              onClick={() => history.push('/admin-panel/positions')}
            >
              Cargos
            </Button>
          </Option>
          <Option>
            <img
              src={connectingTeams}
              alt="Ilustração de um homem segurando três engrenagens"
            />
            <Button
              light
              onClick={() => history.push('/admin-panel/departments')}
            >
              Departamentos
            </Button>
          </Option>
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
            <Button
              light
              onClick={() => history.push('/admin-panel/reward-requests')}
            >
              Prêmios resgatados
            </Button>
          </Option>
          <Option>
            <img
              src={giftCard}
              alt="Ilustração de uma mulher com um grande vale-presente"
            />
            <Button
              light
              onClick={() => history.push('/admin-panel/validate-reward')}
            >
              Validar prêmio
            </Button>
          </Option>
          <Option>
            <img src={survey} alt="Ilustração de uma prancheta de pesquisas" />
            <Button
              light
              onClick={() => history.push('/admin-panel/enps-surveys')}
            >
              Pesquisas E-NPS
            </Button>
          </Option>
          <Option>
            <img src={analytics} alt="???" />
            <Button
              light
              onClick={() => history.push('/admin-panel/analytics')}
            >
              Análise e Inteligência
            </Button>
          </Option>
        </Content>
      </Container>
    </>
  );
};

export default AdminPanel;
