// @flow

import type { Node } from 'react';
import { EditorState, ContentBlock, ContentState } from 'draft-js';

export type Ref<T> = { current: ?T };

export type Style = {
  [string]: number | string,
};

export type FaIcon = {
  icon: Array<mixed>,
  iconName: string,
  prefix: string,
};

export type InlineStyle = 'BOLD' | 'ITALIC' | 'UNDERLINE' | 'CODE' | 'STRIKETHROUGH';

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

export type EditorActions = {
  getEditorState: () => EditorState,
  setEditorState: (newEditorState: EditorState, callback?: () => mixed) => void,
  focus: () => void,
  blur: () => void,
  lock: (callback?: () => mixed) => void,
  unlock: (callback?: () => mixed) => void,
};

export type DecoratorComponentProps = {
  children: Node,
  contentState: ContentState,
  decoratedText: string,
  entityKey: string,
  offsetKey: string,
};

export type Decorator = {
  strategy: (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => void,
  component: (props: any) => Node,
  props?: Object,
};

export interface Plugin {
  +name: string;
  +editorActions: ?EditorActions;
  +getDecorator?: () => Decorator | Array<Decorator>;
  setEditorActions(editorActions: EditorActions): void;
  renderToolbarItem(props: any): Node;
  renderWidget(props: any): Node;
}
