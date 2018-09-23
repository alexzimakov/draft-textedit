// @flow

import styled from 'styled-components';
import color from 'color';
import { baseFontStack } from '../../constants/fonts';
import {
  dialogBackdropBackgroundColor,
  dialogContainerBackgroundColor,
  dialogContainerShadowColor,
  dialogTitleColor,
  dialogTextColor,
} from '../../constants/colors';

export const Backdrop = styled.div`
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: ${dialogBackdropBackgroundColor};
`;

export const Title = styled.h2`
  margin: 0 0 1em;
  letter-spacing: -0.019em;
  color: ${dialogTitleColor};
  font-size: 1.25rem;
  line-height: 1.25;
`;

export const Content = styled.section`
  color: inherit;
  font-size: 0.9375rem;
  line-height: 1.33333;
`;

export const Buttons = styled.footer`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  padding: 16px 0 0;

  > * + * {
    margin-right: 8px;
  }
`;

export const Container = styled.aside`
  position: fixed;
  z-index: 99999;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: 480px;
  max-width: 90%;
  padding: 16px 24px;
  transform: translate(-50%, -50%);
  color: ${dialogTextColor};
  border-radius: 8px;
  box-shadow: 0 8px 14px -4px ${color(dialogContainerShadowColor)
        .alpha(0.2)
        .string()},
    0 24px 40px 4px
      ${color(dialogContainerShadowColor)
        .alpha(0.15)
        .string()};
  background: ${dialogContainerBackgroundColor};
  font-family: ${baseFontStack};
`;

export const Wrapper = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
`;
