import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Link, useHistory, useLocation } from 'react-router-dom';

import { useToast } from '~/hooks/toast';
import getValidationErrors from '~/utils/getValidationErrors';

import Input from '~/components/Input';
import Button from '~/components/Button';

import {
  Container,
  Content,
  AnimationContainer,
  Header,
  HeaderContent,
} from './styles';
import api from '~/services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: 'Ocorreu um erro ao resetar sua senha, tente novamente.',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <h2>
            Mandou <b>Bem</b>
          </h2>
        </HeaderContent>
      </Header>

      <Content>
        <AnimationContainer>
          <h2>Resetar senha</h2>
          <Form ref={formRef} onSubmit={handleSubmit}>
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
              label="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
          <Link to="/">Voltar</Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ResetPassword;
