import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiEdit, FiTrash, FiEyeOff, FiEye } from 'react-icons/fi';
import { BiDetail } from 'react-icons/bi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '~/components/Header';

import {
  Container,
  Content,
  CatalogReward,
  AddCatalogReward,
  SelectedGiftCardModal,
  SwitchGiftCardModal,
} from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Input from '~/components/Input';
import TextArea from '~/components/TextArea';
import Modal from '~/components/Modal';
import getValidationErrors from '~/utils/getValidationErrors';
import { useToast } from '~/hooks/toast';
import Loading from '~/components/Loading';

interface ICatalogRewardData {
  id: string;
  title: string;
  points: number;
  image_url: string;
  units_available: number;
  expiration_days: number;
  description: string;
  company_name: string;
  reward_type: 'custom-reward' | 'gift-card';
  enabled: boolean;
}

interface INewCatalogReward {
  title: string;
  image_url: string;
  points: number;
  units_available: number;
  expiration_days: number;
  description: string;
}

const AdminCatalog: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [catalogRewards, setCatalogRewards] = useState<ICatalogRewardData[]>(
    [],
  );
  const [editingCatalogReward, setEditingCatalogReward] = useState<
    ICatalogRewardData
  >({} as ICatalogRewardData);
  const [giftCardToSwitch, setGiftCardToSwitch] = useState<ICatalogRewardData>(
    {} as ICatalogRewardData,
  );
  const [giftCardDetails, setGiftCardDetails] = useState<ICatalogRewardData>(
    {} as ICatalogRewardData,
  );

  const [modalSwitchGiftCardStatus, setModalSwitchGiftCardStatus] = useState(
    false,
  );
  const [modalGiftCardDetailsStatus, setModalGiftCardDetailsStatus] = useState(
    false,
  );
  const [
    modalStatusNewCatalogReward,
    setModalStatusNewCatalogReward,
  ] = useState(false);
  const [
    modalStatusEditCatalogReward,
    setModalStatusEditCatalogReward,
  ] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadCatalogRewards(): Promise<void> {
      const response = await api.get<ICatalogRewardData[]>('/catalog');
      setCatalogRewards(response.data);
    }

    loadCatalogRewards();
  }, []);

  const toggleSwitchGiftCardModal = useCallback(() => {
    setModalSwitchGiftCardStatus(!modalSwitchGiftCardStatus);
  }, [modalSwitchGiftCardStatus]);

  const toggleGiftCardDetailsModal = useCallback(() => {
    setModalGiftCardDetailsStatus(!modalGiftCardDetailsStatus);
  }, [modalGiftCardDetailsStatus]);

  const toggleAddModal = useCallback(() => {
    setModalStatusNewCatalogReward(!modalStatusNewCatalogReward);
  }, [modalStatusNewCatalogReward]);

  const toggleEditModal = useCallback(() => {
    setModalStatusEditCatalogReward(!modalStatusEditCatalogReward);
  }, [modalStatusEditCatalogReward]);

  const validateForm = useCallback(async (data: INewCatalogReward) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        title: Yup.string().required('Título obrigatório'),
        image_url: Yup.string().url().required('URL da imagem obrigatória'),
        points: Yup.number()
          .positive('Valor inválido')
          .required('Quantidade de pontos obrigatória'),
        units_available: Yup.number()
          .positive('Valor inválido')
          .required('Unidades disponíveis obrigatória'),
        expiration_days: Yup.number()
          .positive('Valor inválido')
          .required('Quantidade de dias de validade obrigatória'),
        description: Yup.string().required(
          'Política de resgate do prêmio obrigatório',
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  const addCatalogRewardRequest = useCallback(
    async (data: INewCatalogReward) => {
      try {
        setLoading(true);
        await validateForm(data);

        const response = await api.post<ICatalogRewardData>('custom-rewards', {
          title: data.title,
          image_url: data.image_url,
          points: data.points,
          units_available: data.units_available,
          expiration_days: data.expiration_days,
          description: data.description,
        });

        setCatalogRewards([...catalogRewards, response.data]);
        setLoading(false);
        toggleAddModal();
        addToast({
          type: 'success',
          title: 'Prêmio criado com sucesso',
        });
      } catch (err) {
        setLoading(false);
        toggleAddModal();
        addToast({
          type: 'error',
          title: 'Erro na criação do prêmio',
          description: 'Ocorreu um erro ao criar o prêmio, tente novamente.',
        });
      }
    },
    [addToast, catalogRewards, toggleAddModal, validateForm],
  );

  const editCatalogRewardRequest = useCallback(
    async (data: ICatalogRewardData) => {
      try {
        setLoading(true);
        await validateForm(data);

        const response = await api.put<ICatalogRewardData>(
          `custom-rewards/${editingCatalogReward.id}`,
          {
            title: data.title,
            image_url: data.image_url,
            points: data.points,
            units_available: data.units_available,
            expiration_days: data.expiration_days,
            description: data.description,
          },
        );

        const updatedCatalogRewards = catalogRewards.map((c) =>
          c.id === editingCatalogReward.id ? response.data : c,
        );
        setCatalogRewards(updatedCatalogRewards);
        toggleEditModal();
        setLoading(false);
        addToast({
          type: 'success',
          title: 'Prêmio editado com sucesso',
        });
      } catch (err) {
        setLoading(false);
        toggleEditModal();
        addToast({
          type: 'error',
          title: 'Erro na edição do prêmio',
          description: 'Ocorreu um erro ao editar o prêmio, tente novamente.',
        });
      }
    },
    [
      addToast,
      catalogRewards,
      editingCatalogReward.id,
      toggleEditModal,
      validateForm,
    ],
  );

  const deleteCatalogRewardRequest = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await api.delete<ICatalogRewardData>(`custom-rewards/${id}`);
        const updatedCatalogRewards = catalogRewards.filter((c) => c.id !== id);
        setCatalogRewards(updatedCatalogRewards);
        setLoading(false);
        addToast({
          type: 'success',
          title: 'Prêmio excluído com sucesso',
        });
      } catch (err) {
        setLoading(false);
        addToast({
          type: 'error',
          title: 'Erro ao deletar prêmio',
          description: 'Ocorreu um erro ao deletar o prêmio, tente novamente.',
        });
      }
    },
    [addToast, catalogRewards],
  );

  const switchGiftCardRequest = useCallback(async () => {
    try {
      setLoading(true);
      await api.post(`/catalog/gift-card/switch`, {
        gift_card_id: giftCardToSwitch.id,
        status: !giftCardToSwitch.enabled,
      });

      const updatedCatalogRewards = catalogRewards.map((reward) =>
        reward.id === giftCardToSwitch.id
          ? { ...reward, enabled: !giftCardToSwitch.enabled }
          : reward,
      );
      setCatalogRewards(updatedCatalogRewards);
      setLoading(false);
      toggleSwitchGiftCardModal();
      addToast({
        type: 'success',
        title: giftCardToSwitch.enabled
          ? 'Vale-presente desabilitado com sucesso'
          : 'Vale-presente habilitado com sucesso',
      });
    } catch (err) {
      setLoading(false);
      toggleSwitchGiftCardModal();
      addToast({
        type: 'error',
        title: 'Erro ao trocar status do vale-presente',
        description:
          'Ocorreu um erro ao trocar o status do vale-presente, tente novamente.',
      });
    }
  }, [
    addToast,
    catalogRewards,
    giftCardToSwitch.enabled,
    giftCardToSwitch.id,
    toggleSwitchGiftCardModal,
  ]);

  const handleEditCatalogReward = useCallback(
    async (data: ICatalogRewardData) => {
      setEditingCatalogReward(data);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  const handleSwitchGiftCard = useCallback(
    async (data: ICatalogRewardData) => {
      setGiftCardToSwitch(data);
      toggleSwitchGiftCardModal();
    },
    [toggleSwitchGiftCardModal],
  );

  const handleGiftCardDetails = useCallback(
    async (data: ICatalogRewardData) => {
      setGiftCardDetails(data);
      toggleGiftCardDetailsModal();
    },
    [toggleGiftCardDetailsModal],
  );

  return (
    <>
      <Loading loading={loading} />

      <Header />
      <Modal isOpen={modalStatusNewCatalogReward} toggleModal={toggleAddModal}>
        <Form ref={formRef} onSubmit={addCatalogRewardRequest}>
          <h2>Novo Prêmio Customizado</h2>
          <br />
          <Input name="title" label="Título" />
          <Input name="image_url" label="Link da imagem" />
          <Input
            type="number"
            name="points"
            label="Quantidade de pontos"
            defaultValue={0}
          />
          <Input
            type="number"
            name="units_available"
            label="Unidades disponíveis"
            defaultValue={0}
          />
          <Input
            type="number"
            name="expiration_days"
            label="Quantidade de dias de validade"
            defaultValue={0}
          />
          <TextArea name="description" label="Política de resgate do prêmio" />

          <Button light onClick={() => toggleAddModal()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Modal
        isOpen={modalStatusEditCatalogReward}
        toggleModal={toggleEditModal}
      >
        <Form ref={formRef} onSubmit={editCatalogRewardRequest}>
          <h2>Editar Prêmio Customizado</h2>
          <br />
          <Input
            name="title"
            label="Título"
            defaultValue={editingCatalogReward.title}
          />
          <Input
            name="image_url"
            label="Link da imagem"
            defaultValue={editingCatalogReward.image_url}
          />
          <Input
            type="number"
            name="points"
            label="Quantidade de pontos"
            defaultValue={editingCatalogReward.points}
          />
          <Input
            type="number"
            name="units_available"
            label="Unidades disponíveis"
            defaultValue={editingCatalogReward.units_available}
          />
          <Input
            type="number"
            name="expiration_days"
            label="Quantidade de dias de validade"
            defaultValue={editingCatalogReward.expiration_days}
          />
          <TextArea
            name="description"
            label="Política de resgate do prêmio"
            defaultValue={editingCatalogReward.description}
          />

          <Button light onClick={() => toggleEditModal()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Modal
        isOpen={modalGiftCardDetailsStatus}
        toggleModal={toggleGiftCardDetailsModal}
      >
        <SelectedGiftCardModal>
          <h2>Vale-Presente de Parceiro</h2>
          <br />
          <div>
            <span>
              <label>Título: </label>
              {giftCardDetails.title}
            </span>
            <br />
            <span>
              <label>Prêmio oferecido por: </label>
              {giftCardDetails.company_name}
            </span>
            <br />
            <span>
              <label>Status: </label>
              {giftCardDetails.enabled && 'Habilitado'}
              {!giftCardDetails.enabled && 'Desabilitado'}
            </span>
            <br />
            <span>
              <label>Pontos: </label>
              {giftCardDetails.points}
            </span>
            <br />
            <span>
              <label>Unidades disponíveis: </label>
              {giftCardDetails.units_available}
            </span>
            <br />
            <span>
              <label>Política de resgate do prêmio: </label>
              <br />
              <i>{`"${giftCardDetails.description}"`}</i>
            </span>
          </div>
          <div>
            <Button onClick={() => toggleGiftCardDetailsModal()}>Ok</Button>
          </div>
        </SelectedGiftCardModal>
      </Modal>

      <Modal
        isOpen={modalSwitchGiftCardStatus}
        toggleModal={toggleSwitchGiftCardModal}
      >
        <SwitchGiftCardModal>
          <Form ref={formRef} onSubmit={switchGiftCardRequest}>
            {giftCardToSwitch.enabled && (
              <>
                <h2>Desabilitar Vale-Presente</h2>
                <br />
                <div>
                  <span>
                    Ao clicar em confirmar esse vale-presente será{' '}
                    <b>desabilitado</b> e seus colaboradores não serão capazes
                    de resgatá-lo. Gostaria de confirmar?
                  </span>
                </div>
                <div>
                  <Button light onClick={() => toggleSwitchGiftCardModal()}>
                    Cancelar
                  </Button>
                  <Button type="submit">Confirmar</Button>
                </div>
              </>
            )}

            {!giftCardToSwitch.enabled && (
              <>
                <h2>Habilitar Vale-Presente</h2>
                <br />
                <div>
                  <span>
                    Ao clicar em confirmar esse vale-presente será{' '}
                    <b>habilitado</b> e seus colaboradores serão capazes de
                    resgatá-lo. Gostaria de confirmar?
                  </span>
                </div>
                <div>
                  <Button light onClick={() => toggleSwitchGiftCardModal()}>
                    Cancelar
                  </Button>
                  <Button type="submit">Confirmar</Button>
                </div>
              </>
            )}
          </Form>
        </SwitchGiftCardModal>
      </Modal>

      <Container>
        <h3>Deixe o catálogo com a cara da sua empresa</h3>
        <Content>
          <AddCatalogReward onClick={toggleAddModal}>
            <FiPlus />
            <span>Novo prêmio customizado</span>
          </AddCatalogReward>

          {catalogRewards &&
            catalogRewards.map((catalogReward) => (
              <CatalogReward key={catalogReward.id}>
                {(catalogReward.reward_type === 'custom-reward' ||
                  !catalogReward.reward_type) && (
                  <>
                    <span>{catalogReward.title}</span>
                    <img src={catalogReward.image_url} alt="Imagem do prêmio" />
                    <div>
                      <Button
                        light
                        onClick={() => handleEditCatalogReward(catalogReward)}
                      >
                        <FiEdit />
                        Editar
                      </Button>
                      <Button
                        light
                        onClick={() =>
                          deleteCatalogRewardRequest(catalogReward.id)
                        }
                      >
                        <FiTrash />
                        Excluir
                      </Button>
                    </div>
                  </>
                )}
                {catalogReward.reward_type === 'gift-card' && (
                  <>
                    <span>
                      {catalogReward.title}{' '}
                      {catalogReward.enabled && <FiEye title="Habilitado" />}
                      {!catalogReward.enabled && (
                        <FiEyeOff title="Desabilitado" />
                      )}
                    </span>
                    <img src={catalogReward.image_url} alt="Imagem do prêmio" />
                    <div>
                      <Button
                        light
                        onClick={() => handleGiftCardDetails(catalogReward)}
                      >
                        <BiDetail />
                        Detalhes
                      </Button>
                      <Button
                        light
                        onClick={() => handleSwitchGiftCard(catalogReward)}
                      >
                        {catalogReward.enabled && (
                          <>
                            <FiEyeOff /> Desabilitar
                          </>
                        )}
                        {!catalogReward.enabled && (
                          <>
                            <FiEye /> Habilitar
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CatalogReward>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminCatalog;
