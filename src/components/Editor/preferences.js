import faUnderline from '@fortawesome/fontawesome-free-solid/faUnderline';
import faItalic from '@fortawesome/fontawesome-free-solid/faItalic';
import faBold from '@fortawesome/fontawesome-free-solid/faBold';
import faStrikethrough from '@fortawesome/fontawesome-free-solid/faStrikethrough';
import faCode from '@fortawesome/fontawesome-free-solid/faCode';
import { detectOS } from '../../lib/utils';
import * as inlineStyles from '../../constants/inlineStyles';
import * as blockTypes from '../../constants/blockTypes';

const OS = detectOS();
const {
  headerOne,
  headerTwo,
  headerThree,
  headerFour,
  paragraph,
  blockQuote,
  unorderedList,
  orderedList,
  codeBlock,
} = blockTypes;
const { bold, italic, underline, strikeThrough, code } = inlineStyles;

export const maxListDepth = 3;
export const blockTypeOptions = [
  headerOne,
  headerTwo,
  headerThree,
  headerFour,
  paragraph,
  blockQuote,
  unorderedList,
  orderedList,
  codeBlock,
];
export const inlineStyleControls = [
  { icon: faBold, label: `Bold (${OS === 'mac' ? '\u2318B' : 'Ctrl+B'})`, style: bold },
  { icon: faItalic, label: `Italic (${OS === 'mac' ? '\u2318I' : 'Ctrl+I'})`, style: italic },
  {
    icon: faUnderline,
    label: `Underline (${OS === 'mac' ? '\u2318U' : 'Ctrl+U'})`,
    style: underline,
  },
  { icon: faStrikethrough, label: 'Strikethrough', style: strikeThrough },
  { icon: faCode, label: 'Code', style: code },
];
