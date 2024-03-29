import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiDownload } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { format, parseISO } from 'date-fns';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { FaFlagCheckered } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import drawSearching from '~/assets/draw-searching.svg';
import Header from '~/components/Header';

import {
  Container,
  Content,
  EndEnpsSurveyModal,
  EnpsScore,
  Details,
  Results,
  Configs,
  Classification,
  AnswersContainer,
  AnswerHeader,
} from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Modal from '~/components/Modal';
import Loading from '~/components/Loading';
import { useToast } from '~/hooks/toast';

interface IEnpsSurveyData {
  id: string;
  question: string;
  created_at: string;
  created_at_formatted: string;
  end_date: string;
  end_date_formatted: string;
  ended: boolean;
  ended_at?: string;
  ended_at_formatted?: string;
  total_responses: number;
  enps_score: number;
  promoters: number;
  promoters_percent: number;
  passives: number;
  passives_percent: number;
  detractors: number;
  detractors_percent: number;
  department?: {
    department_name: string;
  };
  position?: {
    position_name: string;
  };
}

interface IPagination<T> {
  total: number;
  result: T[];
}

interface IEnpsAnswer {
  id: string;
  answer: string;
  score: number;
  created_at: string;
  created_at_formatted: string;
}

type IParams = {
  id: string;
};

const AdminEnpsSurveyDetail: React.FC<RouteComponentProps<IParams>> = ({
  match,
}) => {
  const [loading, setLoading] = useState(false);
  const [enpsSurvey, setEnpsSurvey] = useState<IEnpsSurveyData>(
    {} as IEnpsSurveyData,
  );
  const [enpsAnswers, setEnpsAnswers] = useState<IEnpsAnswer[]>([]);
  const [page, setPage] = useState(0);

  const [modalStatusEndEnpsSurvey, setModalStatusEndEnpsSurvey] = useState(
    false,
  );
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const getEnpsAnswers = useCallback(
    async (page?: number): Promise<IEnpsAnswer[]> => {
      const response = await api.get<IPagination<IEnpsAnswer>>(
        `enps-surveys/${match.params.id}/answers`,
        {
          params: {
            page: page || 0,
            size: 5,
          },
        },
      );

      const answers = response.data.result.map((answer) => ({
        ...answer,
        created_at_formatted: format(parseISO(answer.created_at), 'dd/MM/yyyy'),
      }));

      return answers;
    },
    [match.params.id],
  );

  const loadEnpsSurvey = useCallback(async (): Promise<void> => {
    try {
      const { data } = await api.get<IEnpsSurveyData>(
        `enps-surveys/${match.params.id}`,
      );

      const formatted_data = {
        ...data,
        promoters_percent: (data.promoters / data.total_responses) * 100,
        passives_percent: (data.passives / data.total_responses) * 100,
        detractors_percent: (data.detractors / data.total_responses) * 100,
        created_at_formatted: format(parseISO(data.created_at), 'dd/MM/yyyy'),
        end_date_formatted: format(parseISO(data.end_date), 'dd/MM/yyyy'),
        ended_at_formatted: data.ended_at
          ? format(parseISO(data.ended_at), 'dd/MM/yyyy')
          : undefined,
      };

      setEnpsSurvey(formatted_data);
    } catch (err) {
      history.push('/admin-panel/enps-surveys');
    }
  }, [history, match.params.id]);

  useEffect(() => {
    async function loadEnpsAnswers(): Promise<void> {
      const answers = await getEnpsAnswers();
      setEnpsAnswers(answers);
    }

    loadEnpsSurvey();
    loadEnpsAnswers();
  }, [getEnpsAnswers, loadEnpsSurvey, match.params.id]);

  const toggleEndEnpsSurveyModal = useCallback(() => {
    setModalStatusEndEnpsSurvey(!modalStatusEndEnpsSurvey);
  }, [modalStatusEndEnpsSurvey]);

  const handleEndEnpsSurvey = useCallback(async () => {
    try {
      setLoading(true);
      await api.patch(`enps-surveys/${match.params.id}/end`);

      loadEnpsSurvey();
      toggleEndEnpsSurveyModal();
      setLoading(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao terminar pesquisa ENPS',
        description:
          'Ocorreu um erro ao terminar a pesquisa ENPS, tente novamente.',
      });
    }
  }, [addToast, loadEnpsSurvey, match.params.id, toggleEndEnpsSurveyModal]);

  const handleDownloadPDF = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`enps-surveys/${match.params.id}/pdf`, {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
      });
      const blob = new Blob([data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `pesquisa-enps-${match.params.id}.pdf`;
      link.click();
      setLoading(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao baixar PDF da pesquisa ENPS',
        description:
          'Ocorreu um erro ao baixar o PDF da pesquisa ENPS, tente novamente.',
      });
    }
  }, [addToast, match.params.id]);

  const handleNextPage = useCallback(async () => {
    const answers = await getEnpsAnswers(page + 1);
    setEnpsAnswers([...enpsAnswers, ...answers]);
    setPage(page + 1);
  }, [enpsAnswers, getEnpsAnswers, page]);

  return (
    <>
      <Loading loading={loading} />
      <Header />
      <Modal
        isOpen={modalStatusEndEnpsSurvey}
        toggleModal={toggleEndEnpsSurveyModal}
      >
        <EndEnpsSurveyModal>
          <Form ref={formRef} onSubmit={handleEndEnpsSurvey}>
            <h2>Terminar Pesquisa</h2>
            <br />
            <div>
              <span>
                Essa pesquisa possui data de término prevista para{' '}
                <b>{enpsSurvey.end_date_formatted}</b>. Tem certeza que deseja
                terminar ela agora?
              </span>
            </div>
            <div>
              <Button light onClick={() => toggleEndEnpsSurveyModal()}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar</Button>
            </div>
          </Form>
        </EndEnpsSurveyModal>
      </Modal>

      <Container>
        <h3>Detalhes de Pesquisa E-NPS</h3>
        <br />
        <Content>
          <Details>
            <Results>
              <h4>Resultados</h4> <br />
              {enpsSurvey.total_responses <= 0 && (
                <div className="no-answers">
                  <img
                    src={drawSearching}
                    alt="Ilustração de uma mulher apontando uma luneta para um ponto de interrogação"
                  />
                  <br />
                  <i>Sem respostas por enquanto</i>
                </div>
              )}
              {enpsSurvey.total_responses > 0 && (
                <>
                  <div className="enps-container">
                    <EnpsScore score={enpsSurvey.enps_score}>
                      <label>E-NPS</label>
                      <span>{enpsSurvey.enps_score}</span>
                    </EnpsScore>
                    <div className="classifications">
                      <Classification type="detractor">
                        <div className="score">{enpsSurvey.detractors}</div>
                        <div className="percentage">
                          Detratores ({enpsSurvey.detractors_percent}%)
                        </div>
                      </Classification>
                      <Classification type="passive">
                        <div className="score">{enpsSurvey.passives}</div>
                        <div className="percentage">
                          Neutros ({enpsSurvey.passives_percent}%)
                        </div>
                      </Classification>
                      <Classification type="promoter">
                        <div className="score">{enpsSurvey.promoters}</div>
                        <div className="percentage">
                          Promotores ({enpsSurvey.promoters_percent}%)
                        </div>
                      </Classification>
                    </div>
                  </div>
                  <div className="total-answers">
                    {enpsSurvey.total_responses} Respondente(s)
                  </div>
                </>
              )}
            </Results>
            <Configs>
              <h4>Configurações</h4>
              <div>
                <label>Pergunta realizada:</label> <br />
                <span>
                  <i>{enpsSurvey.question}</i>
                </span>
                <br />
                <label>Data de início: </label>
                <span>{enpsSurvey.created_at_formatted}</span>
                <br />
                <label>Data de término prevista: </label>
                <span>{enpsSurvey.end_date_formatted}</span>
                <br />
                {enpsSurvey.ended_at && (
                  <>
                    <label>Data de término: </label>
                    <span>{enpsSurvey.ended_at_formatted}</span>
                    <br />
                  </>
                )}
                <label>Departamento: </label>
                {enpsSurvey.department && (
                  <span>{enpsSurvey.department?.department_name}</span>
                )}
                {!enpsSurvey.department && <span>Todos</span>}
                <br />
                <label>Cargo: </label>
                {enpsSurvey.position && (
                  <span>{enpsSurvey.position?.position_name}</span>
                )}
                {!enpsSurvey.position && <span>Todos</span>}
              </div>
              <div className="options">
                <Button
                  light
                  disabled={!!enpsSurvey.ended_at}
                  onClick={() => toggleEndEnpsSurveyModal()}
                >
                  <FaFlagCheckered />
                  Terminar
                </Button>
                <Button light onClick={() => handleDownloadPDF()}>
                  <FiDownload />
                  Baixar PDF
                </Button>
              </div>
            </Configs>
          </Details>
          <br />
          <AnswersContainer>
            <AnswerHeader>
              <h4>Respostas individuais</h4>
            </AnswerHeader>

            <InfiniteScroll
              dataLength={enpsAnswers.length}
              next={handleNextPage}
              hasMore
              loader={<></>}
            >
              <table>
                <thead>
                  <th>Data</th>
                  <th>Nota</th>
                  <th>Resposta</th>
                </thead>
                <tbody>
                  {enpsAnswers &&
                    enpsAnswers.map((enpsAnswer) => (
                      <tr key={enpsAnswer.id}>
                        <td>{enpsAnswer.created_at_formatted}</td>
                        <td>{enpsAnswer.score}</td>
                        <td>{enpsAnswer.answer}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </InfiniteScroll>
          </AnswersContainer>
        </Content>
      </Container>
    </>
  );
};

export default withRouter(AdminEnpsSurveyDetail);
