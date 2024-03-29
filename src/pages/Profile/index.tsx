import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiUser, FiLock, FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import defaultAvatar from '~/assets/default-avatar.png';
import api from '~/services/api';
import { useToast } from '~/hooks/toast';
import { useAuth } from '~/hooks/auth';
import getValidationErrors from '~/utils/getValidationErrors';

import Input from '~/components/Input';
import Button from '~/components/Button';
import Header from '~/components/Header';

import { Container, Content, AvatarInput, LogoutButton } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser, signOut } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.lenght,
            then: Yup.string()
              .min(6, 'No mínimo 6 dígitos')
              .required('Campo Obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.lenght,
              then: Yup.string()
                .min(6, 'No mínimo 6 dígitos')
                .required('Campo Obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/feed');

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description:
            'Suas informações do perfil foram atualizadas com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Ocorreu um erro ao atualização perfil, tente novamente',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/profile/avatar', data).then((response) => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <>
      <Header />
      <Container>
        <Content>
          <Form
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
          >
            <AvatarInput>
              <img
                src={user.avatar ? user.avatar : defaultAvatar}
                alt={user.name}
              />
              <label htmlFor="avatar">
                <FiCamera />

                <input type="file" id="avatar" onChange={handleAvatarChange} />
              </label>
            </AvatarInput>

            <Input name="name" icon={FiUser} label="Nome" />
            <Input name="email" icon={FiMail} label="E-mail" />

            <Input
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              icon={FiLock}
              type="password"
              label="Senha atual"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              label="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              label="Confirmar senha"
            />

            <Button type="submit">Confirmar Mudanças</Button>
            <LogoutButton type="button" onClick={signOut}>
              Deslogar
            </LogoutButton>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Profile;
