import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '~/components/Header';

import { Container, Content, CatalogReward, AddCatalogReward } from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Input from '~/components/Input';
import TextArea from '~/components/TextArea';
import Modal from '~/components/Modal';
import getValidationErrors from '~/utils/getValidationErrors';
import { useToast } from '~/hooks/toast';

interface ICatalogRewardData {
  id: string;
  title: string;
  points: number;
  image_url: string;
  units_available: number;
  expiration_days: number;
  description: string;
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
  const [catalogRewards, setCatalogRewards] = useState<ICatalogRewardData[]>(
    [],
  );
  const [editingCatalogReward, setEditingCatalogReward] = useState<
    ICatalogRewardData
  >({} as ICatalogRewardData);

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
      const response = await api.get<ICatalogRewardData[]>('/catalog-rewards');
      setCatalogRewards(response.data);
    }

    loadCatalogRewards();
  }, []);

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

  const handleAddCatalogReward = useCallback(
    async (data: INewCatalogReward) => {
      try {
        await validateForm(data);

        const response = await api.post<ICatalogRewardData>('catalog-rewards', {
          title: data.title,
          image_url: data.image_url,
          points: data.points,
          units_available: data.units_available,
          expiration_days: data.expiration_days,
          description: data.description,
        });

        setCatalogRewards([...catalogRewards, response.data]);
        toggleAddModal();
        addToast({
          type: 'success',
          title: 'Prêmio criado com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na criação do prêmio',
          description: 'Ocorreu um erro ao criar o prêmio, tente novamente.',
        });
      }
    },
    [addToast, catalogRewards, toggleAddModal, validateForm],
  );

  const handleEditCatalogReward = useCallback(
    async (data: ICatalogRewardData) => {
      setEditingCatalogReward(data);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  const editCatalogReward = useCallback(
    async (data: ICatalogRewardData) => {
      try {
        await validateForm(data);

        const response = await api.put<ICatalogRewardData>(
          `catalog-rewards/${editingCatalogReward.id}`,
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
        addToast({
          type: 'success',
          title: 'Prêmio editado com sucesso',
        });
      } catch (err) {
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

  const handleDeleteCatalogReward = useCallback(
    async (id: string) => {
      try {
        await api.delete<ICatalogRewardData>(`catalog-rewards/${id}`);
        const updatedCatalogRewards = catalogRewards.filter((c) => c.id !== id);
        setCatalogRewards(updatedCatalogRewards);
        addToast({
          type: 'success',
          title: 'Prêmio excluído com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao deletar prêmio',
          description: 'Ocorreu um erro ao deletar o prêmio, tente novamente.',
        });
      }
    },
    [addToast, catalogRewards],
  );

  return (
    <>
      <Header />
      <Modal isOpen={modalStatusNewCatalogReward} toggleModal={toggleAddModal}>
        <Form ref={formRef} onSubmit={handleAddCatalogReward}>
          <h2>Novo Prêmio</h2>
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

          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Modal
        isOpen={modalStatusEditCatalogReward}
        toggleModal={toggleEditModal}
      >
        <Form ref={formRef} onSubmit={editCatalogReward}>
          <h2>Editar Prêmio</h2>
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

          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Container>
        <h2>Deixe o catálogo com a cara da sua empresa</h2>
        <Content>
          <AddCatalogReward onClick={toggleAddModal}>
            <FiPlus />
            <span>Novo prêmio</span>
          </AddCatalogReward>

          {catalogRewards &&
            catalogRewards.map((catalogReward) => (
              <CatalogReward key={catalogReward.id}>
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
                    onClick={() => handleDeleteCatalogReward(catalogReward.id)}
                  >
                    <FiTrash />
                    Excluir
                  </Button>
                </div>
              </CatalogReward>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminCatalog;
