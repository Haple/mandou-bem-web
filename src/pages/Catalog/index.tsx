import React, { useState, useEffect, useCallback } from 'react';

import Header from '~/components/Header';

import { Container, Content, CatalogReward } from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import { useToast } from '~/hooks/toast';

interface ICatalogRewardData {
  id: string;
  title: string;
  points: number;
  image_url: string;
}

interface IUserData {
  recognition_points: number;
}

const Catalog: React.FC = () => {
  const [catalogRewards, setCatalogRewards] = useState<ICatalogRewardData[]>(
    [],
  );

  const [userData, setUserData] = useState<IUserData>({} as IUserData);

  const { addToast } = useToast();

  const loadUserData = useCallback(async () => {
    const response = await api.get<IUserData>('/profile');
    setUserData(response.data);
  }, []);

  useEffect(() => {
    async function loadCatalogRewards(): Promise<void> {
      const response = await api.get<ICatalogRewardData[]>('/catalog-rewards');
      setCatalogRewards(response.data);
    }

    loadCatalogRewards();
    loadUserData();
  }, [loadUserData]);

  const handleCreateRewardRequest = useCallback(
    async (id: string) => {
      try {
        await api.post<ICatalogRewardData>(`reward-requests`, {
          catalog_reward_id: id,
        });
        addToast({
          type: 'success',
          title: 'Prêmio resgatado com sucesso',
          description:
            'Aguarde o RH entrar em contato para receber seu prêmio :)',
        });
        await loadUserData();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao resgatar prêmio',
          description: 'Ocorreu um erro ao resgatar o prêmio, tente novamente.',
        });
      }
    },
    [addToast],
  );

  return (
    <>
      <Header />

      <Container>
        <h2>
          Você tem <span>{userData.recognition_points} pontos</span> para
          resgatar
        </h2>
        <Content>
          {catalogRewards &&
            catalogRewards.map((catalogReward) => (
              <CatalogReward key={catalogReward.id}>
                <span>{catalogReward.title}</span>
                <img src={catalogReward.image_url} alt="Imagem do prêmio" />
                <div>
                  <Button
                    light
                    disabled={
                      catalogReward.points > userData.recognition_points
                    }
                    onClick={() => handleCreateRewardRequest(catalogReward.id)}
                  >
                    {catalogReward.points > userData.recognition_points
                      ? `${catalogReward.points} pontos`
                      : 'Resgatar'}
                  </Button>
                </div>
              </CatalogReward>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default Catalog;
