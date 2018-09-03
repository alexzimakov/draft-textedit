// @flow

import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import * as types from '../../constants/types';
import { baseFontStack, monospaceFontStack } from '../../constants/fonts';
import {
  blockTypeOptionBackgroundColor,
  blockTypeOptionTextColor,
  blockTypeOptionHoverColor,
} from '../../constants/colors';

const optionHeight = 40;

export const Arrow = styled(FontAwesomeIcon).attrs({ icon: faChevronDown })`
  margin-left: 8px;
  font-size: 90%;
`;

export const Label = styled.span`
  display: inline-block;
  overflow: hidden;
  text-align: left;
  width: 112px;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32px;
`;

export const CheckIcon = styled(FontAwesomeIcon).attrs({ icon: faCheck })`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 400;
`;

export const Option = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: ${optionHeight}px;
  padding: 0 32px;
  cursor: pointer;
  color: ${blockTypeOptionTextColor};
  background: ${blockTypeOptionBackgroundColor};
  font-family: ${baseFontStack};
  font-size: 0.875rem;

  &:hover {
    background: ${blockTypeOptionHoverColor};
  }
`;

export const HeaderOneOption = Option.extend`
  font-size: 1.602rem;
  font-weight: 700;
`;

export const HeaderTwoOption = Option.extend`
  font-size: 1.424rem;
  font-weight: 700;
`;

export const HeaderThreeOption = Option.extend`
  font-size: 1.266rem;
  font-weight: 700;
`;

export const HeaderFourOption = Option.extend`
  font-size: 1.125rem;
  font-weight: 700;
`;

export const HeaderFiveOption = Option.extend`
  font-size: 1rem;
  font-weight: 700;
`;

export const HeaderSixOption = Option.extend`
  font-weight: 700;
`;

export const BlockquoteOption = Option.extend`
  &::before {
    content: '\\0201C';
  }

  &::after {
    content: '\\0201D';
  }
`;

export const CodeBlockOption = Option.extend`
  font-family: ${monospaceFontStack};
`;

export const UnorderListOption = Option.extend`
  &::before {
    display: inline-block;
    margin-right: 8px;
    content: '\\02022';
  }
`;

export const OrderListOption = Option.extend`
  &::before {
    display: inline-block;
    margin-right: 8px;
    content: '1.';
  }
`;

export const OptionList = styled.ul`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export function getStyledOption(option: types.BlockType) {
  switch (option) {
    case 'header-one':
      return HeaderOneOption;
    case 'header-two':
      return HeaderTwoOption;
    case 'header-three':
      return HeaderThreeOption;
    case 'header-four':
      return HeaderFourOption;
    case 'header-five':
      return HeaderFiveOption;
    case 'header-six':
      return HeaderSixOption;
    case 'blockquote':
      return BlockquoteOption;
    case 'code-block':
      return CodeBlockOption;
    case 'unordered-list-item':
      return UnorderListOption;
    case 'ordered-list-item':
      return OrderListOption;
    default:
      return Option;
  }
}
