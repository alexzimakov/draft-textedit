// @flow

import React from 'react';
import type { Node } from 'react';
import { EditorState } from 'draft-js';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { Utils } from '../../lib/index';
import AbstractPlugin from '../AbstractPlugin';
import ToolbarButton from '../../components/ToolbarButton';

type Preferences = {
  title?: string,
};

export default class UndoPlugin extends AbstractPlugin {
  title: ?string;

  constructor(preferences: Preferences = {}) {
    super();
    this.name = 'undo-plugin';
    this.title =
      preferences.title || `Undo (${Utils.detectOS() === 'macOS' ? '\u2318' : 'Ctrl+'}Z)`;
  }

  shouldDisableButton(): boolean {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();

      return editorState.getUndoStack().size === 0;
    }

    return true;
  }

  handlePress = () => {
    const editorActions = this.editorActions;

    if (editorActions) {
      const editorState = editorActions.getEditorState();
      const newEditorState = EditorState.undo(editorState);

      editorActions.setEditorState(newEditorState);
    }
  };

  renderToolbarItem = (): Node => {
    return (
      <ToolbarButton
        title={this.title}
        isDisabled={this.shouldDisableButton()}
        onPress={this.handlePress}>
        <FontAwesomeIcon icon={faUndo} />
      </ToolbarButton>
    );
  };
}
