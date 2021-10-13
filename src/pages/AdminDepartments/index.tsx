import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Header from '~/components/Header';

import { Container, Content, Department, AddDepartment } from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import getValidationErrors from '~/utils/getValidationErrors';
import { useToast } from '~/hooks/toast';
import Loading from '~/components/Loading';

interface IDepartmentData {
  id: string;
  department_name: string;
}

interface INewDepartment {
  department_name: string;
}

const AdminDepartments: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState<IDepartmentData[]>([]);
  const [editingDepartment, setEditingDepartment] = useState<IDepartmentData>(
    {} as IDepartmentData,
  );

  const [modalStatusNewDepartment, setModalStatusNewDepartment] = useState(
    false,
  );
  const [modalStatusEditDepartment, setModalStatusEditDepartment] = useState(
    false,
  );
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadDepartments(): Promise<void> {
      const response = await api.get<IDepartmentData[]>('departments');
      setDepartments(response.data);
    }

    loadDepartments();
  }, []);

  const toggleAddModal = useCallback(() => {
    setModalStatusNewDepartment(!modalStatusNewDepartment);
  }, [modalStatusNewDepartment]);

  const toggleEditModal = useCallback(() => {
    setModalStatusEditDepartment(!modalStatusEditDepartment);
  }, [modalStatusEditDepartment]);

  const validateForm = useCallback(async (data: INewDepartment) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        department_name: Yup.string().required(
          'Nome do departamento obrigatório',
        ),
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

  const handleAddDepartment = useCallback(
    async (data: INewDepartment) => {
      setLoading(true);
      try {
        await validateForm(data);

        const response = await api.post<IDepartmentData>('departments', {
          department_name: data.department_name,
        });

        setDepartments([...departments, response.data]);
        toggleAddModal();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na criação do departmento',
          description:
            'Ocorreu um erro ao criar o departamento, tente novamente.',
        });
      }
      setLoading(false);
    },
    [addToast, departments, toggleAddModal, validateForm],
  );

  const handleEditDepartment = useCallback(
    async (data: IDepartmentData) => {
      setEditingDepartment(data);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  const editDepartment = useCallback(
    async (data: IDepartmentData) => {
      setLoading(true);
      try {
        await validateForm(data);

        const response = await api.put<IDepartmentData>(
          `departments/${editingDepartment.id}`,
          {
            department_name: data.department_name,
          },
        );

        const updatedDepartments = departments.map((d) =>
          d.id === editingDepartment.id ? response.data : d,
        );
        setDepartments(updatedDepartments);
        toggleEditModal();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na edição do departamento',
          description:
            'Ocorreu um erro ao editar o departamento, tente novamente.',
        });
      }
      setLoading(false);
    },
    [
      addToast,
      departments,
      editingDepartment.id,
      toggleEditModal,
      validateForm,
    ],
  );

  const handleDeleteDepartment = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await api.delete<IDepartmentData>(`departments/${id}`);
        const updatedDepartments = departments.filter((d) => d.id !== id);
        setDepartments(updatedDepartments);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao deletar departamento',
          description:
            'Ocorreu um erro ao deletar o departamento, tente novamente.',
        });
      }
      setLoading(false);
    },
    [addToast, departments],
  );

  return (
    <>
      <Loading loading={loading} />

      <Header />
      <Modal isOpen={modalStatusNewDepartment} toggleModal={toggleAddModal}>
        <Form ref={formRef} onSubmit={handleAddDepartment}>
          <h2>Novo Departamento</h2>
          <br />
          <Input name="department_name" label="Nome do departamento *" />

          <Button light onClick={() => toggleAddModal()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Modal isOpen={modalStatusEditDepartment} toggleModal={toggleEditModal}>
        <Form ref={formRef} onSubmit={editDepartment}>
          <h2>Editar Departamento</h2>
          <br />
          <Input
            name="department_name"
            label="Nome do Departamento"
            defaultValue={editingDepartment.department_name}
          />

          <Button light onClick={() => toggleEditModal()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </Form>
      </Modal>

      <Container>
        <h3>Gerenciar Departamentos</h3>
        <Content>
          <AddDepartment onClick={toggleAddModal}>
            <FiPlus />
            <span>Novo departamento</span>
          </AddDepartment>

          {departments &&
            departments.map((department) => (
              <Department key={department.id}>
                <div>
                  <span>{department.department_name}</span>
                </div>
                <div>
                  <Button
                    light
                    onClick={() => handleEditDepartment(department)}
                  >
                    <FiEdit />
                    Editar
                  </Button>
                  <Button
                    light
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    <FiTrash />
                    Excluir
                  </Button>
                </div>
              </Department>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminDepartments;
