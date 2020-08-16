import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  TextareaHTMLAttributes,
} from 'react';

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
import { useToast } from '~/hooks/toast';
import api from '~/services/api';
import Button from '~/components/Button';

interface IProfileData {
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

interface IRecognitionPost {
  comments: [
    {
      user_id: string;
      user_name: string;
      content: string;
    },
  ];
  id: string;
  from_user_id: string;
  to_user_id: string;
  from_name: string;
  to_name: string;
  content: string;
  recognition_points: number;
  created_at: string;
}

const Feed: React.FC = () => {
  const { addToast } = useToast();

  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const postRef = useRef<ReactTextareaAutocomplete<IUserSearchResult>>(null);

  const [
    selectedUserResult,
    setSelectedUserResult,
  ] = useState<IUserSearchResult | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<number | null>(null);
  const [postContent, setPostContent] = useState<string>('');

  const [userSearchResults, setUserSearchResults] = useState<
    IUserSearchResult[]
  >([]);

  const [profileData, setProfileData] = useState<IProfileData | null>(null);
  const [remainingPointsToSend, setRemainingPointsToSend] = useState<
    IRemainingPointsToSend
  >({} as IRemainingPointsToSend);

  const loadUserData = useCallback(async () => {
    const response = await api.get<IProfileData>('/profile');
    setProfileData(response.data);
  }, []);

  const loadRemainingPointsToSend = useCallback(async () => {
    const response = await api.get<IRemainingPointsToSend>('/remaining-points');
    setRemainingPointsToSend(response.data);
  }, []);

  useEffect(() => {
    loadUserData();
    loadRemainingPointsToSend();
  }, [loadRemainingPointsToSend, loadUserData]);

  const handleSubmit = useCallback(async () => {
    if (!selectedPoints) {
      addToast({
        type: 'error',
        title: '+Pontos são obrigatórios',
      });
      return;
    }

    if (selectedPoints < 0) {
      addToast({
        type: 'error',
        title: '+Pontos precisa ser positivo',
      });
      return;
    }

    if (!selectedUserResult) {
      addToast({
        type: 'error',
        title: '@Colega obrigatório',
      });
      return;
    }

    try {
      await api.post<IRecognitionPost>(`/recognition-posts`, {
        to_user_id: selectedUserResult?.id,
        content: postContent,
        recognition_points: selectedPoints,
      });
      addToast({
        type: 'success',
        title: 'Postagem criada com sucesso',
      });
      await loadRemainingPointsToSend();
      setPostContent('');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao criar postagem',
        description: 'Ocorreu um erro ao criar a postagem, tente novamente.',
      });
    }
  }, [
    addToast,
    loadRemainingPointsToSend,
    postContent,
    selectedPoints,
    selectedUserResult,
  ]);

  const detectMention = useCallback(
    async (post_content: string) => {
      const mention = post_content.match(/\B@([\w-]+)/) || [];

      if (mention.length === 0 && selectedUserResult) {
        setSelectedUserResult({} as IUserSearchResult);
      }
      if (mention.length > 0) {
        setSelectedUserResult(
          userSearchResults.filter((user) => user.username === mention[1])[0],
        );
      }
    },
    [selectedUserResult, userSearchResults],
  );

  const detectPoints = useCallback(
    async (post_content: string) => {
      const points_detection = post_content.match(/\B\+([\d-]+)/) || [];

      if (points_detection.length === 0 && selectedPoints) {
        setSelectedPoints(null);
      }
      if (points_detection.length > 0) {
        setSelectedPoints(parseInt(points_detection[1], 10));
      }
    },
    [selectedPoints],
  );

  const handlePostContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPostContent(e.target.value);
      detectMention(e.target.value);
      detectPoints(e.target.value);
    },
    [detectMention, detectPoints],
  );

  const searchUsersByUsername = useCallback(async (username: string) => {
    const response = await api.get<IUserSearchResult[]>('/users', {
      params: {
        username_like: username,
      },
    });
    setUserSearchResults(response.data);
    return response.data;
  }, []);

  const UserItemTemplate = useCallback(
    ({ entity }: { entity: IUserSearchResult }) => (
      <UserItem>
        <img
          src={entity.avatar ? entity.avatar : defaultAvatar}
          alt={entity.username}
        />
        <span>
          <b>{entity.name}</b> (@{entity.username})
        </span>
      </UserItem>
    ),
    [],
  );

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
              <Button
                light={!selectedPoints}
                onClick={() => {
                  setPostContent(`${postContent} +`);
                }}
              >
                {selectedPoints ? `+${selectedPoints}` : '+Pontos'}
              </Button>
              <Button
                light={!selectedUserResult?.username}
                onClick={() => {
                  setPostContent(`${postContent} @`);
                }}
              >
                {selectedUserResult?.username
                  ? `@${selectedUserResult.username}`
                  : '@Colega'}
              </Button>
              <Button
                light
                onClick={() => {
                  setPostContent(`${postContent} #`);
                }}
              >
                #Hashtag
              </Button>
            </div>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <div>
                <ReactTextareaAutocomplete
                  ref={postRef}
                  name="new_post_content"
                  cols={70}
                  rows={10}
                  placeholder="Que tal reconhecer aquela pessoa bacana que trabalha com você?"
                  onChange={handlePostContentChange}
                  loadingComponent={() => <span>Carregando...</span>}
                  value={postContent}
                  trigger={{
                    '@': {
                      dataProvider: searchUsersByUsername,
                      component: UserItemTemplate,
                      output: (user) => `@${user.username}`,
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
              Você tem <strong>{profileData?.recognition_points} pontos</strong>{' '}
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
