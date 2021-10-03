import React, { useState, useEffect, useCallback } from 'react';

import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import Header from '~/components/Header';

import {
  Container,
  Content,
  CatalogReward,
  SelectedCatalogModal,
  GiftCardSuccessModal,
  CustomRewardSuccessModal,
} from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import { useToast } from '~/hooks/toast';
import Modal from '~/components/Modal';
import happyBirthDay from '~/assets/draw-happy-birthday.svg';

interface ICatalogData {
  id: string;
  title: string;
  points: number;
  image_url: string;
  units_available: number;
  expiration_days: number;
  description: string;
  reward_type: 'custom-reward' | 'gift-card';
  company_name: string;
  enabled: boolean;
}

interface IGiftCardResponse {
  id: string;
  expire_at: string;
  expire_at_formatted: string;
  qr_code: string;
}

interface ICustomRewardResponse {
  id: string;
  status: string;
}

interface IUserData {
  recognition_points: number;
}

const Catalog: React.FC = () => {
  const [catalog, setCatalog] = useState<ICatalogData[]>([]);
  const [selectedCatalogReward, setSelectedCatalogReward] = useState<
    ICatalogData
  >({} as ICatalogData);
  const [giftCardResponse, setGiftCardResponse] = useState<IGiftCardResponse>(
    {} as IGiftCardResponse,
  );
  const [, setCustomRewardResponse] = useState<ICustomRewardResponse>(
    {} as ICustomRewardResponse,
  );
  const [modalStatusSelectCatalog, setModalStatusSelectCatalog] = useState(
    false,
  );
  const [modalStatusGiftCardSuccess, setModalStatusGiftCardSuccess] = useState(
    false,
  );
  const [
    modalStatusCustomRewardSuccess,
    setModalStatusCustomRewardSuccess,
  ] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState<IUserData>({} as IUserData);

  const { addToast } = useToast();

  const loadUserData = useCallback(async () => {
    const response = await api.get<IUserData>('/profile');
    setUserData(response.data);
  }, []);

  const loadCatalogRewards = useCallback(async () => {
    const response = await api.get<ICatalogData[]>('/catalog');
    const catalogRewards = response.data.filter((reward) => reward.enabled);
    setCatalog(catalogRewards);
  }, []);

  useEffect(() => {
    loadCatalogRewards();
    loadUserData();
  }, [loadCatalogRewards, loadUserData]);

  const handleCreateGiftCardRequest = useCallback(
    async (id: string): Promise<IGiftCardResponse | undefined> => {
      try {
        const { data } = await api.post<IGiftCardResponse>(
          `/gift-card-requests`,
          {
            gift_card_id: id,
          },
        );
        await loadUserData();
        return data;
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao resgatar vale-presente',
          description:
            'Ocorreu um erro ao resgatar o vale-presente, tente novamente.',
        });
        return undefined;
      }
    },
    [addToast, loadUserData],
  );

  const handleCreateCustomRewardRequest = useCallback(
    async (id: string): Promise<ICustomRewardResponse | undefined> => {
      try {
        const { data } = await api.post<ICustomRewardResponse>(
          `/custom-reward-requests`,
          {
            custom_reward_id: id,
          },
        );
        await loadUserData();
        return data;
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao resgatar prêmio customizado',
          description:
            'Ocorreu um erro ao resgatar o prêmio customizado, tente novamente.',
        });
        return undefined;
      }
    },
    [addToast, loadUserData],
  );

  const toggleSelectCatalogModal = useCallback(() => {
    setModalStatusSelectCatalog(!modalStatusSelectCatalog);
  }, [modalStatusSelectCatalog]);

  const toggleGiftCardSuccessModal = useCallback(() => {
    setModalStatusGiftCardSuccess(!modalStatusGiftCardSuccess);
  }, [modalStatusGiftCardSuccess]);

  const toggleCustomRewardSuccessModal = useCallback(() => {
    setModalStatusCustomRewardSuccess(!modalStatusCustomRewardSuccess);
  }, [modalStatusCustomRewardSuccess]);

  const handleSelectCatalogReward = useCallback(
    async (data: ICatalogData) => {
      setSelectedCatalogReward(data);
      toggleSelectCatalogModal();
    },
    [toggleSelectCatalogModal],
  );

  const handleConfirmRewardRequest = useCallback(async () => {
    if (selectedCatalogReward.reward_type === 'gift-card') {
      setLoading(true);
      const response = await handleCreateGiftCardRequest(
        selectedCatalogReward.id,
      );
      if (!response) {
        setLoading(false);
        toggleSelectCatalogModal();
        return;
      }
      const response_formmated = {
        ...response,
        expire_at_formatted: format(parseISO(response.expire_at), 'dd/MM/yyy'),
      } as IGiftCardResponse;
      setLoading(false);
      toggleSelectCatalogModal();
      setGiftCardResponse(response_formmated);
      toggleGiftCardSuccessModal();
    }
    if (selectedCatalogReward.reward_type === 'custom-reward') {
      setLoading(true);
      const response = await handleCreateCustomRewardRequest(
        selectedCatalogReward.id,
      );
      setLoading(false);
      toggleSelectCatalogModal();
      setCustomRewardResponse(response || ({} as ICustomRewardResponse));
      toggleCustomRewardSuccessModal();
    }
    await loadCatalogRewards();
  }, [
    handleCreateCustomRewardRequest,
    handleCreateGiftCardRequest,
    loadCatalogRewards,
    selectedCatalogReward.id,
    selectedCatalogReward.reward_type,
    toggleCustomRewardSuccessModal,
    toggleGiftCardSuccessModal,
    toggleSelectCatalogModal,
  ]);

  const renderRequestButton = useCallback(
    (catalogReward: ICatalogData) => {
      if (catalogReward.points > userData.recognition_points) {
        return (
          <Button light disabled>
            {`${catalogReward.points} pontos`}
          </Button>
        );
      }
      if (catalogReward.units_available <= 0) {
        return (
          <Button light disabled>
            Indisponível
          </Button>
        );
      }

      return (
        <Button light onClick={() => handleSelectCatalogReward(catalogReward)}>
          Resgatar
        </Button>
      );
    },
    [handleSelectCatalogReward, userData.recognition_points],
  );

  return (
    <>
      <Header />

      <Modal
        isOpen={modalStatusGiftCardSuccess}
        toggleModal={toggleGiftCardSuccessModal}
      >
        <GiftCardSuccessModal>
          <h2>Vale-Presente Resgatado</h2>
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
                  src={giftCardResponse.qr_code}
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
              {giftCardResponse.expire_at_formatted}
            </span>
            <br />
            <span>
              <label>Código: </label>
              {giftCardResponse.id}
            </span>
          </div>
          <Button onClick={() => toggleGiftCardSuccessModal()}>Ok</Button>
        </GiftCardSuccessModal>
      </Modal>

      <Modal
        isOpen={modalStatusCustomRewardSuccess}
        toggleModal={toggleCustomRewardSuccessModal}
      >
        <CustomRewardSuccessModal>
          <h2>Prêmio Customizado Solicitado</h2>
          <br />
          <p>
            Esse é um prêmio customizado e oferecido pela empresa que você
            trabalha. A sua solicitação de resgate vai passar por uma avaliação
            e assim que aprovada você terá acesso ao QR Code usado para usufruir
            da premiação. Acompanhe sua solicitação{' '}
            <NavLink to="/my-reward-requests">clicando aqui.</NavLink>
          </p>
          <Button onClick={() => toggleCustomRewardSuccessModal()}>Ok</Button>
        </CustomRewardSuccessModal>
      </Modal>

      <Modal
        isOpen={modalStatusSelectCatalog}
        toggleModal={toggleSelectCatalogModal}
      >
        <SelectedCatalogModal>
          <h2>Resgatar Prêmio</h2>
          <br />
          <div>
            <span>
              <label>Título: </label>
              {selectedCatalogReward.title}
            </span>
            <br />
            <span>
              <label>Prêmio oferecido por: </label>
              {selectedCatalogReward.company_name}
              {selectedCatalogReward.reward_type === 'custom-reward'
                ? ' (sua empresa)'
                : ''}
            </span>
            <br />
            <span>
              <label>Pontos: </label>
              {selectedCatalogReward.points}
            </span>
            <br />
            <span>
              <label>Tipo de prêmio: </label>
              {selectedCatalogReward.reward_type === 'gift-card'
                ? 'vale-presente de parceiro'
                : 'prêmio customizado'}
            </span>
            <br />
            <span>
              <label>Unidades disponíveis: </label>
              {selectedCatalogReward.units_available}
            </span>
            <br />
            <span>
              <label>Política de resgate do prêmio: </label>
              <br />
              <i>{`"${selectedCatalogReward.description}"`}</i>
            </span>
          </div>
          <div>
            <Button light onClick={() => toggleSelectCatalogModal()}>
              Cancelar
            </Button>
            <Button
              loading={loading}
              onClick={() => handleConfirmRewardRequest()}
            >
              Confirmar
            </Button>
          </div>
        </SelectedCatalogModal>
      </Modal>

      <Container>
        <h2>
          Você tem <span>{userData.recognition_points} pontos</span> para
          resgatar
        </h2>
        <Content>
          {catalog &&
            catalog.map((catalogReward) => (
              <CatalogReward key={catalogReward.id}>
                <span>{catalogReward.title}</span>
                <img src={catalogReward.image_url} alt="Imagem do prêmio" />
                <div>{renderRequestButton(catalogReward)}</div>
              </CatalogReward>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default Catalog;
