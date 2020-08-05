import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  light?: boolean;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  light = false,
  disabled = false,
  ...rest
}) => (
  <Container type="button" light={light} disabled={disabled} {...rest}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
