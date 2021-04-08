import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '~/components/Header';

import { Container, Content, Position, AddPosition } from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import getValidationErrors from '~/utils/getValidationErrors';
import { useToast } from '~/hooks/toast';

interface IPositionData {
  id: string;
  position_name: string;
  points: number;
}

interface INewPosition {
  position_name: string;
  points: number;
}

const AdminPositions: React.FC = () => {
  const [positions, setPositions] = useState<IPositionData[]>([]);
  const [editingPosition, setEditingPosition] = useState<IPositionData>(
    {} as IPositionData,
  );

  const [modalStatusNewPosition, setModalStatusNewPosition] = useState(false);
  const [modalStatusEditPosition, setModalStatusEditPosition] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadPositions(): Promise<void> {
      const response = await api.get<IPositionData[]>('positions');
      setPositions(response.data);
    }

    loadPositions();
  }, []);

  const toggleAddModal = useCallback(() => {
    setModalStatusNewPosition(!modalStatusNewPosition);
  }, [modalStatusNewPosition]);

  const toggleEditModal = useCallback(() => {
    setModalStatusEditPosition(!modalStatusEditPosition);
  }, [modalStatusEditPosition]);

  const validateForm = useCallback(async (data: INewPosition) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        position_name: Yup.string().required('Nome do cargo obrigatório'),
        points: Yup.number()
          .positive('Valor inválido')
          .required('Quantidade de pontos obrigatória'),
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
  }, []);

  const handleAddPosition = useCallback(
    async (data: INewPosition) => {
      try {
        await validateForm(data);

        const response = await api.post<IPositionData>('positions', {
          position_name: data.position_name,
          points: data.points,
        });

        setPositions([...positions, response.data]);
        toggleAddModal();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na criação do cargo',
          description: 'Ocorreu um erro ao criar o cargo, tente novamente.',
        });
      }
    },
    [addToast, positions, toggleAddModal, validateForm],
  );

  const handleEditPosition = useCallback(
    async (data: IPositionData) => {
      setEditingPosition(data);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  const editPosition = useCallback(
    async (data: IPositionData) => {
      try {
        await validateForm(data);

        const response = await api.put<IPositionData>(
          `positions/${editingPosition.id}`,
          {
            position_name: data.position_name,
            points: data.points,
          },
        );

        const updatedPositions = positions.map((p) =>
          p.id === editingPosition.id ? response.data : p,
        );
        setPositions(updatedPositions);
        toggleEditModal();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na edição do cargo',
          description: 'Ocorreu um erro ao editar o cargo, tente novamente.',
        });
      }
    },
    [addToast, positions, editingPosition.id, toggleEditModal, validateForm],
  );

  const handleDeletePosition = useCallback(
    async (id: string) => {
      try {
        await api.delete<IPositionData>(`positions/${id}`);
        const updatedPositions = positions.filter((c) => c.id !== id);
        setPositions(updatedPositions);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao deletar cargo',
          description: 'Ocorreu um erro ao deletar o cargo, tente novamente.',
        });
      }
    },
    [addToast, positions],
  );

  return (
    <>
      <Header />
      <Modal isOpen={modalStatusNewPosition} toggleModal={toggleAddModal}>
        <Form ref={formRef} onSubmit={handleAddPosition}>
          <h2>Novo Cargo</h2>
          <br />
          <Input name="position_name" label="Nome do cargo *" />
          <Input
            type="number"
            name="points"
            label="Pontos mensais *"
            defaultValue={100}
          />

          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Modal isOpen={modalStatusEditPosition} toggleModal={toggleEditModal}>
        <Form ref={formRef} onSubmit={editPosition}>
          <h2>Editar Cargo</h2>
          <br />
          <Input
            name="position_name"
            label="Nome do cargo"
            defaultValue={editingPosition.position_name}
          />
          <Input
            type="number"
            name="points"
            label="Pontos mensais"
            defaultValue={editingPosition.points}
          />

          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Container>
        <h2>Gerenciar Cargos</h2>
        <Content>
          <AddPosition onClick={toggleAddModal}>
            <FiPlus />
            <span>Novo cargo</span>
          </AddPosition>

          {positions &&
            positions.map((position) => (
              <Position key={position.id}>
                <div>
                  <span>
                    <label>Cargo: </label>
                    {position.position_name}
                  </span>
                  <br />
                  <span>
                    <label>Pontos mensais: </label>
                    {position.points}
                  </span>
                </div>
                <div>
                  <Button light onClick={() => handleEditPosition(position)}>
                    <FiEdit />
                    Editar
                  </Button>
                  <Button
                    light
                    onClick={() => handleDeletePosition(position.id)}
                  >
                    <FiTrash />
                    Excluir
                  </Button>
                </div>
              </Position>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminPositions;
