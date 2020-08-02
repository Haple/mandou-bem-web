import React, { useState, useEffect } from 'react';

import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import Header from '~/components/Header';

import { Container, Content, CatalogReward, AddCatalogReward } from './styles';
import Button from '~/components/Button';
import api from '~/services/api';

interface CatalogRewardData {
  id: string;
  title: string;
  points: number;
  image_url: string;
}

const AdminCatalog: React.FC = () => {
  const [catalogRewards, setCatalogRewards] = useState<CatalogRewardData[]>([]);

  useEffect(() => {
    async function loadCatalogRewards(): Promise<void> {
      const response = await api.get<CatalogRewardData[]>('/catalog-rewards');
      setCatalogRewards(response.data);
    }

    loadCatalogRewards();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <h2>Deixe o catálogo com a cara da sua empresa</h2>
        <Content>
          <AddCatalogReward>
            <FiPlus />
            <span>Novo prêmio</span>
          </AddCatalogReward>

          {catalogRewards &&
            catalogRewards.map((catalogReward) => (
              <CatalogReward>
                <span>{catalogReward.title}</span>
                <img src={catalogReward.image_url} alt="Imagem do prêmio" />
                <div>
                  <Button light>
                    <FiEdit />
                    Editar
                  </Button>
                  <Button light>
                    <FiTrash />
                    Excluir
                  </Button>
                </div>
              </CatalogReward>
            ))}
        </Content>
      </Container>
    </>
  );
};

export default AdminCatalog;
