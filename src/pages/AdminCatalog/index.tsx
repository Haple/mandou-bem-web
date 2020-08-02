import React from 'react';

import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import Header from '~/components/Header';

import { Container, Content, CatalogReward, AddCatalogReward } from './styles';
import Button from '~/components/Button';

const AdminPanel: React.FC = () => {
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
          <CatalogReward>
            <span>2 mêses de Netflix</span>
            <img
              src="https://tecnoblog.net/wp-content/uploads/2019/12/thibault-penin-awol7qqsffm-unsplash-700x467.jpg"
              alt="Ilustração de um rapaz sentado em uma grande caixa de presentes"
            />
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
        </Content>
      </Container>
    </>
  );
};

export default AdminPanel;
