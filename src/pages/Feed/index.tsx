import React, { useCallback, useRef, useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { FiSend } from 'react-icons/fi';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import * as Yup from 'yup';
import InfiniteScroll from 'react-infinite-scroll-component';
import getValidationErrors from '~/utils/getValidationErrors';
import '@webscopeio/react-textarea-autocomplete/style.css';
import defaultAvatar from '~/assets/default-avatar.png';

import Radio from '~/components/Radio';
import TextArea from '~/components/TextArea';
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
  EnpsSurveyModal,
} from './styles';
import { useToast } from '~/hooks/toast';
import api from '~/services/api';
import Button from '~/components/Button';
import { useAuth } from '~/hooks/auth';
import Modal from '~/components/Modal';

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

interface IComment {
  user_id: string;
  user_name: string;
  content: string;
}

interface IRecognitionPost {
  comments: IComment[];
  id: string;
  from_user_id: string;
  to_user_id: string;
  from_name: string;
  to_name: string;
  from_avatar: string;
  to_avatar: string;
  content: string;
  recognition_points: number;
  created_at: string;
  new_comment_textarea?: string;
}

interface IPagination<T> {
  total: number;
  result: T[];
}

interface IRecognitionRankingItem {
  _id: {
    to_user_id: string;
  };
  to_name: string;
  to_avatar: string;
  recognition_points: number;
}

interface IEnpsSurveyAvailable {
  id: string;
  question: string;
}

interface IAnswerEnpsSurvey {
  answer: string;
  score: number;
}

const Feed: React.FC = () => {
  const { user } = useAuth();
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
  const [recognitionPosts, setRecognitionPosts] = useState<IRecognitionPost[]>(
    [],
  );
  const [recognitionRankingItems, setRecognitionRankingItems] = useState<
    IRecognitionRankingItem[]
  >([]);
  const [availableEnpsSurveys, setAvailableEnpsSurveys] = useState<
    IEnpsSurveyAvailable[]
  >([]);
  const [modalStatusEnpsSurvey, setModalStatusEnpsSurvey] = useState(false);

  const toggleEnpsSurveyModal = useCallback(() => {
    setModalStatusEnpsSurvey(!modalStatusEnpsSurvey);
  }, [modalStatusEnpsSurvey]);

  const [profileData, setProfileData] = useState<IProfileData | null>(null);
  const [remainingPointsToSend, setRemainingPointsToSend] = useState<
    IRemainingPointsToSend
  >({} as IRemainingPointsToSend);

  const [page, setPage] = useState(0);

  const loadUserData = useCallback(async () => {
    const response = await api.get<IProfileData>('/profile');
    setProfileData(response.data);
  }, []);

  const loadRemainingPointsToSend = useCallback(async () => {
    const response = await api.get<IRemainingPointsToSend>('/remaining-points');
    setRemainingPointsToSend(response.data);
  }, []);

  const loadRecognitionPosts = useCallback(async () => {
    const response = await api.get<IPagination<IRecognitionPost>>(
      '/recognition-posts',
      {
        params: {
          page: 0,
          size: 10,
        },
      },
    );
    setRecognitionPosts(response.data.result);
    setPage(0);
  }, []);

  const nextRecognitionPosts = useCallback(
    async (page: number) => {
      const response = await api.get<IPagination<IRecognitionPost>>(
        '/recognition-posts',
        {
          params: {
            page,
            size: 10,
          },
        },
      );
      setRecognitionPosts([...recognitionPosts, ...response.data.result]);
    },
    [recognitionPosts],
  );

  const handleNextPage = useCallback(async () => {
    nextRecognitionPosts(page + 1);
    setPage(page + 1);
  }, [nextRecognitionPosts, page]);

  const loadRecognitionRanking = useCallback(async () => {
    const response = await api.get<IRecognitionRankingItem[]>(
      '/recognition-ranking',
    );
    setRecognitionRankingItems(response.data);
  }, []);

  const loadAvailableEnpsSurveys = useCallback(async () => {
    try {
      const response = await api.get<IEnpsSurveyAvailable[]>(
        '/enps-surveys/answers/available',
      );
      setAvailableEnpsSurveys(response.data);
      setModalStatusEnpsSurvey(true);
    } catch (err) {
      console.log(`There is no E-NPS Survey available: ${err}`);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      loadUserData(),
      loadRemainingPointsToSend(),
      loadRecognitionPosts(),
      loadRecognitionRanking(),
      loadAvailableEnpsSurveys(),
    ]);
  }, [
    loadAvailableEnpsSurveys,
    loadRecognitionPosts,
    loadRecognitionRanking,
    loadRemainingPointsToSend,
    loadUserData,
  ]);

  useEffect(() => {
    window.addEventListener('scroll', handleNextPage);
    return () => window.removeEventListener('scroll', handleNextPage);
  }, [handleNextPage]);

  const handleSendRecognitionPost = useCallback(async () => {
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

    if (selectedPoints > remainingPointsToSend.remaining_points) {
      addToast({
        type: 'error',
        title: '+Pontos insuficientes',
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
      Promise.all([
        loadRemainingPointsToSend(),
        loadRecognitionPosts(),
        loadRecognitionRanking(),
      ]);
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
    loadRecognitionPosts,
    loadRecognitionRanking,
    loadRemainingPointsToSend,
    postContent,
    remainingPointsToSend.remaining_points,
    selectedPoints,
    selectedUserResult,
  ]);

  const handleSendPostComment = useCallback(
    async (post_id: string, comment: string | undefined) => {
      if (!comment) return;
      try {
        const response = await api.post<IRecognitionPost>(
          `/recognition-posts/${post_id}/comments`,
          {
            content: comment,
          },
        );
        addToast({
          type: 'success',
          title: 'Comentário criado com sucesso',
        });
        setRecognitionPosts(
          recognitionPosts.map((p) =>
            p.id === post_id
              ? {
                  ...response.data,
                  new_comment_textarea: '',
                }
              : p,
          ),
        );
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao criar comentário',
          description:
            'Ocorreu um erro ao criar o comentário, tente novamente.',
        });
      }
    },
    [addToast, recognitionPosts],
  );

  const detectMention = useCallback(
    async (post_content: string) => {
      const mention = post_content.match(/\B@([\w-.]+)/) || [];

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

  const handleCommentTextareaChange = useCallback(
    (comment_content, post) => {
      setRecognitionPosts(
        recognitionPosts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                new_comment_textarea: comment_content,
              }
            : p,
        ),
      );
    },
    [recognitionPosts],
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

  const validateEnpsAnswerForm = useCallback(
    async (data: IAnswerEnpsSurvey) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          answer: Yup.string().required('Resposta é obrigatória'),
          score: Yup.string().required('Nota é obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          throw err;
        }
      }
    },
    [],
  );

  const handleAnswerEnpsSurvey = useCallback(
    async (data: IAnswerEnpsSurvey) => {
      try {
        await validateEnpsAnswerForm(data);
        const { id } = availableEnpsSurveys[0];

        await api.post(`/enps-surveys/${id}/answers`, {
          answer: data.answer,
          score: data.score,
        });

        toggleEnpsSurveyModal();
        addToast({
          type: 'success',
          title: 'Resposta enviada com sucesso :)',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na criação da pesquisa ENPS',
          description:
            'Ocorreu um erro ao criar a pesquisa ENPS, tente novamente.',
        });
      }
    },
    [
      addToast,
      availableEnpsSurveys,
      toggleEnpsSurveyModal,
      validateEnpsAnswerForm,
    ],
  );

  return (
    <>
      <Header />

      <Modal isOpen={modalStatusEnpsSurvey} toggleModal={toggleEnpsSurveyModal}>
        <EnpsSurveyModal>
          <Form ref={formRef} onSubmit={handleAnswerEnpsSurvey}>
            <h2>Pesquisa E-NPS</h2>
            <br />
            <div>
              <span>{availableEnpsSurveys[0]?.question}</span>
              <br />
              <br />
              <div className="score">
                <Radio
                  name="score"
                  options={[
                    { id: '0', label: '0' },
                    { id: '1', label: '1' },
                    { id: '2', label: '2' },
                    { id: '3', label: '3' },
                    { id: '4', label: '4' },
                    { id: '5', label: '5' },
                    { id: '6', label: '6' },
                    { id: '7', label: '7' },
                    { id: '8', label: '8' },
                    { id: '9', label: '9' },
                    { id: '10', label: '10' },
                  ]}
                />
              </div>

              <br />
              <TextArea
                name="answer"
                label="Faça um comentário sobre sua nota"
              />
            </div>
            <div>
              <Button light onClick={() => toggleEnpsSurveyModal()}>
                Cancelar
              </Button>
              <Button type="submit">Enviar</Button>
            </div>
          </Form>
        </EnpsSurveyModal>
      </Modal>

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

            <Form ref={formRef} onSubmit={handleSendRecognitionPost}>
              <div>
                <ReactTextareaAutocomplete
                  ref={postRef}
                  name="new_post_content"
                  cols={70}
                  rows={6}
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

          <PostsList>
            <InfiniteScroll
              dataLength={recognitionPosts.length}
              next={handleNextPage}
              hasMore
              loader={<></>}
            >
              {recognitionPosts &&
                recognitionPosts.map((post) => (
                  <Post key={post.id}>
                    <div className="fromTo">
                      <img
                        src={
                          post.from_avatar ? post.from_avatar : defaultAvatar
                        }
                        alt={post.from_name}
                        title={post.from_name}
                      />
                      <strong>{`+${post.recognition_points}`}</strong>
                      <img
                        src={post.to_avatar ? post.to_avatar : defaultAvatar}
                        alt={post.to_name}
                        title={post.to_name}
                      />
                    </div>
                    <div className="content">
                      <b>{`${post.from_name}: `}</b>
                      <span>{post.content}</span>
                      <ul>
                        {post.comments &&
                          post.comments.map((comment) => (
                            <li key={post.id + Math.random() * 100}>
                              <hr />
                              <b>{`@${comment.user_name}: `}</b>
                              <span>{comment.content}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="comments">
                      <textarea
                        id={post.id}
                        name="new_comment_textarea"
                        cols={70}
                        rows={1}
                        placeholder="Faça um comentário"
                        value={post.new_comment_textarea}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>,
                        ) => {
                          handleCommentTextareaChange(e.target.value, post);
                        }}
                      />
                      <Button
                        light
                        type="submit"
                        onClick={() => {
                          handleSendPostComment(
                            post.id,
                            post.new_comment_textarea,
                          );
                        }}
                      >
                        Comentar
                      </Button>
                    </div>
                  </Post>
                ))}
            </InfiniteScroll>
          </PostsList>
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
          <Ranking>
            <b>Quem mais mandou bem esse mês</b>
            <ul>
              {recognitionRankingItems &&
                recognitionRankingItems.map((item) => (
                  <li key={item._id.to_user_id}>
                    <div>
                      <img
                        src={item.to_avatar ? item.to_avatar : defaultAvatar}
                        alt={item.to_name}
                      />
                      <span>
                        {user.id === item._id.to_user_id
                          ? `${item.to_name} (você)`
                          : item.to_name}
                      </span>
                    </div>
                    <div>{item.recognition_points}</div>
                  </li>
                ))}
            </ul>
          </Ranking>
        </aside>
      </Container>
    </>
  );
};

export default Feed;
