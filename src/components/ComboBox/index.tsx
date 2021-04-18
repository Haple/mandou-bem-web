import React, {
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
  label?: string;
}

const ComboBox: React.FC<SelectProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  label,
  children,
  ...rest
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleSelectFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleSelectBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!selectRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'value',
    });
    if (selectRef.current?.value) {
      setIsFilled(true);
    }
  }, [fieldName, registerField]);
  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
      data-testid="select-container"
    >
      {Icon && <Icon size={20} />}

      <div>
        {label && <label onClick={handleSelectFocus}>{label}</label>}
        <select
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          defaultValue={defaultValue}
          ref={selectRef}
          {...rest}
        >
          {children}
        </select>
      </div>

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default ComboBox;
