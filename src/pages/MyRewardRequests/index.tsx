import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiSearch } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { format, parseISO } from 'date-fns';

import { FaEye, FaQrcode, FaQuestionCircle } from 'react-icons/fa';
import Header from '~/components/Header';
import ComboBox from '~/components/ComboBox';
import DateInput from '~/components/DateInput';

import {
  Container,
  Content,
  SearchOptions,
  RewardRequestsContainer,
  RewardRequest,
  QrCodeModal,
  DetailsModal,
  ReprovedModal,
} from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Loading from '~/components/Loading';
import { useToast } from '~/hooks/toast';
import Modal from '~/components/Modal';
import happyBirthDay from '~/assets/draw-happy-birthday.svg';
import feelingBlue from '~/assets/draw-feeling-blue.svg';

interface IPagination<T> {
  total: number;
  result: T[];
}

interface IRewardRequest {
  id: string;
  reward_title: string;
  provider_name: string;
  points: number;
  reward_type: string;
  status: 'pending_approval' | 'use_available' | 'used' | 'reproved';
  status_formatted: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  qr_code: string;
  description: string;
  expire_at?: string;
  reprove_reason?: string;
}

const MyRewardRequests: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rewardType, setRewardType] = useState('custom_reward');
  const [selectedRewardRequest, setSelectedRewardRequest] = useState<
    IRewardRequest
  >({} as IRewardRequest);
  const [qrCodeModalStatus, setQrCodeModalStatus] = useState(false);
  const [detailsModalStatus, setDetailsModalStatus] = useState(false);
  const [reprovedModalStatus, setReprovedModalStatus] = useState(false);
  const [rewardRequests, setRewardRequests] = useState<IRewardRequest[]>([]);
  const [page, setPage] = useState(0);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const toggleQrCodeModal = useCallback(() => {
    setQrCodeModalStatus(!qrCodeModalStatus);
  }, [qrCodeModalStatus]);

  const toggleDetailsModal = useCallback(() => {
    setDetailsModalStatus(!detailsModalStatus);
  }, [detailsModalStatus]);

  const toggleReprovedModal = useCallback(() => {
    setReprovedModalStatus(!reprovedModalStatus);
  }, [reprovedModalStatus]);

  const handleQrCodeButton = useCallback(
    async (data: IRewardRequest) => {
      setSelectedRewardRequest(data);
      toggleQrCodeModal();
    },
    [toggleQrCodeModal],
  );

  const handleDetailsButton = useCallback(
    async (data: IRewardRequest) => {
      setSelectedRewardRequest(data);
      toggleDetailsModal();
    },
    [toggleDetailsModal],
  );

  const handleReprovedButton = useCallback(
    async (data: IRewardRequest) => {
      setSelectedRewardRequest(data);
      toggleReprovedModal();
    },
    [toggleReprovedModal],
  );

  const getRewardRequests = useCallback(async (page?: number): Promise<
    IRewardRequest[]
  > => {
    const start_date =
      formRef.current?.getFieldValue('start_date') || '2000-01-01';
    const end_date =
      formRef.current?.getFieldValue('end_date') || new Date().toISOString();
    const reward_type = formRef?.current?.getFieldValue('reward_type');
    const status = formRef?.current?.getFieldValue('status');

    const response = await api.get<IPagination<IRewardRequest>>(
      `my-reward-requests`,
      {
        params: {
          reward_type,
          page: page || 0,
          size: 10,
          start_date,
          end_date,
          status: status === 'all' ? null : status,
        },
      },
    );

    const status_format = {
      pending_approval: 'Pendente de aprovação',
      use_available: 'Disponível para utilização',
      used: 'Utilizado',
      reproved: 'Recusado',
    };

    const date_format = "dd/MM/yyyy 'às' HH:mm:ss";

    const reward_requests = response.data.result.map((reward_request) => ({
      ...reward_request,
      created_at: format(parseISO(reward_request.created_at), date_format),
      updated_at: format(parseISO(reward_request.updated_at), date_format),
      expire_at: reward_request.expire_at
        ? format(parseISO(reward_request.expire_at), date_format)
        : undefined,
      status_formatted: status_format[reward_request.status],
    }));

    return reward_requests;
  }, []);

  const handleGetRewardRequests = useCallback(async () => {
    try {
      const reward_requests = await getRewardRequests(0);
      setPage(0);
      setRewardRequests(reward_requests);

      setLoading(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao consultar os resgates de prêmios',
        description:
          'Ocorreu um erro ao consultar os resgates de prêmios, tente novamente.',
      });
    }
  }, [addToast, getRewardRequests]);

  /**
   * Load first reward requests
   */
  useEffect(() => {
    setLoading(true);
    handleGetRewardRequests();
  }, [handleGetRewardRequests]);

  const handleScroll = useCallback(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;

    const answers = await getRewardRequests(page + 1);
    setRewardRequests([...rewardRequests, ...answers]);
    setPage(page + 1);
  }, [rewardRequests, getRewardRequests, page]);

  const handleRewardTypeChange = useCallback(
    (data: React.ChangeEvent<HTMLSelectElement>) => {
      setRewardType(data.target.value);
    },
    [],
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Loading loading={loading} />
      <Header />

      <Modal isOpen={qrCodeModalStatus} toggleModal={toggleQrCodeModal}>
        <QrCodeModal>
          <h2>Prêmio Resgatado</h2>
          <br />
          <p>
            Parabéns! Você resgatou um prêmio com sucesso. O QR Code abaixo deve
            ser usado para usufruir da premiação de acordo com a política de
            resgate da empresa que o ofereceu.
          </p>
          <br />
          <div>
            <span>
              <label>QR Code do vale-presente: </label>
              <div>
                <img
                  src={selectedRewardRequest.qr_code}
                  alt="QR Code do vale-presente resgatado"
                />
                <img
                  src={happyBirthDay}
                  alt="Ilustração de um presente de aniversário com dois balões"
                />
              </div>
            </span>
            <br />
            <span>
              <label>Data de expiração: </label>
              {selectedRewardRequest.expire_at}
            </span>
            <br />
            <span>
              <label>Código: </label>
              {selectedRewardRequest.id}
            </span>
          </div>
          <Button onClick={() => toggleQrCodeModal()}>Ok</Button>
        </QrCodeModal>
      </Modal>

      <Modal isOpen={detailsModalStatus} toggleModal={toggleDetailsModal}>
        <DetailsModal>
          <h2>Detalhes do Prêmio</h2>
          <br />
          <div>
            <span>
              <label>Título: </label>
              {selectedRewardRequest.reward_title}
            </span>
            <br />
            <span>
              <label>Prêmio oferecido por: </label>
              {selectedRewardRequest.provider_name}
            </span>
            <br />
            <span>
              <label>Pontos: </label>
              {selectedRewardRequest.points}
            </span>
            <br />
            <span>
              <label>Tipo de prêmio: </label>
              {selectedRewardRequest.reward_type === 'gift-card'
                ? 'vale-presente de parceiro'
                : 'prêmio customizado'}
            </span>
            <br />
            <span>
              <label>Status: </label>
              {selectedRewardRequest.status_formatted}
            </span>
            <br />
            <span>
              <label>Data do resgate: </label>
              {selectedRewardRequest.created_at}
            </span>
            <br />
            <span>
              <label>Última atualização: </label>
              {selectedRewardRequest.updated_at}
            </span>
            <br />
            <span>
              <label>Data de expiração: </label>
              {!selectedRewardRequest.expire_at && '-'}
              {selectedRewardRequest.expire_at}
            </span>
            <br />

            <br />
            <span>
              <label>Política de resgate do prêmio: </label>
              <br />
              <i>{`"${selectedRewardRequest.description}"`}</i>
            </span>
          </div>
          <div>
            <Button light onClick={() => toggleDetailsModal()}>
              Ok
            </Button>
          </div>
        </DetailsModal>
      </Modal>

      <Modal isOpen={reprovedModalStatus} toggleModal={toggleReprovedModal}>
        <ReprovedModal>
          <h2>Prêmio Recusado</h2>
          <br />
          <p>
            Poxa, não foi dessa vez! O administrador de sua empresa recusou a
            sua solicitação de resgate, mas seus pontos foram devolvidos para
            você, então pode ficar tranquilo. Tente resgatar outro prêmio :)
          </p>
          <br />
          <img
            src={feelingBlue}
            alt="Ilustração de uma mulher ao lado de um grande emoji triste"
          />
          <div>
            <span>
              <label>Motivo da recusa: </label>
              <br />
              <i>{`"${selectedRewardRequest.reprove_reason}"`}</i>
            </span>
          </div>
          <Button onClick={() => toggleReprovedModal()}>Ok</Button>
        </ReprovedModal>
      </Modal>

      <Container>
        <h2>Meus Resgates de Prêmios</h2>
        <br />
        <Content>
          <SearchOptions>
            <Form ref={formRef} onSubmit={() => setLoading(true)}>
              <div>
                <DateInput name="start_date" label="Data inicial" />
                <DateInput name="end_date" label="Data final" />
              </div>
              <div>
                <ComboBox
                  name="reward_type"
                  label="Tipo de prêmio"
                  onChange={handleRewardTypeChange}
                >
                  <option selected value="custom_reward">
                    Prêmio customizado
                  </option>
                  <option value="gift_card">Vale-presente</option>
                </ComboBox>
                <ComboBox name="status" label="Status">
                  <option selected value="all">
                    Todos
                  </option>
                  {rewardType === 'custom_reward' && (
                    <>
                      <option value="pending_approval">
                        Pendente de aprovação
                      </option>
                      <option value="reproved">Recusado</option>
                    </>
                  )}
                  <option value="use_available">
                    Disponível para utilização
                  </option>
                  <option value="used">Utilizado</option>
                </ComboBox>
              </div>

              <div className="actions">
                <Button
                  type="submit"
                  light
                  onClick={() => handleGetRewardRequests()}
                >
                  <FiSearch />
                  Consultar
                </Button>
              </div>
            </Form>
          </SearchOptions>
          <br />
          <RewardRequestsContainer>
            {rewardRequests &&
              rewardRequests.map((rewardRequest) => (
                <RewardRequest key={rewardRequest.id}>
                  <div className="summary">
                    <span>
                      <label>Prêmio: </label>
                      {rewardRequest.reward_title}
                    </span>
                    <br />
                    <span>
                      <label>Status: </label>
                      {rewardRequest.status_formatted}
                    </span>
                    <br />
                    <img
                      src={rewardRequest.image_url}
                      alt={`Imagem do prêmio '${rewardRequest.reward_title}'`}
                    />
                  </div>
                  <div className="actions">
                    {rewardRequest.status === 'reproved' && (
                      <Button
                        light
                        onClick={() => handleReprovedButton(rewardRequest)}
                      >
                        <FaQuestionCircle />
                        Motivo da recusa
                      </Button>
                    )}
                    {rewardRequest.status !== 'reproved' && (
                      <Button
                        light
                        onClick={() => handleQrCodeButton(rewardRequest)}
                        disabled={
                          rewardRequest.status === 'pending_approval' ||
                          rewardRequest.status === 'used'
                        }
                      >
                        <FaQrcode />
                        Exibir QR Code
                      </Button>
                    )}
                    <Button
                      light
                      onClick={() => handleDetailsButton(rewardRequest)}
                    >
                      <FaEye />
                      Exibir detalhes
                    </Button>
                  </div>
                </RewardRequest>
              ))}
          </RewardRequestsContainer>
        </Content>
      </Container>
    </>
  );
};

export default MyRewardRequests;
