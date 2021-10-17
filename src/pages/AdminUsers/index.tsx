import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiTrash, FiEdit } from 'react-icons/fi';
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
import ComboBox from '~/components/ComboBox';
import Modal from '~/components/Modal';
import Header from '~/components/Header';
import Loading from '~/components/Loading';

interface IUserData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  recognition_points: number;
  department_id: string;
  position_id: string;
}

interface INewUser {
  name: string;
  email: string;
  department_id: string;
  position_id: string;
}

interface IPositionData {
  id: string;
  position_name: string;
  points: number;
}

interface IDepartmentData {
  id: string;
  department_name: string;
}

const AdminUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<IUserData[]>([]);
  const [positions, setPositions] = useState<IPositionData[]>([]);
  const [departments, setDepartments] = useState<IDepartmentData[]>([]);
  const [editingUser, setEditingUser] = useState<IUserData>({} as IUserData);

  const [modalStatusNewUser, setModalStatusNewUser] = useState(false);
  const [modalStatusEditUser, setModalStatusEditUser] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadUsers(): Promise<void> {
      const response = await api.get<IUserData[]>('users');
      setUsers(response.data);
    }
    async function loadPositions(): Promise<void> {
      const response = await api.get<IPositionData[]>('positions');
      setPositions(response.data);
    }
    async function loadDepartments(): Promise<void> {
      const response = await api.get<IDepartmentData[]>('departments');
      setDepartments(response.data);
    }

    loadUsers();
    loadPositions();
    loadDepartments();
  }, []);

  const toggleNewUserModal = useCallback(() => {
    setModalStatusNewUser(!modalStatusNewUser);
  }, [modalStatusNewUser]);

  const toggleEditModal = useCallback(() => {
    setModalStatusEditUser(!modalStatusEditUser);
  }, [modalStatusEditUser]);

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
      setLoading(true);
      try {
        await validateForm(data);

        const response = await api.post<IUserData>('users', {
          name: data.name,
          email: data.email,
          department_id: data.department_id,
          position_id: data.position_id,
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
      setLoading(false);
    },
    [addToast, users, toggleNewUserModal, validateForm],
  );

  const handleEditUser = useCallback(
    async (data: IUserData) => {
      setEditingUser(data);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  const editUser = useCallback(
    async (data: IUserData) => {
      setLoading(true);
      try {
        await validateForm(data);

        const response = await api.put<IUserData>(`users/${editingUser.id}`, {
          department_id: data.department_id,
          position_id: data.position_id,
        });

        const updatedUsers = users.map((u) =>
          u.id === editingUser.id ? response.data : u,
        );
        setUsers(updatedUsers);
        toggleEditModal();
        addToast({
          type: 'success',
          title: 'Usuário editado com sucesso',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na edição do usuário',
          description: 'Ocorreu um erro ao editar o usuário, tente novamente.',
        });
      }
      setLoading(false);
    },
    [addToast, editingUser.id, toggleEditModal, users, validateForm],
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      setLoading(true);
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
      setLoading(false);
    },
    [addToast, users],
  );

  return (
    <>
      <Loading loading={loading} />
      <Header />
      <Modal isOpen={modalStatusNewUser} toggleModal={toggleNewUserModal}>
        <Form ref={formRef} onSubmit={handleNewUser}>
          <h2>Novo Usuário</h2>
          <br />
          <Input name="name" label="Nome" />
          <Input name="email" label="E-mail" />
          <ComboBox name="department_id" label="Departamento">
            {departments &&
              departments.map((department) => (
                <option value={department.id}>
                  {department.department_name}
                </option>
              ))}
          </ComboBox>
          <ComboBox name="position_id" label="Cargo">
            {positions &&
              positions.map((position) => (
                <option value={position.id}>{position.position_name}</option>
              ))}
          </ComboBox>

          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Modal isOpen={modalStatusEditUser} toggleModal={toggleEditModal}>
        <Form ref={formRef} onSubmit={editUser}>
          <h2>Editar Usuário</h2>
          <br />
          <ComboBox
            name="department_id"
            label="Departamento"
            defaultValue={editingUser.department_id}
          >
            {departments &&
              departments.map((department) => (
                <option value={department.id}>
                  {department.department_name}
                </option>
              ))}
          </ComboBox>
          <ComboBox
            name="position_id"
            label="Cargo"
            defaultValue={editingUser.position_id}
          >
            {positions &&
              positions.map((position) => (
                <option value={position.id}>{position.position_name}</option>
              ))}
          </ComboBox>

          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Container>
        <h3>Gerencie os usuários da sua conta</h3>
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
                <div>
                  <Button light onClick={() => handleEditUser(user)}>
                    <FiEdit />
                    Editar
                  </Button>
                  <Button light onClick={() => handleDeleteUser(user.id)}>
                    <FiTrash />
                    Excluir
                  </Button>
                </div>
              </UserCard>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminUsers;
