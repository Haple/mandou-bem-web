import React, { useCallback, useRef, useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { FiSend } from 'react-icons/fi';
import Header from '~/components/Header';

import {
  Container,
  Content,
  PostsList,
  Post,
  NewPost,
  Ranking,
  CatalogCallToAction,
} from './styles';
import api from '~/services/api';
import Button from '~/components/Button';
import Input from '~/components/Input';

interface IUserData {
  recognition_points: number;
}

interface IRemainingPointsToSend {
  remaining_points: number;
}

const Feed: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async () => {
    console.log('AHA');
  }, []);

  const [userData, setUserData] = useState<IUserData>({} as IUserData);
  const [remainingPointsToSend, setRemainingPointsToSend] = useState<
    IRemainingPointsToSend
  >({} as IRemainingPointsToSend);

  useEffect(() => {
    async function loadUserData(): Promise<void> {
      const response = await api.get<IUserData>('/profile');
      setUserData(response.data);
    }

    async function loadRemainingPointsToSend(): Promise<void> {
      const response = await api.get<IRemainingPointsToSend>(
        '/remaining-points',
      );
      setRemainingPointsToSend(response.data);
    }

    loadUserData();
    loadRemainingPointsToSend();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Content>
          <h2>
            Você tem{' '}
            <strong>{remainingPointsToSend.remaining_points} pontos</strong>{' '}
            para enviar
          </h2>
          <NewPost>
            <div>
              <Button light>+Pontos</Button>
              <Button light>@Colaborador</Button>
              <Button light>#Hashtag</Button>
            </div>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <textarea
                name="new_post_content"
                id=""
                cols={30}
                rows={10}
                placeholder="Que tal reconhecer aquela pessoa bacana que trabalha com você?"
              />

              <Button light type="submit">
                <FiSend />
                Enviar
              </Button>
            </Form>
          </NewPost>
        </Content>
        <aside>
          <CatalogCallToAction>
            <h2>
              Você tem <strong>{userData.recognition_points} pontos</strong>{' '}
              para resgatar
            </h2>
            <Button light onClick={() => history.push('/catalog')}>
              Resgatar prêmio
            </Button>
          </CatalogCallToAction>
        </aside>
      </Container>
    </>
  );
};

export default Feed;
