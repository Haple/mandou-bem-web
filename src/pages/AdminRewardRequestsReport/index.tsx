import React, { useState, useEffect, useRef, useCallback } from 'react';

import { FiDownload, FiSearch } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { format, parseISO } from 'date-fns';

import Header from '~/components/Header';
import ComboBox from '~/components/ComboBox';
import DateInput from '~/components/DateInput';

import {
  Container,
  Content,
  SearchOptions,
  RewardRequestsContainer,
} from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import Loading from '~/components/Loading';
import { useToast } from '~/hooks/toast';

interface IPagination<T> {
  total: number;
  result: T[];
}

interface IRewardRequest {
  id: string;
  created_at: string;
  user_name: string;
  reward_title: string;
  status: 'pending_approval' | 'use_available' | 'used' | 'reproved';
  status_formatted: string;
  department_id: string;
  department_name: string;
  position_id: string;
  position_name: string;
  provider_name: string;
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

interface IProviderData {
  id: string;
  company_name: string;
}

const AdminRewardRequestsReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rewardType, setRewardType] = useState('custom_reward');
  const [positions, setPositions] = useState<IPositionData[]>([]);
  const [departments, setDepartments] = useState<IDepartmentData[]>([]);
  const [providers, setProviders] = useState<IProviderData[]>([]);

  const [rewardRequests, setRewardRequests] = useState<IRewardRequest[]>([]);
  const [page, setPage] = useState(0);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  /**
   * Load departments, positions and providers
   */
  useEffect(() => {
    async function loadPositions(): Promise<void> {
      const response = await api.get<IPositionData[]>('positions');
      setPositions(response.data);
    }
    async function loadDepartments(): Promise<void> {
      const response = await api.get<IDepartmentData[]>('departments');
      setDepartments(response.data);
    }
    async function loadProviders(): Promise<void> {
      const response = await api.get<IProviderData[]>('providers');
      setProviders(response.data);
    }

    Promise.all([loadPositions(), loadDepartments(), loadProviders()]);
  }, []);

  const getRewardRequests = useCallback(async (page?: number): Promise<
    IRewardRequest[]
  > => {
    const start_date =
      formRef.current?.getFieldValue('start_date') || '2000-01-01';
    const end_date =
      formRef.current?.getFieldValue('end_date') || new Date().toISOString();
    const reward_type = formRef?.current?.getFieldValue('reward_type');
    const department_id =
      formRef?.current?.getFieldValue('department_id') || null;
    const position_id = formRef?.current?.getFieldValue('position_id') || null;
    const status = formRef?.current?.getFieldValue('status');
    const provider_id = formRef?.current?.getFieldValue('provider_id');

    const response = await api.get<IPagination<IRewardRequest>>(
      `reward-requests-report`,
      {
        params: {
          reward_type,
          page: page || 0,
          size: 10,
          start_date,
          end_date,
          department_id: department_id === 'all' ? null : department_id,
          position_id: position_id === 'all' ? null : position_id,
          provider_id:
            !provider_id || provider_id === 'all' ? null : provider_id,
          status: status === 'all' ? null : status,
        },
      },
    );

    const status_format = {
      pending_approval: 'Pendente de aprovação',
      use_available: 'Disponível para utilização',
      used: 'Utilizado',
      reproved: 'Recusado',
    };

    const answers = response.data.result.map((answer) => ({
      ...answer,
      created_at: format(parseISO(answer.created_at), 'dd/MM/yyyy'),
      status_formatted: status_format[answer.status],
    }));

    return answers;
  }, []);

  const handleGetRewardRequests = useCallback(async () => {
    try {
      const reward_requests = await getRewardRequests(0);
      setPage(0);
      setRewardRequests(reward_requests);

      setLoading(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao consultar os resgates de prêmios',
        description:
          'Ocorreu um erro ao consultar os resgates de prêmios, tente novamente.',
      });
      setLoading(false);
    }
  }, [addToast, getRewardRequests]);

  const handleDownloadPDF = useCallback(async () => {
    try {
      const start_date =
        formRef.current?.getFieldValue('start_date') || '2000-01-01';
      const end_date =
        formRef.current?.getFieldValue('end_date') || new Date().toISOString();
      const reward_type = formRef?.current?.getFieldValue('reward_type');
      const department_id =
        formRef?.current?.getFieldValue('department_id') || null;
      const position_id =
        formRef?.current?.getFieldValue('position_id') || null;
      const status = formRef?.current?.getFieldValue('status');
      const provider_id = formRef?.current?.getFieldValue('provider_id');

      const { data } = await api.get(`reward-requests-report/pdf`, {
        params: {
          reward_type,
          start_date,
          end_date,
          department_id: department_id === 'all' ? null : department_id,
          position_id: position_id === 'all' ? null : position_id,
          provider_id:
            !provider_id || provider_id === 'all' ? null : provider_id,
          status: status === 'all' ? null : status,
        },
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
        },
      });
      const blob = new Blob([data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `resgates-de-premios-${new Date().getTime()}.pdf`;
      link.click();
      setLoading(false);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro ao baixar PDF de resgates de prêmios',
        description:
          'Ocorreu um erro ao baixar o PDF dos resgates de prêmios, tente novamente.',
      });
    }
  }, [addToast]);

  const handleScroll = useCallback(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;

    const answers = await getRewardRequests(page + 1);
    setRewardRequests([...rewardRequests, ...answers]);
    setPage(page + 1);
  }, [rewardRequests, getRewardRequests, page]);

  const handleRewardTypeChange = useCallback(
    (data: React.ChangeEvent<HTMLSelectElement>) => {
      setRewardType(data.target.value);
    },
    [],
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Loading loading={loading} />
      <Header />

      <Container>
        <h2>Relatório de Resgates de Prêmios</h2>
        <br />
        <Content>
          <SearchOptions>
            <Form ref={formRef} onSubmit={() => setLoading(true)}>
              <div>
                <DateInput name="start_date" label="Data inicial" />
                <DateInput name="end_date" label="Data final" />
                <ComboBox
                  name="reward_type"
                  label="Tipo de prêmio"
                  onChange={handleRewardTypeChange}
                >
                  <option selected value="custom_reward">
                    Prêmio customizado
                  </option>
                  <option value="gift_card">Vale-presente</option>
                </ComboBox>
              </div>

              <div>
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
              </div>

              <div>
                <ComboBox name="status" label="Status">
                  <option selected value="all">
                    Todos
                  </option>
                  {rewardType === 'custom_reward' && (
                    <>
                      <option value="pending_approval">
                        Pendente de aprovação
                      </option>
                      <option value="reproved">Recusado</option>
                    </>
                  )}
                  <option value="use_available">
                    Disponível para utilização
                  </option>
                  <option value="used">Utilizado</option>
                </ComboBox>
                {rewardType === 'gift_card' && (
                  <ComboBox name="provider_id" label="Fornecedor">
                    <option selected value="all">
                      Todos
                    </option>
                    {providers &&
                      providers.map((provider) => (
                        <option value={provider.id} key={provider.id}>
                          {provider.company_name}
                        </option>
                      ))}
                  </ComboBox>
                )}
              </div>

              <div className="actions">
                <Button
                  type="submit"
                  light
                  onClick={() => handleGetRewardRequests()}
                >
                  <FiSearch />
                  Consultar
                </Button>
                <Button type="submit" light onClick={() => handleDownloadPDF()}>
                  <FiDownload />
                  Baixar PDF
                </Button>
              </div>
            </Form>
          </SearchOptions>
          <br />
          <RewardRequestsContainer>
            <table>
              <thead>
                <th>Data</th>
                <th>Colaborador(a)</th>
                <th>Prêmio</th>
                <th>Status</th>
                <th>Cargo</th>
                <th>Departamento</th>
              </thead>
              <tbody>
                {rewardRequests &&
                  rewardRequests.map((rewardRequest) => (
                    <tr key={rewardRequest.id}>
                      <td>{rewardRequest.created_at}</td>
                      <td>{rewardRequest.user_name}</td>
                      <td>{rewardRequest.reward_title}</td>
                      <td>{rewardRequest.status_formatted}</td>
                      <td>{rewardRequest.position_name}</td>
                      <td>{rewardRequest.department_name}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </RewardRequestsContainer>
        </Content>
      </Container>
    </>
  );
};

export default AdminRewardRequestsReport;
