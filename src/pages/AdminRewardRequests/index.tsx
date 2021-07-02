import React, { useState, useEffect, useCallback, useRef } from 'react';

import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { format, parseISO } from 'date-fns';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import Header from '~/components/Header';

import defaultAvatar from '~/assets/default-avatar.png';

import { Container, RewardRequest, ReproveModal } from './styles';
import Button from '~/components/Button';
import TextArea from '~/components/TextArea';
import api from '~/services/api';
import { useToast } from '~/hooks/toast';
import Modal from '~/components/Modal';

interface ICustomRewardRequest {
  id: string;
  created_at: string;
  created_at_formatted: string;
  user: {
    name: string;
    avatar: string;
  };
  custom_reward: {
    title: string;
  };
}

interface IReproveData {
  reprove_reason: string;
}

const AdminRewardRequests: React.FC = () => {
  const [modalStatusReprove, setModalStatusReprove] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [rewardRequests, setRewardRequests] = useState<ICustomRewardRequest[]>(
    [],
  );
  const [rewardRequestToReprove, setRewardRequestToReprove] = useState<
    ICustomRewardRequest
  >({} as ICustomRewardRequest);

  useEffect(() => {
    async function loadRewardRequests(): Promise<void> {
      const response = await api.get<ICustomRewardRequest[]>(
        '/custom-reward-requests',
        {
          params: {
            status: 'pending_approval',
          },
        },
      );
      const response_formmated = response.data.map((r) => ({
        ...r,
        created_at_formatted: format(
          parseISO(r.created_at),
          "dd/MM/yyyy 'às' HH:mm:ss",
        ),
      }));
      setRewardRequests(response_formmated);
    }

    loadRewardRequests();
  }, []);

  const toggleReproveModal = useCallback(() => {
    setModalStatusReprove(!modalStatusReprove);
  }, [modalStatusReprove]);

  const handleApproveRewardRequest = useCallback(
    async (id: string) => {
      try {
        await api.patch<ICustomRewardRequest>(
          `/custom-reward-requests/${id}/approve`,
        );
        const updatedRewardRequests = rewardRequests.filter((r) => r.id !== id);
        setRewardRequests(updatedRewardRequests);
        addToast({
          type: 'success',
          title: 'A solicitação de prêmio customizado foi aprovada com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao aprovar solicitação de prêmio customizado',
          description:
            'Ocorreu um erro ao aprovar a solicitação de prêmio customizado, tente novamente.',
        });
      }
    },
    [addToast, rewardRequests],
  );

  const handleReprove = useCallback(
    async (data: ICustomRewardRequest) => {
      setRewardRequestToReprove(data);
      toggleReproveModal();
    },
    [toggleReproveModal],
  );

  const handleReproveRewardRequest = useCallback(
    async (data: IReproveData) => {
      try {
        await api.patch<ICustomRewardRequest>(
          `/custom-reward-requests/${rewardRequestToReprove.id}/reprove`,
          {
            reprove_reason: data.reprove_reason,
          },
        );
        const updatedRewardRequests = rewardRequests.filter(
          (r) => r.id !== rewardRequestToReprove.id,
        );
        setRewardRequests(updatedRewardRequests);
        toggleReproveModal();
        addToast({
          type: 'success',
          title:
            'A solicitação de prêmio customizado foi reprovada com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao reprovada solicitação de prêmio customizado',
          description:
            'Ocorreu um erro ao reprovada a solicitação de prêmio customizado, tente novamente.',
        });
      }
    },
    [addToast, rewardRequestToReprove.id, rewardRequests, toggleReproveModal],
  );

  return (
    <>
      <Header />

      <Modal isOpen={modalStatusReprove} toggleModal={toggleReproveModal}>
        <ReproveModal>
          <Form ref={formRef} onSubmit={handleReproveRewardRequest}>
            <h2>Recusar Resgate</h2>
            <br />
            <div>
              <TextArea name="reprove_reason" label="Motivo" required />
            </div>
            <div>
              <Button light onClick={() => toggleReproveModal()}>
                Cancelar
              </Button>
              <Button type="submit">Recusar</Button>
            </div>
          </Form>
        </ReproveModal>
      </Modal>

      <Container>
        <h2>Controle as solicitações de prêmios customizados</h2>

        {rewardRequests && rewardRequests.length === 0 && (
          <h3>(Ainda não há nenhuma solicitação de prêmio customizado)</h3>
        )}

        {rewardRequests &&
          rewardRequests.map((rewardRequest) => (
            <RewardRequest key={rewardRequest.id}>
              <div>
                <img
                  src={
                    rewardRequest.user.avatar
                      ? rewardRequest.user.avatar
                      : defaultAvatar
                  }
                  alt={rewardRequest.user.name}
                />
                <div>
                  <span>
                    <label>Colaborador: </label>
                    {rewardRequest.user.name}
                  </span>
                  <span>
                    <label>Prêmio resgatado: </label>
                    {rewardRequest.custom_reward.title}
                  </span>
                  <span>
                    <label>Data do resgate: </label>
                    {rewardRequest.created_at_formatted}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  light
                  onClick={() => handleApproveRewardRequest(rewardRequest.id)}
                >
                  <AiFillLike />
                  Aprovar resgate
                </Button>
                <Button light onClick={() => handleReprove(rewardRequest)}>
                  <AiFillDislike />
                  Recusar resgate
                </Button>
              </div>
            </RewardRequest>
          ))}
      </Container>
    </>
  );
};

export default AdminRewardRequests;
