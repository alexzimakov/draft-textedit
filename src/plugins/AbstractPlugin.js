// @flow

import type { Node } from 'react';
import type { Plugin, EditorActions } from '../constants/types';

export default class AbstractPlugin implements Plugin {
  name: string;
  editorActions: ?EditorActions;

  setEditorActions(editorActions: EditorActions): void {
    this.editorActions = editorActions;
  }

  renderToolbarItem(props: any): Node {
    return null;
  }

  renderWidget(props: any): Node {
    return null;
  }
}
