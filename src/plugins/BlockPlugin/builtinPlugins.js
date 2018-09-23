import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight';
import BlockPlugin from './BlockPlugin';

export const unorderedListPlugin = new BlockPlugin({
  blockType: 'unordered-list-item',
  icon: faListUl,
  title: 'Unorder list',
});
export const orderedListPlugin = new BlockPlugin({
  blockType: 'ordered-list-item',
  icon: faListOl,
  title: 'Order list',
});
export const blockquotePlugin = new BlockPlugin({
  blockType: 'blockquote',
  icon: faQuoteRight,
  title: 'Blockquote',
});
