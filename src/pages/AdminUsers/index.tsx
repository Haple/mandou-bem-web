import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiTrash } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import defaultAvatar from '~/assets/default-avatar.png';

import api from '~/services/api';
import getValidationErrors from '~/utils/getValidationErrors';
import { useToast } from '~/hooks/toast';

import { Container, Content, UserCard, AddUser } from './styles';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import Header from '~/components/Header';

interface IUserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface INewUser {
  name: string;
  email: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<IUserData[]>([]);

  const [modalStatusNewUser, setModalStatusNewUser] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadUsers(): Promise<void> {
      const response = await api.get<IUserData[]>('/users');
      setUsers(response.data);
    }

    loadUsers();
  }, []);

  const toggleNewUserModal = useCallback(() => {
    setModalStatusNewUser(!modalStatusNewUser);
  }, [modalStatusNewUser]);

  const validateForm = useCallback(async (data: INewUser) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().email().required('E-mail obrigatória'),
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

  const handleNewUser = useCallback(
    async (data: INewUser) => {
      try {
        await validateForm(data);

        const response = await api.post<IUserData>('users', {
          name: data.name,
          email: data.email,
        });

        setUsers([...users, response.data]);
        toggleNewUserModal();

        addToast({
          type: 'success',
          title: 'Usuário criado com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na criação do usuário',
          description: 'Ocorreu um erro ao criar o usuário, tente novamente.',
        });
      }
    },
    [addToast, users, toggleNewUserModal, validateForm],
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        await api.delete<IUserData>(`users/${id}`);
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        addToast({
          type: 'success',
          title: 'Usuário deletado com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao deletar usuário',
          description: 'Ocorreu um erro ao deletar o usuário, tente novamente.',
        });
      }
    },
    [addToast, users],
  );

  return (
    <>
      <Header />
      <Modal isOpen={modalStatusNewUser} toggleModal={toggleNewUserModal}>
        <Form ref={formRef} onSubmit={handleNewUser}>
          <h2>Novo Usuário</h2>
          <br />
          <Input name="name" placeholder="Alessandra Valente" />
          <Input name="email" placeholder="ale.valente@corp.com.br" />

          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Container>
        <h2>Gerencie os usuários da sua conta</h2>
        <Content>
          <AddUser onClick={toggleNewUserModal}>
            <FiPlus />
            <span>Novo usuário</span>
          </AddUser>

          {users &&
            users.map((user) => (
              <UserCard key={user.id}>
                <div>
                  <img
                    src={user.avatar ? user.avatar : defaultAvatar}
                    alt={user.name}
                  />
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
                <Button light onClick={() => handleDeleteUser(user.id)}>
                  <FiTrash />
                  Excluir
                </Button>
              </UserCard>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminUsers;
