// @flow

import * as React from 'react';
import * as types from '../../constants/types';
import { StyledSelect } from './styled';

type Props = {
  forwadedRef?: types.Ref<HTMLSelectElement>,
  size?: 'small' | 'medium' | 'large',
};

function Select(props: Props) {
  const { forwadedRef, ...otherProps } = props;
  return <StyledSelect innerRef={forwadedRef} {...otherProps} />;
}

Select.defaultProps = {
  size: 'medium',
};

export default Select;
