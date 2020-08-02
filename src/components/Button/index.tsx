import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  light?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  light = false,
  ...rest
}) => (
  <Container type="button" light={light} {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
