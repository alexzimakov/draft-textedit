// @flow

import styled from 'styled-components';
import color from 'color';
import { baseFontStack } from '../../constants/fonts';
import { dropdownBackgroundColor, dropdownShadowColor } from '../../constants/colors';

export const Container = styled.div`
  top: 0;
  left: 0;
  display: inline-flex;
  box-sizing: border-box;
  width: auto;
  min-width: 128px;
  padding: 8px 0;
  border-radius: 4px;
  box-shadow: 0 4px 4px -2px ${color(dropdownShadowColor)
        .alpha(0.2)
        .string()},
    0 8px 12px
      ${color(dropdownShadowColor)
        .alpha(0.15)
        .string()},
    0 0 8px 2px
      ${color(dropdownShadowColor)
        .alpha(0.1)
        .string()};
  background: ${dropdownBackgroundColor};
  font-family: ${baseFontStack};
`;
