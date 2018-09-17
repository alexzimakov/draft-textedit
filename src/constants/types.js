// @flow

export type Ref<T> = { current: ?T };

export type Style = {
  [string]: number | string,
};

export type FaIcon = {
  icon: Array<mixed>,
  iconName: string,
  prefix: string,
};

export type BlockType =
  | 'header-one'
  | 'header-two'
  | 'header-three'
  | 'header-four'
  | 'header-five'
  | 'header-six'
  | 'blockquote'
  | 'code-block'
  | 'atomic'
  | 'unordered-list-item'
  | 'ordered-list-item'
  | 'unstyled';

export type EntityType = 'LINK' | 'TOKEN' | 'PHOTO' | 'IMAGE';

export type Mutability = 'MUTABLE' | 'IMMUTABLE' | 'SEGMENTED';

