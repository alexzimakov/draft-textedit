import {
  faBold,
  faCode,
  faItalic,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import { Utils } from '../../lib';
import InlineStylePlugin from './InlineStylePlugin';

export const boldPlugin = new InlineStylePlugin({
  inlineStyle: 'BOLD',
  icon: faBold,
  title: `Bold (${Utils.detectOS() === 'macOS' ? '\u2318' : 'Ctrl+'}B)`,
});
export const italicPlugin = new InlineStylePlugin({
  inlineStyle: 'ITALIC',
  icon: faItalic,
  title: `Italic (${Utils.detectOS() === 'macOS' ? '\u2318' : 'Ctrl+'}I)`,
});
export const underlinePlugin = new InlineStylePlugin({
  inlineStyle: 'UNDERLINE',
  icon: faUnderline,
  title: `Underline (${Utils.detectOS() === 'macOS' ? '\u2318' : 'Ctrl+'}U)`,
});
export const codePlugin = new InlineStylePlugin({
  inlineStyle: 'CODE',
  icon: faCode,
  title: 'Monospace',
});
export const strikethroughPlugin = new InlineStylePlugin({
  inlineStyle: 'STRIKETHROUGH',
  icon: faStrikethrough,
  title: 'Strikethrough',
});
