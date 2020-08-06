import React, { useState, useEffect, useCallback } from 'react';

import { FiCheck } from 'react-icons/fi';
import Header from '~/components/Header';

import defaultAvatar from '~/assets/default-avatar.png';

import { Container, RewardRequest } from './styles';
import Button from '~/components/Button';
import api from '~/services/api';
import { useToast } from '~/hooks/toast';

interface IRewardRequest {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  catalog_reward: {
    title: string;
  };
}

const AdminRewardRequests: React.FC = () => {
  const [rewardRequests, setRewardRequests] = useState<IRewardRequest[]>([]);

  const { addToast } = useToast();

  useEffect(() => {
    async function loadCatalogRewards(): Promise<void> {
      const response = await api.get<IRewardRequest[]>('/reward-requests', {
        params: {
          status: 'CREATED',
        },
      });
      setRewardRequests(response.data);
    }

    loadCatalogRewards();
  }, []);

  const handleDeliverRewardRequest = useCallback(
    async (id: string) => {
      try {
        await api.patch<IRewardRequest>(`/reward-requests/${id}/deliver`);
        const updatedRewardRequests = rewardRequests.filter((r) => r.id !== id);
        setRewardRequests(updatedRewardRequests);
        addToast({
          type: 'success',
          title: 'Prêmio marcado como entregue',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao marcar prêmio como entregue',
          description:
            'Ocorreu um erro ao marcar o prêmio como entregue, tente novamente.',
        });
      }
    },
    [addToast, rewardRequests],
  );

  return (
    <>
      <Header />

      <Container>
        <h2>Organize a entrega dos prêmios</h2>

        {rewardRequests &&
          rewardRequests.map((rewardRequest) => (
            <RewardRequest key={rewardRequest.id}>
              <div>
                <img
                  src={
                    rewardRequest.user.avatar
                      ? rewardRequest.user.avatar
                      : defaultAvatar
                  }
                  alt={rewardRequest.user.name}
                />
                <div>
                  <strong>{rewardRequest.user.name}</strong>
                  <span>
                    @{rewardRequest.user.username} resgatou o prêmio
                    <strong> {rewardRequest.catalog_reward.title}</strong>
                  </span>
                </div>
              </div>
              <Button
                light
                onClick={() => handleDeliverRewardRequest(rewardRequest.id)}
              >
                <FiCheck />
                Prêmio entregue
              </Button>
            </RewardRequest>
          ))}
      </Container>
    </>
  );
};

export default AdminRewardRequests;
