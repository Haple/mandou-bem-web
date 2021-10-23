import React, { useState, useCallback, useRef } from 'react';

import { AiFillLike } from 'react-icons/ai';
import { FaQrcode, FaKeyboard } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import Header from '~/components/Header';
import Loading from '~/components/Loading';

import {
  Container,
  RewardRequest,
  ValidateRewardModal,
  GetRewardModal,
  GetRewardWithQRCodeModal,
  RewardRequestData,
} from './styles';
import Button from '~/components/Button';
import Input from '~/components/Input';
import api from '~/services/api';
import { useToast } from '~/hooks/toast';
import Modal from '~/components/Modal';
import QRCodeReader from '~/components/QRCodeReader';
import drawSearching from '~/assets/draw-searching.svg';

interface ICustomRewardRequest {
  id: string;
  user: {
    name: string;
  };
  custom_reward: {
    title: string;
    points: number;
    description: string;
  };
  created_at: string;
  created_at_formatted: string;
  updated_at: string;
  updated_at_formatted: string;
  status: 'pending_approval' | 'use_available' | 'used' | 'reproved';
  status_formatted: string;
}

interface IGetRewardRequestFormData {
  id: string;
}

const AdminValidateReward: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [modalStatusValidateReward, setModalStatusValidateReward] = useState(
    false,
  );
  const [modalStatusGetReward, setModalStatusGetReward] = useState(false);
  const [
    modalStatusGetRewardWithQRCode,
    setModalStatusGetRewardWithQRCode,
  ] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [
    rewardRequest,
    setRewardRequest,
  ] = useState<ICustomRewardRequest | null>(null);

  const toggleValidateRewardModal = useCallback(() => {
    setModalStatusValidateReward(!modalStatusValidateReward);
  }, [modalStatusValidateReward]);

  const toggleGetRewardModal = useCallback(() => {
    setModalStatusGetReward(!modalStatusGetReward);
  }, [modalStatusGetReward]);

  const toggleGetRewardWithQRCodeModal = useCallback(() => {
    setModalStatusGetRewardWithQRCode(!modalStatusGetRewardWithQRCode);
  }, [modalStatusGetRewardWithQRCode]);

  const handleGetRewardRequest = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const { data } = await api.get<ICustomRewardRequest>(
          `/custom-reward-requests/${id}`,
        );

        const status_label = {
          pending_approval: 'Pendente de aprovação',
          use_available: 'Disponível para utilização',
          used: 'Utilizado',
          reproved: 'Recusado',
        };

        const response_formmated = {
          ...data,
          created_at_formatted: format(
            parseISO(data.created_at),
            "dd/MM/yyyy 'às' HH:mm:ss",
          ),
          updated_at_formatted: format(
            parseISO(data.updated_at),
            "dd/MM/yyyy 'às' HH:mm:ss",
          ),
          status_formatted: status_label[data.status],
        };
        setRewardRequest(response_formmated);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao buscar prêmio customizado',
          description:
            'Ocorreu um erro ao buscar o prêmio customizado, tente novamente.',
        });
      }
      setLoading(false);
    },
    [addToast],
  );

  const handleValidateReward = useCallback(async () => {
    setLoading(true);
    try {
      await api.patch<ICustomRewardRequest>(
        `/custom-reward-requests/${rewardRequest?.id}/validate`,
      );
      setRewardRequest(null);
      toggleValidateRewardModal();
      addToast({
        type: 'success',
        title: 'O prêmio customizado foi validado com sucesso',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao validar prêmio customizado',
        description:
          'Ocorreu um erro ao validar o prêmio customizado, tente novamente.',
      });
    }
    setLoading(false);
  }, [addToast, rewardRequest, toggleValidateRewardModal]);

  const handleScan = useCallback(
    async (data: string | null) => {
      if (!data) {
        return;
      }
      await handleGetRewardRequest(data);
      toggleGetRewardWithQRCodeModal();
    },
    [handleGetRewardRequest, toggleGetRewardWithQRCodeModal],
  );

  const handleError = useCallback(
    async (err: any) => {
      addToast({
        type: 'error',
        title: 'Erro ao ler QR Code',
        description: 'Ocorreu um erro ao ler o QR Code, tente novamente.',
      });
    },
    [addToast],
  );

  const handleFormGetRewardRequest = useCallback(
    async (data: IGetRewardRequestFormData) => {
      await handleGetRewardRequest(data.id);
      toggleGetRewardModal();
    },
    [handleGetRewardRequest, toggleGetRewardModal],
  );

  return (
    <>
      <Loading loading={loading} />
      <Header />

      <Modal
        isOpen={modalStatusValidateReward}
        toggleModal={toggleValidateRewardModal}
      >
        <ValidateRewardModal>
          <Form ref={formRef} onSubmit={handleValidateReward}>
            <h2>Confirmar Entrega de Prêmio</h2>
            <br />
            <div>
              <span>
                Ao clicar em confirmar, esse prêmio será considerado{' '}
                <b>utilizado</b>, ou seja, o colaborador recebeu a premiação.
                Tem certeza que deseja validar?
              </span>
            </div>
            <div>
              <Button light onClick={() => toggleValidateRewardModal()}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar</Button>
            </div>
          </Form>
        </ValidateRewardModal>
      </Modal>

      <Modal isOpen={modalStatusGetReward} toggleModal={toggleGetRewardModal}>
        <GetRewardModal>
          <Form ref={formRef} onSubmit={handleFormGetRewardRequest}>
            <h2>Inserção Manual do Código de Resgate</h2>
            <br />
            <div>
              <Input name="id" label="Código do resgate" />
            </div>
            <div>
              <Button light onClick={() => toggleGetRewardModal()}>
                Cancelar
              </Button>
              <Button type="submit">Buscar</Button>
            </div>
          </Form>
        </GetRewardModal>
      </Modal>

      <Modal
        isOpen={modalStatusGetRewardWithQRCode}
        toggleModal={toggleGetRewardWithQRCodeModal}
      >
        <GetRewardWithQRCodeModal>
          <h2>Escanear QR Code</h2>
          <br />
          <h3>
            Exiba o QR Code no local indicado e o prêmio customizado será
            carregado automaticamente.
          </h3>
          <div>
            <QRCodeReader handleScan={handleScan} handleError={handleError} />
          </div>
          <div>
            <Button light onClick={() => toggleGetRewardWithQRCodeModal()}>
              Cancelar
            </Button>
          </div>
        </GetRewardWithQRCodeModal>
      </Modal>

      <Container>
        <h3>Validar utilização de prêmio customizado</h3>

        <RewardRequest>
          <div>
            <Button light onClick={toggleGetRewardWithQRCodeModal}>
              <FaQrcode />
              Escanear QR Code
            </Button>
            <Button light onClick={toggleGetRewardModal}>
              <FaKeyboard />
              Inserir código manualmente
            </Button>
          </div>
          {!rewardRequest && (
            <img
              src={drawSearching}
              alt="Ilustração de uma mulher apontando uma luneta para um ponto de interrogação"
            />
          )}
          {rewardRequest && (
            <RewardRequestData>
              <div>
                <span>
                  <label>Colaborador: </label>
                  {rewardRequest.user.name}
                </span>
                <br />
                <span>
                  <label>Título: </label>
                  {rewardRequest.custom_reward.title}
                </span>
                <br />
                <span>
                  <label>Pontos: </label>
                  {rewardRequest.custom_reward.points}
                </span>
                <br />
                <span>
                  <label>Data do resgate: </label>
                  {rewardRequest.created_at_formatted}
                </span>
                <br />
                <span>
                  <label>Data da última atualização: </label>
                  {rewardRequest.updated_at_formatted}
                </span>
                <br />
                <span>
                  <label>Status: </label>
                  {rewardRequest.status_formatted}
                </span>
                <br />
                <span>
                  <label>Política de resgate: </label>
                  {rewardRequest.custom_reward.description}
                </span>
              </div>
            </RewardRequestData>
          )}
          <Button
            light
            onClick={toggleValidateRewardModal}
            disabled={
              !rewardRequest || rewardRequest.status !== 'use_available'
            }
          >
            <AiFillLike />
            Validar prêmio
          </Button>
        </RewardRequest>
      </Container>
    </>
  );
};

export default AdminValidateReward;
