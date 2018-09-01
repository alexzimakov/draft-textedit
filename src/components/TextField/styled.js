// @flow

import styled, { css } from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {
  focusedShadowColor,
  textFieldBorderColor,
  textFieldFocusBorderColor,
  textFieldBackgroundColor,
  textFieldDisabledBackgroundColor,
  textFieldPlaceholderColor,
  textFieldTextColor,
  textFieldLeadingIconColor,
  textFieldTrailingIconColor,
} from '../../constants/colors';

export const LeadingIcon = styled(FontAwesomeIcon)`
  ${iconMixin};
  margin-right: 8px;
  color: ${textFieldLeadingIconColor};
`;

export const TrailingIcon = styled(FontAwesomeIcon)`
  ${iconMixin};
  margin-left: 8px;
  color: ${textFieldTrailingIconColor};
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  cursor: inherit;
  border: none;
  outline: none;
  color: inherit;
  background: none;
  font-size: inherit;
  appearance: none;

  &::placeholder {
    color: ${textFieldPlaceholderColor};
  }
`;

export const InputContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  min-width: 180px;
  height: ${getHeight};
  padding: 0 8px;
  cursor: ${props => (props.isDisabled ? 'not-allowed' : 'text')};
  transition-duration: 150ms;
  transition-timing-function: ease;
  transition-property: box-shadow, border-color;
  color: ${textFieldTextColor};
  border: 1px solid ${props => (props.isFocused ? textFieldFocusBorderColor : textFieldBorderColor)};
  border-radius: ${getBorderRadius};
  box-shadow: ${getBoxShadow};
  background: ${props =>
    props.isDisabled ? textFieldDisabledBackgroundColor : textFieldBackgroundColor};
  font-size: ${getFontSize};

  ${Input} {
    flex: 1;
  }
`;

function iconMixin() {
  return css`
    margin: 0;
    font-size: 90%;
  `;
}

function getHeight({ size }: { size: string }): string {
  if (size === 'small') {
    return '24px';
  }

  if (size === 'large') {
    return '40px';
  }

  return '32px';
}

function getBorderRadius({ size }: { size: string }): string {
  if (size === 'small') {
    return '3px';
  }

  return '4px';
}

function getFontSize({ size }: { size: string }): string {
  if (size === 'small') {
    return '0.75rem';
  }

  if (size === 'large') {
    return '0.875rem';
  }

  return '0.8125rem';
}

function getBoxShadow({ isFocused, size }: { isFocused: boolean, size: string }): string {
  if (!isFocused) {
    return 'none';
  }

  return `0 0 0 ${size === 'small' ? '2px' : '3px'} ${focusedShadowColor}`;
}
