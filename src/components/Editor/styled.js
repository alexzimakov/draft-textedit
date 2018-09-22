// @flow

import styled, { css } from 'styled-components';
import { baseFontStack } from '../../constants/fonts';
import {
  focusedShadowColor,
  inputBorderColor,
  inputFocusBorderColor,
  inputPlaceholderColor,
  editorBackgroundColor,
  editorToolbarBackgroundColor,
  editorTextColor,
  blockQuoteBorderColor,
  blockQuoteBackgroundColor,
} from '../../constants/colors';

function blockMixin() {
  return css`
    margin: 0;
    padding: 0;
    color: ${editorTextColor};
    font-family: ${baseFontStack};
    font-weight: 400;

    * + & {
      margin-top: 1.2em;
    }
  `;
}

function typography(size, leading, tracking) {
  return css`
    letter-spacing: ${0.001 * tracking}em;
    font-size: ${size / 16}rem;
    line-height: ${leading / size};
  `;
}

export const StyledEditor = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 48px 0 0;
  transition-duration: 150ms;
  transition-timing-function: ease;
  transition-property: box-shadow, border-color;
  border: 1px solid ${props => (props.hasFocus ? inputFocusBorderColor : inputBorderColor)};
  border-radius: 3px;
  box-shadow: ${props => (props.hasFocus ? `0 0 0 3px ${focusedShadowColor}` : 'none')};
  background: ${editorBackgroundColor};
  font-family: ${baseFontStack};
  font-size: 1rem;
`;

export const Toolbar = styled.div`
  position: absolute;
  z-index: 999;
  top: 0;
  bottom: auto;
  left: 0;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  transition-duration: 300ms;
  transition-property: box-shadow;
  transition-timing-function: ease;
  border-radius: 2px 2px 0 0;
  background: ${editorToolbarBackgroundColor};
  will-change: box-shadow;

  ::before,
  ::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: block;
    width: 16px;
    height: 100%;
    content: '';
    background: linear-gradient(to right, white, rgba(255, 255, 255, 0));
  }

  ::after {
    right: 0;
    left: auto;
    background: linear-gradient(to left, white, rgba(255, 255, 255, 0));
  }
`;

export const ToolbarItems = styled.ul`
  display: flex;
  overflow: auto;
  box-sizing: border-box;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  -webkit-overflow-scrolling: touch;
`;

export const ToolbarItem = styled.li`
  padding-right: 2px;

  :first-child {
    padding-left: 16px;
  }

  :last-child {
    padding-right: 16px;
  }
`;

export const EditorContent = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 320px;
  padding: 0 16px 8px;
  cursor: text;

  .public-DraftEditorPlaceholder-root {
    ${typography(15, 20, -16)};
    position: absolute;
    top: 0;
    left: 16px;
    z-index: 0;
    display: ${props => (props.shouldHidePlaceholder ? 'none' : 'block')};
    pointer-events: none;
    color: ${inputPlaceholderColor};
  }

  .public-DraftStyleDefault-ul,
  .public-DraftStyleDefault-ol {
    ${blockMixin};
    ${typography(15, 20, -16)};
    padding-left: 24px;
  }

  .public-DraftStyleDefault-ul *,
  .public-DraftStyleDefault-ol * {
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
  }

  .public-DraftStyleDefault-ul li + li,
  .public-DraftStyleDefault-ol li + li {
    margin-top: 0.75em;
  }

  .public-DraftStyleDefault-ul .public-DraftStyleDefault-depth1,
  .public-DraftStyleDefault-ol .public-DraftStyleDefault-depth1 {
    margin-left: 24px;
  }

  .public-DraftStyleDefault-ul .public-DraftStyleDefault-depth2,
  .public-DraftStyleDefault-ol .public-DraftStyleDefault-depth2 {
    margin-left: 48px;
  }

  .public-DraftStyleDefault-ol .public-DraftStyleDefault-orderedListItem {
    position: relative;
    list-style: none;

    :first-child {
      counter-reset: depth0;
    }

    ::before {
      position: absolute;
      left: -16px;
      counter-increment: depth0;
      content: counter(depth0) '. ';
    }
  }

  .public-DraftStyleDefault-ol .public-DraftStyleDefault-depth0 + .public-DraftStyleDefault-depth1 {
    counter-reset: depth1;
  }

  .public-DraftStyleDefault-ol .public-DraftStyleDefault-depth1 + .public-DraftStyleDefault-depth2 {
    counter-reset: depth2;
  }

  .public-DraftStyleDefault-ol .public-DraftStyleDefault-depth1 {
    ::before {
      counter-increment: depth1;
      content: counter(depth1, lower-alpha) '. ';
    }
  }

  .public-DraftStyleDefault-ol .public-DraftStyleDefault-depth2 {
    ::before {
      counter-increment: depth2;
      content: counter(depth2, upper-roman) '. ';
    }
  }

  .public-DraftStyleDefault-ul .public-DraftStyleDefault-depth1 {
    list-style: circle;
  }

  .public-DraftStyleDefault-ul .public-DraftStyleDefault-depth2 {
    list-style: square;
  }
`;

export const Widgets = styled.ul`
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const WidgetItem = styled.li``;

export const Unstyled = styled.div`
  ${blockMixin};
  ${typography(15, 20, -16)};
`;

export const HeaderOne = styled.h1`
  ${blockMixin};
  ${typography(26, 32, 14)};
  font-weight: 600;

  * + & {
    margin-top: 1.6em;
  }
`;

export const HeaderTwo = styled.h2`
  ${blockMixin};
  ${typography(20, 25, 19)};
  font-weight: 600;

  * + & {
    margin-top: 1.4em;
  }
`;

export const HeaderThree = styled.h3`
  ${blockMixin};
  ${typography(18, 23, -25)};
  font-weight: 500;
`;

export const HeaderFour = styled.h4`
  ${blockMixin};
  ${typography(15, 20, 16)};
  font-weight: 500;
`;

export const HeaderFive = styled.h5`
  ${blockMixin};
  ${typography(15, 20, 16)};
  font-weight: 400;
  text-transform: uppercase;
`;

export const HeaderSix = styled.h6`
  ${blockMixin};
  ${typography(14, 19, -11)};
  font-weight: 600;
`;

export const Blockquote = styled.blockquote`
  ${blockMixin};
  ${typography(15, 20, -16)};
  box-sizing: border-box;
  padding: 16px 16px 16px 24px;
  background: ${blockQuoteBackgroundColor};
  border-left: 4px solid ${blockQuoteBorderColor};
`;

export const CodeBlock = styled.pre`
  ${blockMixin};
`;

export const Atomic = styled.figure`
  ${blockMixin};
`;
