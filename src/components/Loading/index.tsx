import React from 'react';

import Loader from 'react-loader-spinner';
import { Container } from './styles';

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  return (
    <>
      {loading && (
        <Container>
          <Loader type="Oval" color="#b987e1" height={100} width={100} />
        </Container>
      )}
    </>
  );
};

export default Loading;
