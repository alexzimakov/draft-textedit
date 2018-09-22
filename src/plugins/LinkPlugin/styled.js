// @flow

import styled from 'styled-components';
import {
  linkPluginTextColor,
  linkPluginBackgroundColor,
  linkPluginActiveTextColor,
  linkPluginActiveBackgroundColor,
  linkPluginActionButtonBackgroundColor,
  linkPluginActionButtonBorderColor,
  linkPluginActionButtonBackgroundHoverColor,
} from '../../constants/colors';

export const Anchor = styled.a`
  color: ${props => (props.isActive ? linkPluginActiveTextColor : linkPluginTextColor)} !important;
  transition-duration: 150ms;
  transition-property: background-color;
  transition-timing-function: ease;
  text-decoration: underline;
  background: ${props =>
    props.isActive ? linkPluginActiveBackgroundColor : linkPluginBackgroundColor};
`;

export const ActionButton = styled.button`
  box-sizing: border-box;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  background: ${linkPluginActionButtonBackgroundColor};
  font-size: 14px;
  appearance: none;

  :enabled:hover {
    background: ${linkPluginActionButtonBackgroundHoverColor};
  }

  :disabled {
    cursor: not-allowed;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  margin: -8px 0;
  
  ${ActionButton} + ${ActionButton} {
    border-left: 1px solid ${linkPluginActionButtonBorderColor};
  }

  ${ActionButton}:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  ${ActionButton}:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

export const LabelWrapper = styled.div`
  display: table-cell;
  box-sizing: border-box;
  padding: 0 8px 0;
  text-align: right;
  white-space: nowrap;
  font-size: 0.9375rem;
  color: inherit;
`;

export const RadioButton = styled.label`
  display: inline-flex;
  align-items: center;

  > input {
    margin-right: 8px;
  }
`;

export const InputWrapper = styled.div`
  display: table-cell;
  width: 100%;
  
  ${RadioButton} + ${RadioButton} {
    margin-left: 24px;
  }
`;

export const TextFieldWrapper = styled.div`
  display: table-cell;

  > * {
    width: 100%;
  }
`;

export const FormField = styled.div`
  display: table-row;

  & + & > * {
    padding-top: 16px;
  }
`;

export const Form = styled.form`
  display: table;
  width: 100%;
`;
