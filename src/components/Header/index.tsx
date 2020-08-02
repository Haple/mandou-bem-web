import React, { useState } from 'react';

import { FiMenu } from 'react-icons/fi';
import { Container, StyledLink, MenuButton } from './styles';

const Header: React.FC = () => {
  const [toggled, setToggled] = useState(false);

  return (
    <Container toggled={toggled}>
      <header>
        <h2>
          Mandou <b>Bem</b>
        </h2>
        <nav>
          <StyledLink to="/admin-panel/feed">Feed</StyledLink>
          <StyledLink to="/admin-panel/profile">Meu Perfil</StyledLink>
          <StyledLink to="/admin-panel/catalog">Catálogo</StyledLink>
          <StyledLink to="/admin-panel">Painel administrativo</StyledLink>
        </nav>

        <MenuButton>
          <button type="button" onClick={() => setToggled(!toggled)}>
            <FiMenu />
          </button>
        </MenuButton>
      </header>
    </Container>
  );
};

export default Header;
