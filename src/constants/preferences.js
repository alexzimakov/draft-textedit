// @flow

import SpacePlugin from '../plugins/SpacePlugin';
import BlockPickerPlugin from '../plugins/BlockPickerPlugin';
import {
  boldPlugin,
  italicPlugin,
  underlinePlugin,
  codePlugin,
  strikethroughPlugin,
} from '../plugins/InlineStylePlugin/builtinPlugins';
import {
  unorderedListPlugin,
  orderedListPlugin,
  blockquotePlugin,
} from '../plugins/BlockPlugin/builtinPlugins';
import LinkPlugin from '../plugins/LinkPlugin';
import UndoPlugin from '../plugins/UndoPlugin';
import RedoPlugin from '../plugins/RedoPlugin';

export const maxListDepth = 2;
export const plugins = [
  new BlockPickerPlugin(),
  new SpacePlugin(),
  boldPlugin,
  italicPlugin,
  underlinePlugin,
  codePlugin,
  strikethroughPlugin,
  new SpacePlugin(),
  unorderedListPlugin,
  orderedListPlugin,
  blockquotePlugin,
  new SpacePlugin(),
  new LinkPlugin(),
  new SpacePlugin(),
  new UndoPlugin(),
  new RedoPlugin(),
];
