import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiPlus, FiEye } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router-dom';
import Header from '~/components/Header';

import {
  Container,
  Content,
  EnpsSurvey,
  AddEnpsSurvey,
  EnpsScore,
} from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Modal from '~/components/Modal';
import getValidationErrors from '~/utils/getValidationErrors';
import { useToast } from '~/hooks/toast';
import TextArea from '~/components/TextArea';
import ComboBox from '~/components/ComboBox';
import DateInput from '~/components/DateInput';

interface IEnpsSurveyData {
  id: string;
  created_at: string;
  created_at_formatted: string;
  end_date: string;
  end_date_formatted: string;
  ended: boolean;
  ended_at?: string;
  ended_at_formatted?: string;
  enps_score: number;
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

interface INewEnpsSurvey {
  end_date: string;
  question?: string;
  position_id?: string;
  department_id?: string;
}

const AdminEnpsSurveys: React.FC = () => {
  const [enpsSurveys, setEnpsSurveys] = useState<IEnpsSurveyData[]>([]);
  const [positions, setPositions] = useState<IPositionData[]>([]);
  const [departments, setDepartments] = useState<IDepartmentData[]>([]);

  const [modalStatusNewEnpsSurvey, setModalStatusNewEnpsSurvey] = useState(
    false,
  );
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
    async function loadEnpsSurveys(): Promise<void> {
      const { data } = await api.get<IEnpsSurveyData[]>('enps-surveys');

      const formatted_data = data.map((survey) => ({
        ...survey,
        created_at_formatted: format(parseISO(survey.created_at), 'dd/MM/yyyy'),
        end_date_formatted: format(parseISO(survey.end_date), 'dd/MM/yyyy'),
        ended_at_formatted: survey.ended_at
          ? format(parseISO(survey.ended_at), 'dd/MM/yyyy')
          : undefined,
      }));

      setEnpsSurveys(formatted_data);
    }
    async function loadPositions(): Promise<void> {
      const response = await api.get<IPositionData[]>('positions');
      setPositions(response.data);
    }
    async function loadDepartments(): Promise<void> {
      const response = await api.get<IDepartmentData[]>('departments');
      setDepartments(response.data);
    }

    loadEnpsSurveys();
    loadPositions();
    loadDepartments();
  }, []);

  const toggleAddModal = useCallback(() => {
    setModalStatusNewEnpsSurvey(!modalStatusNewEnpsSurvey);
  }, [modalStatusNewEnpsSurvey]);

  const validateForm = useCallback(async (data: INewEnpsSurvey) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        end_date: Yup.date().required('Data de término obrigatória'),
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

  const handleAddEnpsSurvey = useCallback(
    async (data: INewEnpsSurvey) => {
      try {
        await validateForm(data);

        const question =
          !data.question || data.question?.trim() === '' ? null : data.question;
        const position_id =
          data.position_id === 'all' ? null : data.position_id;
        const department_id =
          data.department_id === 'all' ? null : data.department_id;

        const response = await api.post<IEnpsSurveyData>('enps-surveys', {
          end_date: data.end_date,
          question,
          position_id,
          department_id,
        });

        const formatted_response = {
          ...response.data,
          created_at_formatted: format(
            parseISO(response.data.created_at),
            'dd/MM/yyyy',
          ),
          end_date_formatted: format(
            parseISO(response.data.end_date),
            'dd/MM/yyyy',
          ),
          ended_at_formatted: response.data.ended_at
            ? format(parseISO(response.data.ended_at), 'dd/MM/yyyy')
            : undefined,
        };

        setEnpsSurveys([formatted_response, ...enpsSurveys]);
        toggleAddModal();
        addToast({
          type: 'success',
          title: 'Pesquisa iniciada com sucesso :)',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na criação da pesquisa ENPS',
          description:
            'Ocorreu um erro ao criar a pesquisa ENPS, tente novamente.',
        });
      }
    },
    [addToast, enpsSurveys, toggleAddModal, validateForm],
  );

  const handleClickDetail = useCallback(
    async (id: string) => {
      history.push(`/admin-panel/enps-surveys/${id}/details`);
    },
    [history],
  );

  return (
    <>
      <Header />
      <Modal isOpen={modalStatusNewEnpsSurvey} toggleModal={toggleAddModal}>
        <Form ref={formRef} onSubmit={handleAddEnpsSurvey}>
          <h2>Nova Pesquisa E-NPS</h2>
          <br />
          <TextArea
            name="question"
            label="Pergunta realizada"
            placeholder={
              'Exemplo: Em uma escala de 0 a 10, qual a' +
              ' probabilidade de você recomendar esta empresa' +
              ' como um bom lugar para trabalhar?'
            }
          />
          <DateInput name="end_date" label="Data de término *" />
          <ComboBox name="department_id" label="Departamento">
            <option selected value="all">
              Todos
            </option>
            {departments &&
              departments.map((department) => (
                <option value={department.id} key={department.id}>
                  {department.department_name}
                </option>
              ))}
          </ComboBox>
          <ComboBox name="position_id" label="Cargo">
            <option selected value="all">
              Todos
            </option>
            {positions &&
              positions.map((position) => (
                <option value={position.id} key={position.id}>
                  {position.position_name}
                </option>
              ))}
          </ComboBox>

          <Button type="submit">Iniciar pesquisa</Button>
        </Form>
      </Modal>

      <Container>
        <h2>Pesquisas E-NPS</h2>
        <Content>
          <AddEnpsSurvey onClick={toggleAddModal}>
            <FiPlus />
            <span>Nova pesquisa E-NPS</span>
          </AddEnpsSurvey>

          {enpsSurveys &&
            enpsSurveys.map((enpsSurvey) => (
              <EnpsSurvey key={enpsSurvey.id}>
                <EnpsScore score={enpsSurvey.enps_score}>
                  <label>E-NPS</label>
                  <span>
                    {enpsSurvey.enps_score === undefined ||
                      (enpsSurvey.enps_score === null && '?')}
                    {enpsSurvey.enps_score}
                  </span>
                </EnpsScore>
                <div>
                  {!enpsSurvey.ended && (
                    <span>
                      Pesquisa criada em{' '}
                      <b>{enpsSurvey.created_at_formatted} </b>
                      com data de término prevista para{' '}
                      <b>{enpsSurvey.end_date_formatted}</b>.
                    </span>
                  )}

                  {enpsSurvey.ended && (
                    <span>
                      Pesquisa criada em{' '}
                      <b>{enpsSurvey.created_at_formatted}</b> e concluída em{' '}
                      <b>
                        {enpsSurvey.ended_at && enpsSurvey.ended_at_formatted}
                        {!enpsSurvey.ended_at && enpsSurvey.end_date_formatted}
                      </b>
                      .
                    </span>
                  )}
                </div>
                <Button light onClick={() => handleClickDetail(enpsSurvey.id)}>
                  <FiEye />
                  Ver detalhes
                </Button>
              </EnpsSurvey>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminEnpsSurveys;
