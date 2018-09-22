// @flow

import styled from 'styled-components';
import color from 'color';
import {
  toolbarButtonContainerColor,
  toolbarButtonActiveLabelColor,
  toolbarButtonTitleContainerColor,
  toolbarButtonTitleTextColor,
} from '../../constants/colors';
import { baseFontStack } from '../../constants/fonts';
import Button from '../Button';

function activeMixin({ isActive }: { isActive: boolean }): string {
  if (!isActive) {
    return '';
  }

  return `
    color: ${toolbarButtonActiveLabelColor};
    background-color: ${color(toolbarButtonContainerColor)
      .alpha(0.2)
      .string()} !important;
  `;
}

export const Title = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  overflow: hidden;
  box-sizing: border-box;
  height: 24px;
  padding: 0 8px;
  opacity: 0;
  color: ${toolbarButtonTitleTextColor};
  transition-timing-function: ease;
  transition-duration: 150ms;
  transition-property: opacity;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 3px;
  background: ${toolbarButtonTitleContainerColor};
  font-family: ${baseFontStack};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 24px;
  will-change: transform, opacity;
`;

const StyledButton = styled(Button)`
  ${activeMixin};
`;

export default StyledButton;
