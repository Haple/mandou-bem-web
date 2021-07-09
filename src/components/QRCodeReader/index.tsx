import React from 'react';
import QrScan from 'react-qr-reader';

interface QRCodeReaderProps {
  handleScan(data: string | null): void;
  handleError(err: any): void;
}

const QRCodeReader: React.FC<QRCodeReaderProps> = ({
  handleScan,
  handleError,
}) => {
  return (
    <QrScan
      delay={300}
      onError={handleError}
      onScan={handleScan}
      style={{
        height: 300,
        width: 300,
      }}
    />
  );
};

export default QRCodeReader;
