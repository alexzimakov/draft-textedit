// @flow

import * as React from 'react';
import * as types from '../../constants/types';
import getStyledButton, { Icon } from './styled';
import type { ButtonVariant, ButtonSize } from './styled';

type Props = {
  forwardedRef?: () => void | { current: ?Element },
  children: React.Node,
  icon?: types.FaIcon,
  variant: ButtonVariant,
  size: ButtonSize,
  styled: {
    containerColor?: string,
    iconColor?: string,
    labelColor?: string,
    horizontalPadding?: number,
    cornerRadius?: number,
  },
};

function Button({
  forwardedRef,
  children,
  icon,
  variant = 'default',
  size = 'medium',
  styled = {},
  ...otherProps
}: Props = {}) {
  const StyledButton = getStyledButton(variant);

  return (
    <StyledButton
      innerRef={forwardedRef}
      {...otherProps}
      styled={styled}
      size={size}
      hasLabel={Boolean(children)}>
      {icon && <Icon icon={icon} />}
      {children}
    </StyledButton>
  );
}

export default Button;
