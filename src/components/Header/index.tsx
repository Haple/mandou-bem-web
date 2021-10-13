import React, { useState } from 'react';

import { FiMenu } from 'react-icons/fi';
import { Container, StyledLink, MenuButton } from './styles';
import { useAuth } from '~/hooks/auth';

const Header: React.FC = () => {
  const [toggled, setToggled] = useState(false);
  const { user } = useAuth();

  return (
    <Container toggled={toggled}>
      <header>
        <div className="firstRow">
          <div>
            <h2>
              Mandou <b>Bem</b>
            </h2>
          </div>

          <MenuButton>
            <button type="button" onClick={() => setToggled(!toggled)}>
              <FiMenu />
            </button>
          </MenuButton>
        </div>

        <nav>
          <StyledLink to="/feed">Feed</StyledLink>
          <StyledLink to="/profile">Meu Perfil</StyledLink>
          <StyledLink to="/catalog">Catálogo</StyledLink>
          <StyledLink to="/my-reward-requests">
            Meus resgates de prêmios
          </StyledLink>
          {user?.is_admin && (
            <StyledLink to="/admin-panel">Painel administrativo</StyledLink>
          )}
        </nav>
      </header>
    </Container>
  );
};

export default Header;
