import React, { useCallback, useRef, useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { FiSend } from 'react-icons/fi';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import '@webscopeio/react-textarea-autocomplete/style.css';
import defaultAvatar from '~/assets/default-avatar.png';

import Header from '~/components/Header';

import {
  Container,
  Content,
  PostsList,
  Post,
  NewPost,
  Ranking,
  UserItem,
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

interface IUserSearchResult {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

const UserListItem = ({ entity }: { entity: IUserSearchResult }) => (
  <UserItem>
    <div>
      <img
        src={entity.avatar ? entity.avatar : defaultAvatar}
        alt={entity.username}
      />
      <br />
      <span>{entity.name}</span>
    </div>
  </UserItem>
);

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

  const searchUsersByUsername = useCallback(async (username: string) => {
    const response = await api.get<IUserSearchResult[]>('/users', {
      params: {
        username_like: username,
      },
    });
    return response.data;
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
              <div>
                <ReactTextareaAutocomplete
                  name="new_post_content"
                  cols={70}
                  rows={10}
                  placeholder="Que tal reconhecer aquela pessoa bacana que trabalha com você?"
                  className="my-textarea"
                  // onChange={(e) => console.log(e.target.value)}
                  loadingComponent={() => <span>Loading</span>}
                  trigger={{
                    '@': {
                      dataProvider: (token) => {
                        return searchUsersByUsername(token);
                      },
                      component: UserListItem,
                      output: (item, trigger) => `@${item.username}`,
                      allowWhitespace: false,
                      afterWhitespace: true,
                    },
                  }}
                />
              </div>

              <div>
                <Button light type="submit">
                  <FiSend />
                  Enviar
                </Button>
              </div>
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
