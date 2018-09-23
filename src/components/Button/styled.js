// @flow

import styled from 'styled-components';
import color from 'color';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { baseFontStack } from '../../constants/fonts';
import {
  focusedShadowColor,
  buttonContainerColor,
  buttonIconColor,
  buttonLabelColor,
} from '../../constants/colors';

export type ButtonVariant = 'text' | 'outlined' | 'default';
export type ButtonSize = 'small' | 'medium' | 'large';

export function getHeight({ size }: { size: ButtonSize }): string {
  switch (size) {
    case 'large':
      return '40px';
    case 'small':
      return '24px';
    case 'medium':
    default:
      return '32px';
  }
}

export function getBorderRadius({
  size,
  styled,
}: {
  size: ButtonSize,
  styled: { cornerRadius: number },
}): string {
  if (styled.cornerRadius || styled.cornerRadius === 0) {
    return `${styled.cornerRadius}px`;
  }

  switch (size) {
    case 'large':
      return '5px';
    case 'small':
      return '3px';
    case 'medium':
    default:
      return '4px';
  }
}

export const Icon = styled(FontAwesomeIcon)``;

export const BaseButton = styled.button`
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: ${getHeight};
  height: ${getHeight};
  margin: 0;
  padding: 0 ${props => props.styled.horizontalPadding || 16}px;
  cursor: pointer;
  user-select: none;
  transition-timing-function: ease;
  transition-duration: 150ms;
  transition-property: background-color, box-shadow, opacity;
  vertical-align: middle;
  white-space: nowrap;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  border: none;
  border-radius: ${getBorderRadius};
  outline: none;
  background: none;
  font-size: 0.875rem;
  font-family: ${baseFontStack};
  font-weight: 500;
  line-height: 1;
  appearance: none;
  will-change: opacity, background-color, box-shadow;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  &:focus {
    box-shadow: 0 0 0 3px ${focusedShadowColor};
  }

  ${Icon} {
    margin: ${props => (props.hasLabel ? '0 8px 0 0' : '0')};
    color: ${props => props.styled.iconColor || buttonIconColor};
  }
`;

export const DefaultButton = styled(BaseButton)`
  color: ${props => props.styled.labelColor || buttonLabelColor};
  background: ${props => props.styled.containerColor || buttonContainerColor};

  &:enabled:hover {
    background-color: ${props =>
      color(props.styled.containerColor || buttonContainerColor)
        .lighten(0.1)
        .string()};
  }

  &:enabled:active {
    background-color: ${props =>
      color(props.styled.containerColor || buttonContainerColor)
        .darken(0.1)
        .string()};
  }
`;

export const TextButton = styled(BaseButton)`
  color: ${props => props.styled.containerColor || buttonContainerColor};

  &:enabled:hover {
    background: ${props =>
      color(props.styled.containerColor || buttonContainerColor)
        .alpha(0.1)
        .string()};
  }
`;

export const OutlinedButton = styled(BaseButton)`
  color: ${props => props.styled.containerColor || buttonContainerColor};
  border: 1px solid ${props => props.styled.containerColor || buttonContainerColor};

  &:enabled:hover {
    background-color: ${props =>
      color(props.styled.containerColor || buttonContainerColor)
        .alpha(0.1)
        .string()};
  }
`;

export default function getStyledButton(type: ButtonVariant) {
  switch (type) {
    case 'text':
      return TextButton;
    case 'outlined':
      return OutlinedButton;
    case 'default':
    default:
      return DefaultButton;
  }
}
